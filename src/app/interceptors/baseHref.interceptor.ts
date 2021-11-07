import {Inject, Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {APP_BASE_HREF} from "@angular/common";

@Injectable()
export class BaseHrefInterceptor implements HttpInterceptor {

  constructor(
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const baseElement = document.querySelector('base');
    if (!baseElement || !request.url.startsWith("/")) {
      return next.handle(request);
    }
    const apiReq = request.clone({ url: `${baseElement.href}${request.url}` });
    return next.handle(apiReq);
  }
}
