import {Injectable} from '@angular/core';
import {Router,CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate{
    
    constructor
    (private authService:AuthService,
    private router:Router){

    }

canActivate(){
    if(this.authService.loggedIn()){
        this.router.navigate(['/']);
        return false;
    } else {
        return true;
    }
  }
}