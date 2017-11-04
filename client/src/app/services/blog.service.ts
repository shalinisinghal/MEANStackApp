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
}
