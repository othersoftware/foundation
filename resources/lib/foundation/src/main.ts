import type { App, Plugin } from 'vue';
import { FormControllerComponent } from './Components/Controllers/FormControllerComponent';
import { RouterViewComponent } from './Components/Routing/RouterViewComponent';
import { RouterLinkComponent } from './Components/Routing/RouterLinkComponent';
import { RouterNestedComponent } from './Components/Routing/RouterNestedComponent';
import { ToastControllerComponent, ToastComponent } from './Components/Controllers/ToastControllerComponent';
import { PasswordConfirmationControllerComponent } from './Components/Controllers/PasswordConfirmationControllerComponent';
import { trans, transChoice } from './Support/Translator';
import { route } from './Support/Route';

export * from './Application/Factory';

export * from './Components/Controllers/FormControllerComponent';
export * from './Components/Controllers/ToastControllerComponent';

export * from './Components/Routing/RouterComponent';
export * from './Components/Routing/RouterLinkComponent';
export * from './Components/Routing/RouterViewComponent';
export * from './Components/Routing/RouterNestedComponent';

export * from './Composables/UseConfirmation';
export * from './Composables/UseFormApi';
export * from './Composables/UseFormContext';
export * from './Composables/UseHttpClient';
export * from './Composables/UseViewDepth';
export * from './Composables/UseViewLocation';
export * from './Composables/UseViewParent';
export * from './Composables/UseViewQuery';
export * from './Composables/UseViewResolver';
export * from './Composables/UseViewStack';

export * from './Events/EventBus';

export * from './Http/Client/Request';
export * from './Http/Client/Response';

export * from './Services/FormContext';
export * from './Services/StateManager';
export * from './Services/StackedView';
export * from './Services/ToastManager';

export * from './Support/Countries';
export * from './Support/Empty';
export * from './Support/ErrorModal';
export * from './Support/Hash';
export * from './Support/NestedSet';
export * from './Support/Route';
export * from './Support/Translator';
export * from './Support/Url';
export * from './Support/Wrap';

export * from './Types/HeadMeta';
export * from './Types/RouterRedirect';
export * from './Types/StackedView';
export * from './Types/State';
export * from './Types/Toast';
export * from './Types/ViewResolver';

export function createOtherSoftwareFoundation(): Plugin {
  return {
    install(app: App) {
      app.component('RouterNested', RouterNestedComponent);
      app.component('RouterView', RouterViewComponent);
      app.component('RouterLink', RouterLinkComponent);
      app.component('FormController', FormControllerComponent);
      app.component('ToastController', ToastControllerComponent);
      app.component('PasswordConfirmationController', PasswordConfirmationControllerComponent);
      app.component('Toast', ToastComponent);

      app.config.globalProperties.$t = trans;
      app.config.globalProperties.$tc = transChoice;
      app.config.globalProperties.$route = route;
    },
  };
}
