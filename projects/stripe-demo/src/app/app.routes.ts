import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'checkout',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'result',
        loadComponent: () => import('./pages/checkout/result/checkout-result.component').then(m => m.CheckoutResultComponent)
      }
    ]
  },
  {
    path: 'subscriptions',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
      },
      {
        path: 'result',
        loadComponent: () => import('./pages/subscriptions/result/subscriptions-result.component').then(m => m.SubscriptionsResultComponent)
      }
    ]
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'payouts',
    loadComponent: () => import('./pages/payouts/payouts.component').then(m => m.PayoutsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
