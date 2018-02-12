import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class UsersService {

  constructor(private _Http: Http) { }
  getUser(Id) {
    return this._Http.get('http://localhost:3000/getuser/' + Id)
  }
  getUserFriends(Id) {
    return this._Http.get('http://localhost:3000/getfriends/' + Id)
  }
}
