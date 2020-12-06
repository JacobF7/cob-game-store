import { Component, OnInit } from "@angular/core";
import { delay } from "rxjs/operators";
import { Game } from "../game.model";
import { GamesService } from "../games.service";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.page.html",
  styleUrls: ["./browse.page.scss"],
})
export class BrowsePage implements OnInit {
  private games: Game[];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.gamesService.games.pipe(delay(1000)).subscribe((games) => (this.games = games));
  }
}
