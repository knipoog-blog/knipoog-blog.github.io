import {LOCALE_ID, NgModule} from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestPostsComponent } from './pages/latest-posts/latest-posts.component';
import { CategoryComponent } from './pages/category/category.component';
import { PostComponent } from './pages/post/post.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { PageHeaderComponent } from './components/page-header/page-header.component';
import {CommonModule} from "@angular/common";
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { PostListComponent } from './components/post-list/post-list.component';
import {BaseHrefInterceptor} from "./interceptors/baseHref.interceptor";
registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent,
    LatestPostsComponent,
    CategoryComponent,
    PostComponent,
    CategoriesComponent,
    PostItemComponent,
    PageHeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'nl' },
    { provide: HTTP_INTERCEPTORS, useClass: BaseHrefInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
