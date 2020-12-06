import { Component, OnInit } from "@angular/core";
import { delay } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/auth/user.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.pipe(delay(500)).subscribe((user) => (this.user = user));
  }

  getAvatarImage() {
    return `https://eu.ui-avatars.com/api/?name=${this.user.email}`;
  }

  getSessionExpiryDate() {
    return new Date(this.user.expiryDate).toLocaleString();
  }

  logout() {
    this.authService.logout();
  }
}
