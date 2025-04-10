import { TestBed } from '@angular/core/testing';

import { NgxSupabaseStripeService } from './ngx-supabase-stripe.service';

describe('NgxSupabaseStripeService', () => {
  let service: NgxSupabaseStripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSupabaseStripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
