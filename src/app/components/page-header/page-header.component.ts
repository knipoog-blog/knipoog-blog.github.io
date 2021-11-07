import {Component, OnInit} from "@angular/core";
import {TitleService} from "../../services/title.service";
import {combineLatest} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent implements OnInit {

  title = "";

  constructor(private svc: TitleService) { }

  ngOnInit(): void {
    this.svc.title$
      .subscribe(title => {
        this.title = title;
      })
  }

}
