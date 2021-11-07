import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {combineLatest, Subject} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  title$ = new  Subject<string>();

  subTitle$ = new Subject<string>();

  constructor(private pageTitle: Title) {
    combineLatest([this.title$, this.subTitle$])
      .pipe(
        map(([title, subTitle]) => subTitle ? [subTitle, title].join(" - ") : title),
      )
      .subscribe(title => {
        this.pageTitle.setTitle(title);
      })
  }

  setTitle(title: string, subTitle: string = "") {
    this.title$.next(title);
    this.subTitle$.next(subTitle);
  }
}
