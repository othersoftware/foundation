import { RouterViewComponent } from '../src/Components/Routing/RouterViewComponent';
import { RouterLinkComponent } from '../src/Components/Routing/RouterLinkComponent';
import { FormControllerComponent } from '../src/Components/Controllers/FormControllerComponent';
import type { ToastControllerComponent, ToastComponent } from '../src/Components/Controllers/ToastControllerComponent';
import { trans, transChoice } from '../src/Support/Translator';
import { route } from '../src/Support/Route';

declare global {
  declare const APP_NAME: string;
  declare const APP_ENV: string;
  declare const APP_DEBUG: boolean;
  declare const APP_TIMEZONE: string;
  declare const APP_URL: string;
  declare const APP_LOCALE: string;
  declare const APP_AVAILABLE_LOCALES: string[];
  declare const APP_FALLBACK_LOCALE: string;
  declare const APP_COUNTRY: string;
  declare const APP_CURRENCY: string;
  declare const APP_ROUTES: Record<string, any>;
  declare const APP_TRANSLATIONS: Record<string, any>;
}

declare global {
  type Nullable<T> = T | null | undefined;
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    RouterView: typeof RouterViewComponent,
    RouterLink: typeof RouterLinkComponent,
    FormController: typeof FormControllerComponent,
    ToastController: typeof ToastControllerComponent,
    Toast: typeof ToastComponent,
  }

  export interface ComponentCustomProperties {
    $t: typeof trans,
    $tc: typeof transChoice,
    $route: typeof route,
  }
}
