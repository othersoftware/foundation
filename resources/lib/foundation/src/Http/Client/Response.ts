import type { StackedView } from '../../Types/StackedView';
import type { RouterRedirect } from '../../Types/RouterRedirect';
import type { ToastRegistry } from '../../Types/Toast';
import type { Authenticated, Abilities, Meta, ViewErrorsBag, SharedStateResponse } from '../../Types/State';

export function createResponseFromRequest(xhr: XMLHttpRequest): CompleteResponse | Response {
  if (xhr.getResponseHeader('x-stack-router')) {
    throw new Error('Invalid response for MVC HTTP client.');
  }

  if (xhr.getResponseHeader('x-complete-response')) {
    return new CompleteResponse(xhr);
  }

  return new Response(xhr);
}

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
  public abilities: Abilities;
  public meta: Meta[] | undefined;
  public shared: SharedStateResponse | undefined;
  public authenticated: Authenticated | null;
  public location: string;
  public signature: string | null;
  public redirect: RouterRedirect | undefined;
  public stack: StackedView;
  public toasts: ToastRegistry;
  public errors: ViewErrorsBag;
  public data: any;

  constructor(xhr: XMLHttpRequest) {
    super(xhr);

    let data = JSON.parse(this.xhr.response);

    this.meta = data.meta;
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
