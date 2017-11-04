import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import { BlogService } from '../../services/blog.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogPosts;

  constructor(
    private flashMessage :FlashMessagesService,
    private router:Router,
    private blogService: BlogService) { }

  ngOnInit() {
    this.getAllBlogs();
  }

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPosts=data.blogs;
    });
  }

  // readUrl(event:any) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  
  //     reader.onload = (event:any) => {
  //       this.url = event.target.result;
  //     }
  
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // }

}
