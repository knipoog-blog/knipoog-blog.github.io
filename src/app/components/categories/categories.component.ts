import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Blog} from "../../blogs.types";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements OnInit {

  categories: Blog[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http
      .get<Blog[]>("/assets/data/blogs.json")
      .subscribe((blogs) => {
        this.categories = blogs;
      })
  }

}
