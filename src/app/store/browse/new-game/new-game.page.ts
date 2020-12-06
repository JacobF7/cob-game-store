import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { GamesService } from "../../games.service";

@Component({
  selector: "app-new-game",
  templateUrl: "./new-game.page.html",
  styleUrls: ["./new-game.page.scss"],
})
export class NewGamePage implements OnInit {
  newGameForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    imageUrl: new FormControl(null, [Validators.required]),
  });

  constructor(private gamesService: GamesService, private router: Router, private toastController: ToastController) {}

  ngOnInit() {}

  addNewGame() {
    if (this.newGameForm.invalid) {
      return;
    }

    this.gamesService
      .add(
        this.newGameForm.get("title").value,
        this.newGameForm.get("description").value,
        this.newGameForm.get("price").value,
        this.newGameForm.get("imageUrl").value
      )
      .subscribe(() => {
        this.router.navigate(["/", "store", "browse"]);
        this.toastController
          .create({
            message: `${this.newGameForm.get("title").value} added successfully!`,
            duration: 2000,
          })
          .then((toastElement) => {
            toastElement.present();
            this.newGameForm.reset();
          });
      });
  }

  isFieldInvalid(field: string) {
    return this.newGameForm.get(field).touched && this.newGameForm.get(field).invalid;
  }
}
