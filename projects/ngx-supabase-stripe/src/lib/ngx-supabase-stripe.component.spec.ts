import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSupabaseStripeComponent } from './ngx-supabase-stripe.component';

describe('NgxSupabaseStripeComponent', () => {
  let component: NgxSupabaseStripeComponent;
  let fixture: ComponentFixture<NgxSupabaseStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSupabaseStripeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSupabaseStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
