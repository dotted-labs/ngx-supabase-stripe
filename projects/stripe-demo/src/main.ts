import '@angular/localize/init';
import { bootstrapApplication } from '@angular/platform-browser';
import { loadTranslations } from '@angular/localize';
import { loadStripeMessages } from '../../ngx-supabase-stripe/i18n/src/public-api';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { getStoredLocale } from './app/i18n/locale.storage';

async function bootstrap() {
  const locale = getStoredLocale();
  const { translations } = await loadStripeMessages(locale);
  loadTranslations(translations);

  await bootstrapApplication(AppComponent, appConfig);
}

bootstrap().catch((err) => console.error(err));
