import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent, SocialLoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent, SocialLoginComponent, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-md">
      <h1 class="text-2xl font-bold mb-4">Sign in</h1>
      <sup-login (signup)="goSignup()" />
      <div class="divider my-6">or continue with</div>
      <sup-social-login />
      <p class="mt-4 text-sm text-base-content/70">
        <a routerLink="/" class="link link-primary">Back to home</a>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly router = inject(Router);

  goSignup(): void {
    void this.router.navigate(['/signup']);
  }
}
