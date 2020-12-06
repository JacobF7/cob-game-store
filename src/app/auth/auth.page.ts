import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLogin = true;

  authForm = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
  }

  isUsernameInvalid() {
    return this.authForm.get("username").touched && this.authForm.get("username").invalid;
  }

  isPasswordInvalid() {
    return this.authForm.get("password").touched && this.authForm.get("password").invalid;
  }

  performAuthAction() {
    if (this.authForm.invalid) {
      return;
    }

    const username = this.authForm.get("username").value;
    const password = this.authForm.get("password").value;

    if (this.isLogin) {
      this.performLogin(username, password);
    } else {
      this.performRegister(username, password);
    }
  }

  performLogin(username: string, password: string) {
    this.loadingController.create({ message: "Loading..." }).then((loadingElement) => {
      loadingElement.present();
      this.authService.login(username, password).subscribe(
        () => {
          loadingElement.dismiss();
          this.router.navigate(["/", "store"]);
          this.authForm.reset();
        },
        () => {
          loadingElement.dismiss();
          this.showErrorAlert();
        }
      );
    });
  }

  performRegister(username: string, password: string) {
    this.loadingController.create({ message: "Loading" }).then((loadingElement) => {
      loadingElement.present();
      this.authService.register(username, password).subscribe(
        () => {
          loadingElement.dismiss();
          this.isLogin = true;
        },
        () => {
          loadingElement.dismiss();
          this.showErrorAlert();
        }
      );
    });
  }

  showErrorAlert() {
    this.alertController
      .create({
        header: "Error",
        message: `Failed to ${this.isLogin ? "login" : "register"} user! Please try again.`,
        buttons: ["Ok"],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }
}
