import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestPostsComponent } from './pages/latest-posts/latest-posts.component';
import { CategoryComponent } from './pages/category/category.component';
import { PostComponent } from './pages/post/post.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LatestPostsComponent,
    CategoryComponent,
    PostComponent,
    CategoriesComponent,
    PostItemComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
