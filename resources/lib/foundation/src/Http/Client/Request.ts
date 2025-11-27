import { Response, CompleteResponse, createResponseFromRequest } from './Response';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
export type Body = XMLHttpRequestBodyInit | Object | null | undefined;
export type Signature = string | undefined;

export interface RequestOptions {
  method: Method,
  url: string,
  body?: Body | undefined,
  signature?: Signature | undefined,
  refreshStack?: boolean | undefined,
  referer?: string | null | undefined,
  nested?: boolean | undefined,
}

export class Request {
  protected method: Method;
  protected url: string;
  protected xhr: XMLHttpRequest;
  protected body: Body;
  protected signature: Signature;
  protected refreshStack: boolean;
  protected referer: string | null | undefined;
  protected nested: boolean;

  static send(options: RequestOptions) {
    return new Request(options).send();
  }

  constructor({
    method,
    url,
    body = undefined,
    signature = undefined,
    refreshStack = false,
    referer = undefined,
    nested = false,
  }: RequestOptions) {
    this.xhr = new XMLHttpRequest();
    this.method = method;
    this.url = url;
    this.body = body;
    this.signature = signature;
    this.refreshStack = refreshStack;
    this.referer = referer;
    this.nested = nested;
  }

  public send(): Promise<CompleteResponse> {
    return new Promise((resolve, reject) => {
      this.xhr.open(this.method, this.url, true);

      this.xhr.setRequestHeader('Language', APP_LOCALE);
      this.xhr.setRequestHeader('X-Stack-Router', 'true');
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.setRequestHeader('X-XSRF-TOKEN', this.readCookie('XSRF-TOKEN'));

      if (this.referer) {
        this.xhr.setRequestHeader('X-Stack-Referer', this.referer);
      }

      if (this.refreshStack) {
        this.xhr.setRequestHeader('X-Stack-Refresh', 'true');
      }

      if (this.nested) {
        this.xhr.setRequestHeader('X-Stack-Nested', 'true');
      }

      if (this.signature) {
        this.xhr.setRequestHeader('X-Stack-Signature', this.signature);
      }

      this.xhr.onload = () => {
        if (this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status) {
          if (this.xhr.status < 200 || this.xhr.status >= 300) {
            reject(createResponseFromRequest(this.xhr));
          } else {
            resolve(createResponseFromRequest(this.xhr) as CompleteResponse);
          }
        }
      };

      this.xhr.onerror = () => {
        reject(new Response(this.xhr));
      };

      this.xhr.send(this.transform(this.body));
    });
  }

  protected transform(body: any) {
    if (body instanceof Blob || body instanceof ArrayBuffer || body instanceof FormData || body instanceof URLSearchParams) {
      return body;
    }

    if (typeof body === 'string') {
      return body;
    }

    if (body === null) {
      return null;
    }

    this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    return JSON.stringify(body);
  }

  protected readCookie(name: string): string {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));

    if (match) {
      return (match ? decodeURIComponent(match[3]!) : '');
    }

    return '';
  }
}
