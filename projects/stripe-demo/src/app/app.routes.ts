import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../../stripe-demo/src/app/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'checkout',
    children: [
      {
        path: '',
        loadComponent: () => import('../../../stripe-demo/src/app/pages/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'result',
        loadComponent: () => import('../../../stripe-demo/src/app/pages/checkout/result/checkout-result.component').then(m => m.CheckoutResultComponent)
      }
    ]
  },
  {
    path: 'subscriptions',
    children: [
      {
        path: '',
        loadComponent: () => import('../../../stripe-demo/src/app/pages/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
      },
      {
        path: 'result',
        loadComponent: () => import('../../../stripe-demo/src/app/pages/subscriptions/result/subscriptions-result.component').then(m => m.SubscriptionsResultComponent)
      }
    ]
  },
  {
    path: 'portal-account',
    loadComponent: () => import('../../../stripe-demo/src/app/pages/portal-account/portal-account.component').then(m => m.PortalAccountComponent)
  },
  {
    path: 'payouts',
    loadComponent: () => import('../../../stripe-demo/src/app/pages/payouts/payouts.component').then(m => m.PayoutsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
