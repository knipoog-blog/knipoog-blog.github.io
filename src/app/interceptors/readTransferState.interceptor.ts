import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {makeStateKey, TransferState} from "@angular/platform-browser";

@Injectable()
export class ReadTransferStateInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferState
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith("/assets/data/")) {
      return next.handle(request);
    }
    const JSON_KEY = makeStateKey<any>(request.url);
    if (!this.transferState.hasKey(JSON_KEY)) {
      return next.handle(request);
    }

    return of(new HttpResponse({ status: 200, body: JSON.parse(this.transferState.get(JSON_KEY, null)) }));
  }
}
