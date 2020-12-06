import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { delay } from "rxjs/operators";
import { Game } from "../../game.model";
import { GamesService } from "../../games.service";
import { ShoppingCartService } from "../../shopping-cart/shopping-cart.service";

@Component({
  selector: "app-game-details",
  templateUrl: "./game-details.page.html",
  styleUrls: ["./game-details.page.scss"],
})
export class GameDetailsPage implements OnInit {
  gameId = this.activatedRoute.snapshot.paramMap.get("id");
  game: Game;

  constructor(
    private gamesService: GamesService,
    private shoppingCartService: ShoppingCartService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.gamesService
      .find(this.gameId)
      .pipe(delay(1000))
      .subscribe((game) => (this.game = game));
  }

  addGameToCart() {
    this.shoppingCartService.addToCart(this.game).subscribe(() =>
      this.toastController
        .create({
          message: `${this.game.title} has been added to cart!`,
          duration: 2000,
        })
        .then((toastElement) => toastElement.present())
    );
  }
}
