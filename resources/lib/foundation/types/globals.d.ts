import { RouterViewComponent } from '../src/Components/Routing/RouterViewComponent';
import { RouterLinkComponent } from '../src/Components/Routing/RouterLinkComponent';
import { RouterNestedComponent } from '../src/Components/Routing/RouterNestedComponent.ts';
import { RouterFrameComponent } from '../src/Components/Routing/RouterFrameComponent.ts';
import { FormControllerComponent } from '../src/Components/Controllers/FormControllerComponent';
import type { ToastControllerComponent, ToastComponent } from '../src/Components/Controllers/ToastControllerComponent';
import type { PasswordConfirmationControllerComponent } from '../src/Components/Controllers/PasswordConfirmationControllerComponent';
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
  declare const APP_COUNTRIES_IMPLICITLY_ADDRESSES: string[];
  declare const APP_CURRENCY: string;
  declare const APP_ROUTES: Record<string, any>;
  declare const APP_TRANSLATIONS: Record<string, any>;
}

declare global {
  type Nullable<T> = T | null | undefined;
  type PhoneNumber = { national: string, country: string, rfc: string };
}

declare module 'vue' {
  export interface GlobalComponents {
    RouterFrame: typeof RouterFrameComponent,
    RouterNested: typeof RouterNestedComponent,
    RouterView: typeof RouterViewComponent,
    RouterLink: typeof RouterLinkComponent,
    FormController: typeof FormControllerComponent,
    ToastController: typeof ToastControllerComponent,
    PasswordConfirmationController: typeof PasswordConfirmationControllerComponent,
    Toast: typeof ToastComponent,
  }

  export interface ComponentCustomProperties {
    $t: typeof trans,
    $tc: typeof transChoice,
    $route: typeof route,
  }
}
