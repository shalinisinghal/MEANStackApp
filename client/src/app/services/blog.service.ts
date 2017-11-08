import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {AuthService} from './auth.service';

@Injectable()
export class BlogService {

  constructor(private http:Http,
    private authService : AuthService
  ) { }

  getAllBlogs(){
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/blogs/getBlogs',{headers:headers}).map(res=>res.json());
  }

   // Function to create a new blog post
   newBlog(blog) {
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/blogs/addBlog', blog, {headers:headers}).map(res => res.json());
  }

  // Function to get the blog using the id
  getSingleBlog(id) {
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/blogs/singleBlog/' + id, {headers:headers}).map(res => res.json());
  }

  // Function to edit/update blog post
  editBlog(blog) {
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/blogs/updateBlog/', blog, {headers:headers}).map(res => res.json());
  }

  // Function to delete a blog
  deleteBlog(id) {
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:3000/blogs/deleteBlog/' + id, {headers:headers}).map(res => res.json());
  }

  // Function to like a blog post
  likeBlog(id) {
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    const blogData = { id: id };
    return this.http.put('http://localhost:3000/blogs/likeBlog/', blogData,{headers:headers}).map(res => res.json());
  }

  // Function to dislike a blog post
  dislikeBlog(id) {
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    const blogData = { id: id };
    return this.http.put('http://localhost:3000/blogs/dislikeBlog/', blogData,{headers:headers}).map(res => res.json());
  }

  // Function to post a comment on a blog post
  postComment(id, comment) {
    // Create blogData to pass to backend
    var headers=new Headers();
    this.authService.loadToken();
    headers.append('Authorization',this.authService.authToken);
    headers.append('Content-Type','application/json');
    const blogData = {
      id: id,
      comment: comment
    }
    return this.http.post('http://localhost:3000/blogs/comment', blogData,{headers:headers}).map(res => res.json());

  }

}
