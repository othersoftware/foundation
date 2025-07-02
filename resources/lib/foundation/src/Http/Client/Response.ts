import type { StackedView } from '../../Types/StackedView';
import type { RouterRedirect } from '../../Types/RouterRedirect';
import type { ToastRegistry } from '../../Types/Toast';
import type { Authenticated, Abilities, SharedState } from '../../Types/State';

export class Response {
  protected readonly xhr: XMLHttpRequest;

  public readonly status: number;
  public readonly success: boolean;
  public readonly fail: boolean;
  public readonly partial: boolean;
  public readonly raw: boolean;
  public readonly message: string;
  public readonly content: string;

  constructor(xhr: XMLHttpRequest) {
    this.xhr = xhr;

    if (this.xhr.getResponseHeader('x-stack-router')) {
      throw new Error('Invalid response for MVC HTTP client.');
    }

    this.status = this.xhr.status;
    this.success = (this.xhr.status >= 200 && this.xhr.status < 300);
    this.fail = !this.success;
    this.content = this.xhr.response;
    this.message = this.xhr.statusText;

    this.partial = !!this.xhr.getResponseHeader('x-partial');
    this.raw = !!this.xhr.getResponseHeader('x-raw');
  }
}

export class CompleteResponse extends Response {
  public readonly abilities: Abilities;
  public readonly shared: SharedState | undefined;
  public readonly authenticated: Authenticated | null;
  public readonly location: string;
  public readonly signature: string;
  public readonly redirect: RouterRedirect;
  public readonly stack: StackedView;
  public readonly toasts: ToastRegistry;
  public readonly errors: Record<string, string[]>;
  public readonly data: any;

  constructor(xhr: XMLHttpRequest) {
    super(xhr);

    let data = JSON.parse(this.xhr.response);

    this.abilities = data.abilities;
    this.shared = data.shared;
    this.authenticated = data.authenticated;
    this.location = data.location;
    this.signature = data.signature;
    this.redirect = data.redirect;
    this.stack = data.stack;
    this.errors = data.errors;
    this.toasts = data.toasts;
    this.data = data.raw;
  }
}
