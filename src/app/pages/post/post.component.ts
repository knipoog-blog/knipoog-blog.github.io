import {AfterViewChecked, Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {Blog, Post} from "../../blogs.types";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {exhaustMap, filter, map} from "rxjs/operators";
import {TitleService} from "../../services/title.service";
import {isPlatformBrowser} from "@angular/common";

declare global {
  interface Window {
    refreshFsLightbox: () => void
  }
}

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.sass"]
})
export class PostComponent implements OnInit, AfterViewChecked {

  post?: Post;

  category?: Blog;

  constructor (
    private http: HttpClient,
    private route: ActivatedRoute,
    private title: TitleService,
     @Inject(PLATFORM_ID) private platformId: string
  ) {
  }

  ngOnInit (): void {
    const post$ = this.route.paramMap
      .pipe(
        map(paramMap => [paramMap.get("category"), paramMap.get("post")]),
        exhaustMap(([category, post]) => this.http.get<Post[]>(`/assets/data/${category}.json`).pipe(
          map(posts => posts.find(item => item.slug === post)),
          filter(post => !!post),
        ))
      );

    post$
      .subscribe(post => {
        this.post = post;
        this.category = post?.category;
        this.title.setTitle(post?.category?.title || "", post?.title);

      });
  }

  ngAfterViewChecked () {
    if (isPlatformBrowser(this.platformId)) {
      window.refreshFsLightbox();
    }
  }
}
