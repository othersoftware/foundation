import type { StackedView } from '../../Types/StackedView';
import type { RouterRedirect } from '../../Types/RouterRedirect';

export class Response {
  private readonly xhr: XMLHttpRequest;

  public readonly status: number;
  public readonly success: boolean;
  public readonly fail: boolean;
  public readonly partial: boolean;
  public readonly raw: boolean;
  public readonly message: string;
  public readonly content: string;

  public readonly location: string;
  public readonly signature: string;
  public readonly redirect: RouterRedirect | undefined;
  public readonly stack: StackedView | undefined;
  public readonly errors: Record<string, string[]>;

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

    if (this.success || this.status === 422) {
      let data = JSON.parse(this.xhr.response);

      this.location = data.location;
      this.signature = data.signature;
      this.redirect = data.redirect;
      this.stack = data.stack;
      this.errors = data.errors;
    }
  }
}
