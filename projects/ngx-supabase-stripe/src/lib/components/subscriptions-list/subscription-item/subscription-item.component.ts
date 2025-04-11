import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsStore } from '../../../store/subscriptions.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-subscription-item',
  templateUrl: './subscription-item.component.html',
  styleUrls: ['./subscription-item.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SubscriptionItemComponent {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  
  // Input for the subscription data
  public readonly subscription = input.required<any>();
  
  // Output events
  @Output() onCancel = new EventEmitter<string>();
  @Output() onUpdate = new EventEmitter<string>();
  @Output() onResume = new EventEmitter<string>();
  
  // UI state
  public isExpanded = false;
  public isEditMode = false;
  public isConfirmingCancel = false;
  public isUpdating = false;
  
  // Form values for editing
  public editedMetadata: any = {};
  
  /**
   * Toggle expanded state
   */
  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    
    // Initialize metadata for editing when expanded
    if (this.isExpanded && this.subscription().metadata) {
      this.editedMetadata = { ...this.subscription().metadata };
    }
  }
  
  /**
   * Toggle edit mode
   */
  public toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    
    // Reset metadata when exiting edit mode without saving
    if (!this.isEditMode) {
      this.editedMetadata = { ...this.subscription().metadata };
    }
  }
  
  /**
   * Update subscription
   */
  public async updateSubscription(): Promise<void> {
    this.isUpdating = true;
    
    const params = {
      metadata: this.editedMetadata
    };
    
    await this.subscriptionsStore.updateSubscription(this.subscription().id, params);
    
    this.isUpdating = false;
    this.isEditMode = false;
    this.onUpdate.emit(this.subscription().id);
  }
  
  /**
   * Cancel subscription
   */
  public async cancelSubscription(): Promise<void> {
    if (!this.isConfirmingCancel) {
      this.isConfirmingCancel = true;
      return;
    }
    
    await this.subscriptionsStore.cancelSubscription(this.subscription().id);
    this.isConfirmingCancel = false;
    this.onCancel.emit(this.subscription().id);
  }
  
  /**
   * Resume subscription
   */
  public async resumeSubscription(): Promise<void> {
    await this.subscriptionsStore.resumeSubscription(this.subscription().id);
    this.onResume.emit(this.subscription().id);
  }
  
  /**
   * Format date
   */
  public formatDate(timestamp: number): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  }
  
  /**
   * Format currency amount
   */
  public formatAmount(amount: number, currency: string): string {
    if (!amount) return 'N/A';
    
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD',
    });
    
    return formatter.format(amount / 100);
  }
  
  /**
   * Cancel confirmation action
   */
  public cancelConfirmation(): void {
    this.isConfirmingCancel = false;
  }
} 