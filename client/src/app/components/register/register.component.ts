import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  name:String;
  username:String;
  email:String;
  password:String;
  form: FormGroup;
  processing=false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
     private flashMessage :FlashMessagesService,
     private authService: AuthService,
    private router: Router,
    private formBuilder:FormBuilder) {
      this.createForm();
    }

    ngOnInit() {
    }

     createForm(){
      this.form=this.formBuilder.group({
        name:['',Validators.required],
        username:['',Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          this.validateUsername
        ])],
        email:['',Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40),
          this.validateEmail
        ])],
        password:['',Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePassword
        ])],
        confirm:['',Validators.required]
      },{validator:this.matchingPasswords('password','confirm')});
    }

  validateEmail(controls){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(controls.value))
      return null;
    else
      return {"validateEmail":true};
  }

  validateUsername(controls){
    const re=/^[a-zA-Z0-9]+$/
    if(re.test(controls.value))
      return null;
    else
      return {"validateUsername":true};
  }

  validatePassword(controls){
    var re =/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/
    if(re.test(controls.value))
      return null;
    else
      return {"validatePassword":true};
  }

  matchingPasswords(password,confirm){
    return(group:FormGroup)=>{
      if(group.controls[password].value===group.controls[confirm].value)
        return null;
      else
        return {'matchingPasswords':true};
    }
  }

  onRegisterSubmit(){
    this.processing=true;
    const user={
      name:this.form.get('name').value,
      username:this.form.get('username').value,
      email:this.form.get('email').value,
      password:this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(data=>{
      if(data.success){
        this.flashMessage.show(data.msg,{cssClass:'alert-success',timeout:2000});
        this.router.navigate(['/login']);        
      }else{
        this.processing=false;
        this.flashMessage.show(data.msg,{cssClass:'alert-danger',timeout:2000});
        this.router.navigate(['/register']);
      }
    });
  }

  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
      if(data.success){
        this.emailValid=true;
        this.emailMessage=data.msg;
      }
      else{
        this.emailValid=false;
        this.emailMessage=data.msg;
      }
    });
  }

  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
      if(data.success){
        this.usernameValid=true;
        this.usernameMessage=data.msg;
      }
      else{
        this.usernameValid=false;
        this.usernameMessage=data.msg;
      }
    });
  }


}

//import { ValidateService } from '../../services/validate.service';

//private validateService: ValidateService, // inside constructor
// if(!this.validateService.validateRegister(user)){
    //   this.flashMessage.show("Please fill in all fields",{cssClass:'alert-danger',timeout:3000});
    //   return false;
    // }

    // if(!this.validateService.validateEmail(user.email)){
    //   this.flashMessage.show("Please use a valid email",{cssClass:'alert-danger',timeout:3000});
    //   return false;
    // }

    // if(!this.validateService.validateUsername(user.username)){
    //   this.flashMessage.show("username must have atleast 6 characters",{cssClass:'alert-danger',timeout:3000});
    //   return false;
    // }
