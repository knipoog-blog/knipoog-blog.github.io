import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../../blogs.types";

@Component({
  selector: 'app-latest-posts',
  templateUrl: './latest-posts.component.html',
  styleUrls: ['./latest-posts.component.sass']
})
export class LatestPostsComponent implements OnInit {

  posts: Post[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Post[]>("/assets/data/latest.json").subscribe(posts => {
      this.posts = posts;
    })
  }

}
