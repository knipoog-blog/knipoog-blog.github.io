import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../../blogs.types";
import {of} from "rxjs";
import {TitleService} from "../../services/title.service";

@Component({
  selector: 'app-latest-posts',
  template: `<app-post-list [posts]="posts"></app-post-list>`,
})
export class LatestPostsComponent implements OnInit {

  posts: Post[] = [];

  constructor(private http: HttpClient, private title: TitleService) { }

  ngOnInit(): void {
    this.title.setTitle("Recente berichten");
    this.http.get<Post[]>("/assets/data/latest.json").subscribe(posts => {
      this.posts = posts;
    })
  }

}
