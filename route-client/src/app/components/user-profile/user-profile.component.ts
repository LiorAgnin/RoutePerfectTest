import { Users } from './../../modals/users';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [UsersService]
})
export class UserProfileComponent implements OnInit {
  userProfile: Users;
  userFriends: any[] = [];
  constructor(private _UsersService: UsersService, private route: ActivatedRoute,
    private router: Router) {
  }
  userID;
  ngOnInit() {
    this.userID = this.route.snapshot.params.Id;
    this._UsersService.getUser(this.userID).subscribe((res) => {
      this.userProfile = res.json();
      console.log(this.userProfile);
    });

  }
  showAllFriend() {
    console.log(this.userID)
    this._UsersService.getUserFriends(this.userID).subscribe(res => {
      this.userFriends = res.json();
      console.log(this.userFriends);
    })
  }
}
