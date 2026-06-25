import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { STRIPE_LOCALES } from '../../../ngx-supabase-stripe/i18n/src/public-api';
import { getStoredLocale, setStoredLocale } from './i18n/locale.storage';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public readonly locales = STRIPE_LOCALES;

  public readonly currentLocale = signal(getStoredLocale());

  public onLocaleChange(locale: string): void {
    if (locale === this.currentLocale()) {
      return;
    }

    setStoredLocale(locale);
  }
}
