import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SignupComponent, SocialLoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [SignupComponent, SocialLoginComponent, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-md">
      <h1 class="text-2xl font-bold mb-4">Create account</h1>
      <sup-signup (login)="goLogin()" />
      <div class="divider my-6">or continue with</div>
      <sup-social-login />
      <p class="mt-4 text-sm text-base-content/70">
        <a routerLink="/" class="link link-primary">Back to home</a>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private readonly router = inject(Router);

  goLogin(): void {
    void this.router.navigate(['/login']);
  }
}
