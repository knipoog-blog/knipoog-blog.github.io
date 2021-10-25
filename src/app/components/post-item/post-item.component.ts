import {Component, Input, OnInit} from "@angular/core";
import {Post} from "../../blogs.types";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.sass']
})
export class PostItemComponent implements OnInit {

  @Input() post!: Post;

  ngOnInit(): void {
  }

}
