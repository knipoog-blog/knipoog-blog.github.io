import {Observable} from "rxjs";

export interface Blog {
  id: string;
  title: string;
}

export interface Post {
  title: string;
  summary: string;
  date: string;
  slug: string;
  category: {
    id: string;
    title: string;
  }
  images: string[];
  image: {
    url: string;
  }
}
