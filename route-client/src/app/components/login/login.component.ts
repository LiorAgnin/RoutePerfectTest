import { Users } from './../../modals/users';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: Users = new Users();
  password;
  result;
  constructor(private _LoginService: LoginService, public router: Router) { }

  ngOnInit() {
  }
  submitHandler(value) {
    // console.log(this.user) 
    this._LoginService.auth(this.user.First_Name, this.user.Password).subscribe((res) => {
      console.log(res.json(), res)
      this.result = res.json();
      this.goToProfile(this.result[0].Id);
    })

  }
 goToProfile(Id) {
    this.router.navigateByUrl('/profile/' + Id);
  }
}
