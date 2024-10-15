import { Response, CompleteResponse } from './Response';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
export type Body = XMLHttpRequestBodyInit | Object | null | undefined;
export type Signature = string | undefined;

export class Request {
  protected method: Method;
  protected url: string;
  protected xhr: XMLHttpRequest;
  protected body: Body;
  protected signature: Signature;

  static send(method: Method, url: string, body: Body = undefined, signature: Signature = undefined) {
    return new Request(method, url, body, signature).send();
  }

  constructor(method: Method, url: string, body: Body = undefined, signature: Signature = undefined) {
    this.xhr = new XMLHttpRequest();
    this.method = method;
    this.url = url;
    this.body = body;
    this.signature = signature;
  }

  public send(): Promise<CompleteResponse> {
    return new Promise((resolve, reject) => {
      this.xhr.open(this.method, this.url, true);

      this.xhr.setRequestHeader('Language', APP_LOCALE);
      this.xhr.setRequestHeader('X-Stack-Router', 'true');
      this.xhr.setRequestHeader('X-XSRF-TOKEN', this.readCookie('XSRF-TOKEN'));

      if (this.signature) {
        this.xhr.setRequestHeader('X-Stack-Signature', this.signature);
      } else {
        throw new Error('Missing signature!');
      }

      this.xhr.onload = () => {
        if (this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status) {
          if (this.xhr.status < 200 || this.xhr.status >= 300) {
            if (this.xhr.status === 422) {
              reject(new CompleteResponse(this.xhr));
            } else {
              reject(new Response(this.xhr));
            }
          } else {
            resolve(new CompleteResponse(this.xhr));
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

    return (match ? decodeURIComponent(match[3]) : '');
  }
}
