import type { App, Plugin } from 'vue';
import { FormControllerComponent } from './Components/Controllers/FormControllerComponent.ts';
import { RouterViewComponent } from './Components/Routing/RouterViewComponent.ts';
import { RouterLinkComponent } from './Components/Routing/RouterLinkComponent.ts';
import { RouterNestedComponent } from './Components/Routing/RouterNestedComponent.ts';
import { RouterFrameComponent } from './Components/Routing/RouterFrameComponent.ts';
import { ToastControllerComponent, ToastComponent } from './Components/Controllers/ToastControllerComponent.ts';
import { PasswordConfirmationControllerComponent } from './Components/Controllers/PasswordConfirmationControllerComponent.ts';
import { trans, transChoice } from './Support/Translator.ts';
import { route } from './Support/Route.ts';

export * from './Application/Factory.ts';

export * from './Components/Controllers/FormControllerComponent.ts';
export * from './Components/Controllers/ToastControllerComponent.ts';

export * from './Components/Routing/RouterComponent.ts';
export * from './Components/Routing/RouterLinkComponent.ts';
export * from './Components/Routing/RouterViewComponent.ts';
export * from './Components/Routing/RouterNestedComponent.ts';
export * from './Components/Routing/RouterFrameComponent.ts';

export * from './Composables/UseConfirmation.ts';
export * from './Composables/UseStackLayout.ts';
export * from './Composables/UseFormApi.ts';
export * from './Composables/UseFormContext.ts';
export * from './Composables/UseHttpClient.ts';
export * from './Composables/UseViewDepth.ts';
export * from './Composables/UseViewLocation.ts';
export * from './Composables/UseViewParent.ts';
export * from './Composables/UseViewQuery.ts';
export * from './Composables/UseViewResolver.ts';
export * from './Composables/UseViewStack.ts';

export * from './Events/EventBus.ts';

export * from './Http/Client/Request.ts';
export * from './Http/Client/Response.ts';

export * from './Services/FormContext.ts';
export * from './Services/StateManager.ts';
export * from './Services/StackedView.ts';
export * from './Services/ToastManager.ts';

export * from './Support/Array.ts';
export * from './Support/Countries.ts';
export * from './Support/Empty.ts';
export * from './Support/ErrorModal.ts';
export * from './Support/Hash.ts';
export * from './Support/NestedSet.ts';
export * from './Support/Random.ts';
export * from './Support/Route.ts';
export * from './Support/Scroll.ts';
export * from './Support/Translator.ts';
export * from './Support/Url.ts';
export * from './Support/Wrap.ts';

export * from './Types/HeadMeta.ts';
export * from './Types/RouterRedirect.ts';
export * from './Types/StackedView.ts';
export * from './Types/State.ts';
export * from './Types/Toast.ts';
export * from './Types/ViewResolver.ts';

export function createOtherSoftwareFoundation(): Plugin {
  return {
    install(app: App) {
      app.component('RouterFrame', RouterFrameComponent);
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
