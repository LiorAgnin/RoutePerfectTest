import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Users } from '../modals/users';

@Injectable()
export class LoginService {
  header = new Headers()
  constructor(private http: Http) {

  }

  auth(firstName, Password) {
    let body = {
      First_Name: firstName, Password: Password
    };
    this.header.append('Content-Type', "application/json")
    return this.http.post('http://localhost:3000/login', body)
  }
}
