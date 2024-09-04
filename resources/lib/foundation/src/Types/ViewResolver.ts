import { type ConcreteComponent } from 'vue';

export type StackedViewComponent = ConcreteComponent & {
  layout?: undefined | string | ConcreteComponent,
};

export type ViewResolver = (name: string) => StackedViewComponent;
