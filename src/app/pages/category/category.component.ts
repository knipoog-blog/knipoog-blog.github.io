import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {exhaust, exhaustMap, filter, map, mergeMap} from "rxjs/operators";
import {Blog, Post} from "../../blogs.types";
import {TitleService} from "../../services/title.service";
import {combineLatest} from "rxjs";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

@Component({
  selector: 'app-category',
  template: `<app-post-list [posts]="posts"></app-post-list>`,
})
export class CategoryComponent implements OnInit {

  posts: Post[] = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private title: TitleService,
  ) { }

  ngOnInit(): void {
    const category$ = this.route.paramMap.pipe(map(paramMap => paramMap.get("category")))

    category$
      .pipe(
        exhaustMap(category => this.http.get<Post[]>(`/assets/data/${category}.json`))
      )
      .subscribe(posts => {
        this.posts = posts;
      });
    combineLatest([category$, this.http.get<Blog[]>(`/assets/data/blogs.json`)]).pipe(
      map(([category, blogs]) => blogs.find(blog => blog.id === category)),
      filter((blog): blog is Blog => !!blog),
      map(blog => blog.title),
    )
      .subscribe((category) => {
        this.title.setTitle(category);
      });
  }

}
