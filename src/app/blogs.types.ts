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
  image: {
    url: string;
  }
}
