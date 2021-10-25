import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LatestPostsComponent} from "./pages/latest-posts/latest-posts.component";
import {CategoryComponent} from "./pages/category/category.component";
import {PostComponent} from "./pages/post/post.component";

const routes: Routes = [
  {
    path: "",
    component: LatestPostsComponent
  },
  {
    path: ":category",
    component: CategoryComponent
  },
  {
    path: ":category/:post",
    component: PostComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
