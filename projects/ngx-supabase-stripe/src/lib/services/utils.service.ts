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
}
