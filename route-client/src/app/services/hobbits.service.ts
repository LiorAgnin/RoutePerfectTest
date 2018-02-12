import { Hobbies } from './../modals/hobbits';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class HobbiesService {

  constructor(private http: Http) {
  }

  GetHobbies(Id) {
    return this.http.get('http://localhost:3000/getHobbit/'+ Id)
  }
}
