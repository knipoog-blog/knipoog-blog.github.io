import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {exhaust, exhaustMap, map} from "rxjs/operators";
import {Post} from "../../blogs.types";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {

  posts: Post[] = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(paramMap => paramMap.get("category")),
        exhaustMap(category => this.http.get<Post[]>(`/assets/data/${category}.json`))
      )
      .subscribe(posts => {
        this.posts = posts;
      });
  }

}
