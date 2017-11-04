import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:String;
  password:String;
  previousUrl;

  constructor(
    private flashMessage :FlashMessagesService,
    private authService: AuthService,
    private authGuard: AuthGuard,
    private router: Router) { }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.flashMessage.show("You must be logged in to view this page",{cssClass:'alert-danger',timeout:2000});      
      this.previousUrl=this.authGuard.redirectUrl;
      this.authGuard.redirectUrl=undefined;
    }
  }

  onLoginSubmit(){
    const user ={
      username:this.username,
      password:this.password
    };
    this.authService.authenticateUser(user).subscribe(data=>{
      if(data.success){
        this.authService.storeUserData(data.token,data.user);
        this.flashMessage.show("You are now logged in",{cssClass:'alert-success',timeout:2000});
        if(this.previousUrl)
          this.router.navigate([this.previousUrl]);
        else        
          this.router.navigate(['/']);
      }else{
        this.flashMessage.show(data.msg,{cssClass:'alert-danger',timeout:2000});
        this.router.navigate(['/login']);
      }
    });
  }

}
