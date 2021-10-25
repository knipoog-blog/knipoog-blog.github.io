import { Component, OnInit } from '@angular/core';
import {Post} from "../../blogs.types";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {exhaustMap, map} from "rxjs/operators";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass']
})
export class PostComponent implements OnInit {

  post?: Post;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(paramMap => [paramMap.get("category"), paramMap.get("post")]),
        exhaustMap(([category, post]) => this.http.get<Post[]>(`/assets/data/${category}.json`).pipe(
          map(posts => posts.find(item => item.slug === post))
        ))
      )
      .subscribe(post => {
        this.post = post;
      });
  }

}
