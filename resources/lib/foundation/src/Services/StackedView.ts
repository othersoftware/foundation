import { type InjectionKey, type Ref } from 'vue';
import { type ViewResolver } from '../Types/ViewResolver';
import { type StackedView } from '../Types/StackedView';

export const StackedViewResolverInjectionKey = Symbol('ViewResolver') as InjectionKey<ViewResolver>;
export const StackedViewInjectionKey = Symbol('StackedView') as InjectionKey<Ref<StackedView | undefined>>;
