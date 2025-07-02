import { renderToString } from '@vue/server-renderer';
import { type State } from '../Types/State';
import { type ViewResolver } from '../Types/ViewResolver';
import { RouterComponent } from '../Components/Routing/RouterComponent';

export type AppFactory = (options: AppFactoryOptions) => any;

export type AppFactoryOptions = {
  router: typeof RouterComponent,
  props: { resolver: ViewResolver, state: State },
}

type Options = {
  initial?: State | undefined,
  resolver: ViewResolver,
  setup: AppFactory,
}

export async function createFoundationController({ initial, resolver, setup }: Options) {
  const isServer = typeof window === 'undefined';
  const state = initial || readInitialState();

  const app = setup({ router: RouterComponent, props: { resolver, state } });

  if (isServer) {
    return await renderToString(app);
  }

  return '';
}


function readInitialState(): State {
  let element = document.getElementById('ias');

  if (!element || !element.textContent) {
    throw new Error('Cannot find initial script element with MVC state.');
  }

  return JSON.parse(element.textContent);
}
