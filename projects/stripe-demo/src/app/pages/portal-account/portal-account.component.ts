import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portal-account',
  standalone: true,
  templateUrl: './portal-account.component.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortalAccountComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  // Signal to track if we're in the redirecting state
  public readonly isRedirecting = signal(true);
  
  ngOnInit(): void {
    // Check if we're coming back from the Stripe portal
    this.route.queryParams.subscribe(params => {
      if (params['session_id']) {
        // The user is returning from Stripe portal, show success state
        this.isRedirecting.set(false);
      } else {
        // We might be preparing to redirect, wait 3 seconds and then change to success state
        // This is just a fallback in case we don't redirect properly
        setTimeout(() => {
          this.isRedirecting.set(false);
        }, 3000);
      }
    });
  }
} 