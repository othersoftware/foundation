import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { ConcreteComponent } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { InjectionKey } from 'vue';
import { Plugin as Plugin_2 } from 'vue';
import { PropType } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { RendererElement } from 'vue';
import { RendererNode } from 'vue';
import { SlotsType } from 'vue';
import { VNode } from 'vue';

export declare interface Abilities extends Record<string, Ability> {
}

export declare interface Ability {
    allowed: boolean;
    denied: boolean;
    message: string | null;
    code: any;
}

export declare interface Authenticated {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export declare function blank(value: any): boolean;

declare type Body_2 = XMLHttpRequestBodyInit | Object | null | undefined;
export { Body_2 as Body }

declare type Callback<T> = () => Promise<T> | T;

export declare class CompleteResponse extends Response_2 {
    readonly abilities: Abilities;
    readonly authenticated: Authenticated | null;
    readonly location: string;
    readonly signature: string;
    readonly redirect: RouterRedirect;
    readonly stack: StackedView;
    readonly toasts: ToastRegistry;
    readonly errors: Record<string, string[]>;
    readonly data: any;
    constructor(xhr: XMLHttpRequest);
}

declare interface Config {
    title?: string;
    description?: string;
    yes?: string;
    no?: string;
}

declare interface ConfigWithCallback<T> extends Config {
    callback: Callback<T>;
}

export declare interface Confirmation extends Config {
    processing: boolean;
    confirm: () => void;
    cancel: () => void;
}

export declare function createFormContext(initial?: Record<string, any>, initialReadonly?: boolean): {
    data: Ref<Record<string, any>, Record<string, any>>;
    errors: Ref<Record<string, string[]>, Record<string, string[]>>;
    touched: Ref<Record<string, boolean>, Record<string, boolean>>;
    processing: Ref<boolean, boolean>;
    readonly: Ref<boolean, boolean>;
    touch: (name: string) => void;
    value: (name: string, value: any) => any;
    fill: (name: string, value: any) => void;
};

export declare function createFoundationController({ initial, resolver, setup }: Options): Promise<string>;

export declare function createOtherSoftwareFoundation(): Plugin_2;

export declare const ErrorModal: {
    modal: HTMLDialogElement | undefined;
    listener: any;
    show(html: Record<string, unknown> | string): void;
    hide(): void;
    hideOnEscape(event: KeyboardEvent): void;
};

export declare const EventBus: {
    addEventListener(name: EventName, callback: EventHandler): void;
    removeEventListener(name: EventName, callback: EventHandler): void;
    dispatch<T>(name: EventName, event?: T): T | undefined;
};

declare type EventHandler = (event?: any) => boolean | undefined | void;

declare type EventName = string;

declare type Factory = (options: FactoryOptions) => any;

declare function factory<T>(config: ConfigWithCallback<T>): Promise<T>;

declare function factory<T>(callback: Callback<T>): Promise<T>;

declare function factory<T>(config: Config, callback: Callback<T>): Promise<T>;

declare type FactoryOptions = {
    router: typeof RouterComponent;
    props: {
        resolver: ViewResolver;
        state: State;
    };
};

export declare function filled(value: any): boolean;

export declare function findScrollParent(element: HTMLElement | undefined | null): HTMLElement | undefined;

declare type FormApi = {
    ctx: FormContextInterface;
    submit: () => void;
};

export declare const FormContextInjectionKey: InjectionKey<FormContextInterface>;

export declare type FormContextInterface = ReturnType<typeof createFormContext>;

export declare const FormControllerComponent: DefineComponent<ExtractPropTypes<    {
action: {
type: StringConstructor;
required: false;
};
method: {
type: PropType<Method>;
required: false;
default: string;
};
data: {
type: ObjectConstructor;
required: false;
default: {};
};
readonly: {
type: BooleanConstructor;
required: false;
default: boolean;
};
onSubmit: {
type: PropType<FormHandler>;
required: false;
};
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
action: {
type: StringConstructor;
required: false;
};
method: {
type: PropType<Method>;
required: false;
default: string;
};
data: {
type: ObjectConstructor;
required: false;
default: {};
};
readonly: {
type: BooleanConstructor;
required: false;
default: boolean;
};
onSubmit: {
type: PropType<FormHandler>;
required: false;
};
}>> & Readonly<{}>, {
data: Record<string, any>;
method: string;
readonly: boolean;
}, SlotsType<{
default: {
data: any;
processing: boolean;
errors: Record<string, string[]>;
touched: Record<string, boolean>;
ctx: FormContextInterface;
submit: () => void;
};
}>, {}, {}, string, ComponentProvideOptions, true, {}, any>;

declare type FormHandler = (data: any, ctx: FormContextInterface) => Promise<any>;

export declare function getModelFromContext(name: Nullable<string>, ctx: Nullable<FormContextInterface>, value: any): any;

export declare function hash(length?: number): string;

export declare type HeadMeta = {
    type: 'title';
    content: string;
} | {
    type: 'meta';
    name: string;
    content: string;
} | {
    type: 'link';
    rel: string;
    href: string;
} | {
    type: 'snippet';
    content: string;
};

export declare const HttpClientForceScrollPreservation: InjectionKey<boolean>;

declare interface HttpOptions {
    data?: Body_2 | undefined;
    preserveScroll?: boolean;
    replace?: boolean;
    refreshStack?: boolean;
}

export declare interface InitialState extends State {
    abilities: Abilities;
    authenticated: Authenticated | null;
    toasts: ToastRegistry;
}

export declare function isCountryExplicit(country: string | null | undefined): boolean;

export declare function isCountryImplicit(country: string | null | undefined): boolean;

export declare type Locale = {
    name: string;
    code: string;
};

export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;

export declare type NestedSet<T extends NestedSetItem = any> = T[];

export declare function nestedSetAncestors<T extends NestedSetItem = any>(data: NestedSet<T>, item: T): T[];

export declare function nestedSetChildren<T extends NestedSetItem = any>(data: NestedSet<T>, item: T): T[];

export declare function nestedSetDescendants<T extends NestedSetItem = any>(data: NestedSet<T>, item: T): T[];

export declare type NestedSetItem = {
    id: number;
    left: number;
    right: number;
    parentId: number | null;
    title: string;
};

export declare function nestedSetRoot<T extends NestedSetItem = any>(data: NestedSet<T>): T[];

declare type Options = {
    initial?: State | undefined;
    resolver: ViewResolver;
    setup: Factory;
};

declare type Params = Record<string, any>;

declare class Request_2 {
    protected method: Method;
    protected url: string;
    protected xhr: XMLHttpRequest;
    protected body: Body_2;
    protected signature: Signature;
    protected refreshStack: boolean;
    protected referer: string | null | undefined;
    static send(method: Method, url: string, body?: Body_2, signature?: Signature, refreshStack?: boolean, referer?: string | null | undefined): Promise<CompleteResponse>;
    constructor(method: Method, url: string, body?: Body_2, signature?: Signature, refreshStack?: boolean, referer?: string | null | undefined);
    send(): Promise<CompleteResponse>;
    protected transform(body: any): string | Blob | ArrayBuffer | FormData | URLSearchParams | null;
    protected readCookie(name: string): string;
}
export { Request_2 as Request }

declare class Response_2 {
    protected readonly xhr: XMLHttpRequest;
    readonly status: number;
    readonly success: boolean;
    readonly fail: boolean;
    readonly partial: boolean;
    readonly raw: boolean;
    readonly message: string;
    readonly content: string;
    constructor(xhr: XMLHttpRequest);
}
export { Response_2 as Response }

export declare type Route = {
    uri: string;
    domain: string;
    params: string[];
    binding: Record<string, string>;
};

export declare function route(name: string, params?: Params, hash?: string): string;

export declare const RouterComponent: DefineComponent<ExtractPropTypes<    {
resolver: {
type: PropType<ViewResolver>;
required: true;
};
state: {
type: PropType<InitialState>;
required: true;
};
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
resolver: {
type: PropType<ViewResolver>;
required: true;
};
state: {
type: PropType<InitialState>;
required: true;
};
}>> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare const RouterFrameComponent: DefineComponent<ExtractPropTypes<    {
src: {
type: StringConstructor;
required: true;
};
}>, () => any, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
src: {
type: StringConstructor;
required: true;
};
}>> & Readonly<{}>, {}, SlotsType<{
default?: () => any;
}>, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare const RouterLinkComponent: DefineComponent<ExtractPropTypes<    {
method: {
type: PropType<Method>;
required: false;
default: string;
};
href: {
type: PropType<string | null | undefined>;
required: false;
};
data: {
type: PropType<Body_2>;
required: false;
};
preserveScroll: {
type: BooleanConstructor;
required: false;
};
replace: {
type: BooleanConstructor;
required: false;
};
target: {
type: PropType<string>;
required: false;
};
disabled: {
type: BooleanConstructor;
required: false;
};
explicit: {
type: BooleanConstructor;
required: false;
};
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
method: {
type: PropType<Method>;
required: false;
default: string;
};
href: {
type: PropType<string | null | undefined>;
required: false;
};
data: {
type: PropType<Body_2>;
required: false;
};
preserveScroll: {
type: BooleanConstructor;
required: false;
};
replace: {
type: BooleanConstructor;
required: false;
};
target: {
type: PropType<string>;
required: false;
};
disabled: {
type: BooleanConstructor;
required: false;
};
explicit: {
type: BooleanConstructor;
required: false;
};
}>> & Readonly<{}>, {
preserveScroll: boolean;
replace: boolean;
method: string;
disabled: boolean;
explicit: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare const RouterNestedComponent: DefineComponent<ExtractPropTypes<    {
action: {
type: StringConstructor;
required: true;
};
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
action: {
type: StringConstructor;
required: true;
};
}>> & Readonly<{}>, {}, SlotsType<{
default?: () => any;
}>, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare interface RouterRedirect {
    target: string;
    reload: boolean;
}

export declare const RouterViewComponent: DefineComponent<ExtractPropTypes<    {
allowLayouts: {
type: PropType<boolean>;
required: false;
default: boolean;
};
}>, () => any, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
allowLayouts: {
type: PropType<boolean>;
required: false;
default: boolean;
};
}>> & Readonly<{}>, {
allowLayouts: boolean;
}, SlotsType<{
default?: () => any;
}>, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare function setModelWithContext(name: Nullable<string>, ctx: Nullable<FormContextInterface>, value: any): any;

export declare type Signature = string | undefined;

export declare type StackedView = StackedViewResolved | StackedViewKept;

export declare type StackedViewComponent = ConcreteComponent & {
    layout?: undefined | string | ConcreteComponent;
};

export declare const StackedViewDepthInjectionKey: InjectionKey<Ref<number>>;

export declare const StackedViewInjectionKey: InjectionKey<Ref<StackedViewResolved | undefined>>;

declare interface StackedViewKept {
    keep: boolean;
    child?: StackedView | undefined;
}

export declare const StackedViewLocationInjectionKey: InjectionKey<Ref<string | undefined>>;

export declare const StackedViewParentInjectionKey: InjectionKey<Ref<StackedViewResolved | undefined>>;

export declare const StackedViewQueryInjectionKey: InjectionKey<Ref<Record<string, any> | undefined>>;

export declare interface StackedViewResolved {
    component: string;
    props: any;
    parent?: StackedViewResolved | undefined;
    child?: StackedViewResolved | undefined;
    location?: string | undefined;
    query: Record<string, any>;
}

export declare const StackedViewResolverInjectionKey: InjectionKey<ViewResolver>;

export declare interface State {
    location: string;
    signature: string;
    stack: StackedViewResolved;
}

export declare const StateAbilities: InjectionKey<Ref<Abilities>>;

export declare const StateAuthenticated: InjectionKey<Ref<Authenticated | null>>;

export declare type StateHistory = {
    historyPushState(state: State): void;
    historyReplaceState(state: State): void;
};

export declare const StateHistoryInjectionKey: InjectionKey<StateHistory>;

export declare const StateLocationInjectionKey: InjectionKey<Ref<string>>;

export declare type StateManager = (fresh: CompleteResponse) => Promise<State>;

export declare const StateManagerInjectionKey: InjectionKey<StateManager>;

export declare const StateStackSignatureInjectionKey: InjectionKey<Ref<string>>;

export declare interface Toast {
    id: string;
    description: string;
    duration: number;
    kind: ToastKind;
}

export declare const ToastComponent: DefineComponent<ExtractPropTypes<    {
toast: {
type: PropType<Toast>;
required: true;
};
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
toast: {
type: PropType<Toast>;
required: true;
};
}>> & Readonly<{}>, {}, SlotsType<{
default: {
toast: Toast;
close: () => void;
};
}>, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare const ToastControllerComponent: DefineComponent<    {}, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, SlotsType<{
default: {
toasts: ToastRegistry;
};
}>, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare enum ToastKind {
    SUCCESS = "success",
    DANGER = "danger",
    INFO = "info",
    WARNING = "warning"
}

export declare type ToastRegistry = Toast[];

export declare const ToastRegistryInjectionKey: InjectionKey<Ref<ToastRegistry>>;

export declare function trans(key: string, replace?: Record<string, string | number | boolean>): string;

export declare function transChoice(key: string, number: number, replace?: Record<string, string | number | boolean>): string;

export declare function updateStack(current: StackedViewResolved, fresh: StackedView): StackedViewResolved;

export declare function url(uri: string, params?: Record<string, any>, hash?: string, base?: string | null): string;

export declare function useAbilities(): Ref<Abilities, Abilities>;

export declare function useAuthenticated(): Ref<Authenticated | null, Authenticated | null>;

export declare function useConfirmation(): typeof factory;

export declare function useCurrentConfirmation(): Ref<Confirmation | undefined, Confirmation | undefined>;

export declare function useFormApi(): Ref<FormApi>;

export declare function useFormContext(): FormContextInterface | null;

export declare function useHttpClient(): {
    dispatch: (method: Method, url: string, { data, preserveScroll, replace, refreshStack }?: HttpOptions) => any;
    get: (url: string) => Promise<any>;
    post: (url: string, data?: Body_2 | undefined) => Promise<any>;
    patch: (url: string, data?: Body_2 | undefined) => Promise<any>;
    put: (url: string, data?: Body_2 | undefined) => Promise<any>;
    delete: (url: string, data?: Body_2 | undefined) => Promise<any>;
};

export declare function useLocation(): Ref<string, string>;

export declare function usePersistentFormContext(): FormContextInterface;

export declare function useStackSignature(): Ref<string, string>;

export declare function useStateHistory(): StateHistory;

export declare function useStateManager(): {
    update: StateManager;
};

export declare function useToasts(): Ref<ToastRegistry, ToastRegistry>;

export declare function useViewDepth(): Ref<number>;

export declare function useViewLocation(): Ref<string | undefined>;

export declare function useViewParent(): Ref<StackedViewResolved | undefined>;

export declare function useViewParentLocation(): ComputedRef<string | undefined>;

export declare function useViewQuery(): Ref<Record<string, any> | undefined>;

export declare function useViewResolver(): ViewResolver;

export declare function useViewStack(): Ref<StackedViewResolved | undefined>;

export declare type ViewResolver = (name: string) => StackedViewComponent;

export declare function wrap<T>(item: T): T[] & any[];

export { }

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
