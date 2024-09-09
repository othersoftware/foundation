import { type InjectionKey, type Ref } from 'vue';
import { type ViewResolver } from '../Types/ViewResolver';
import { type StackedViewResolved } from '../Types/StackedView';

export const StackedViewResolverInjectionKey = Symbol('ViewResolver') as InjectionKey<ViewResolver>;
export const StackedViewInjectionKey = Symbol('StackedView') as InjectionKey<Ref<StackedViewResolved | undefined>>;
export const StackedViewDepthInjectionKey = Symbol('StackedViewDepth') as InjectionKey<Ref<number>>;
export const StackedViewParentInjectionKey = Symbol('StackedViewParent') as InjectionKey<Ref<StackedViewResolved | undefined>>;
export const StackedViewLocationInjectionKey = Symbol('StackedViewLocation') as InjectionKey<Ref<string | undefined>>;
export const StackedViewQueryInjectionKey = Symbol('StackedViewQuery') as InjectionKey<Ref<Record<string, any> | undefined>>;
