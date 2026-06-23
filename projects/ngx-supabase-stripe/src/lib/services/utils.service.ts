import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  public formatAmount(amount: number, currency = 'EUR'): string {
    if (!amount) return 'N/A';

    const formatter = new Intl.NumberFormat(currency.toLocaleUpperCase() === 'EUR' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
    });
    
    return formatter.format(amount / 100);
  }
  
  public formatDate(timestamp: number | string): string {
    if (!timestamp) return 'N/A';
    
    const date = typeof timestamp === 'number'
      ? new Date(timestamp * 1000)
      : new Date(timestamp);
      
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
      case 'succeeded':
      case 'paid':
        return 'badge-success';
      case 'failed':
      case 'canceled':
      case 'unpaid':
        return 'badge-error';
      case 'pending':
      case 'processing':
      case 'trialing':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  }

  public translateStripeStatus(status: string): string {
    const labels: Record<string, string> = {
      active: $localize`:@@stripe.status.active:Active`,
      canceled: $localize`:@@stripe.status.canceled:Canceled`,
      cancelled: $localize`:@@stripe.status.canceled:Canceled`,
      incomplete: $localize`:@@stripe.status.incomplete:Incomplete`,
      incomplete_expired: $localize`:@@stripe.status.incomplete_expired:Incomplete expired`,
      past_due: $localize`:@@stripe.status.past_due:Past due`,
      trialing: $localize`:@@stripe.status.trialing:Trialing`,
      unpaid: $localize`:@@stripe.status.unpaid:Unpaid`,
      paused: $localize`:@@stripe.status.paused:Paused`,
      succeeded: $localize`:@@stripe.status.succeeded:Succeeded`,
      failed: $localize`:@@stripe.status.failed:Failed`,
      pending: $localize`:@@stripe.status.pending:Pending`,
      processing: $localize`:@@stripe.status.processing:Processing`,
      paid: $localize`:@@stripe.status.paid:Paid`,
      requires_payment_method: $localize`:@@stripe.status.requires_payment_method:Requires payment method`,
      requires_confirmation: $localize`:@@stripe.status.requires_confirmation:Requires confirmation`,
      requires_action: $localize`:@@stripe.status.requires_action:Requires action`,
      requires_capture: $localize`:@@stripe.status.requires_capture:Requires capture`,
    };
    return labels[status] ?? status;
  }

  public translateBillingInterval(interval: string): string {
    const labels: Record<string, string> = {
      day: $localize`:@@stripe.billing.daily:Daily`,
      week: $localize`:@@stripe.billing.weekly:Weekly`,
      month: $localize`:@@stripe.billing.monthly:Monthly`,
      year: $localize`:@@stripe.billing.yearly:Yearly`,
    };
    return labels[interval] ?? interval;
  }
}
