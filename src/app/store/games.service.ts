import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Game } from "./game.model";

@Injectable({
  providedIn: "root",
})
export class GamesService {
  private _games: Game[] = [
    {
      id: "234567",
      title: "FIFA 2021",
      description:
        "Football is back with EA SPORTS™ FIFA 21, featuring more ways to team up on the street or in the stadium to enjoy even bigger victories with friends.",
      price: 69.99,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/FIFA_21_Standard_Edition_Cover.jpg/220px-FIFA_21_Standard_Edition_Cover.jpg",
    },
    {
      id: "123456",
      title: "F1 2020",
      description:
        "F1 2020 allows you to create your F1 team for the very first time and race alongside the official teams and drivers. Compete on 22 circuits, with current and classic content.",
      price: 65.99,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/84/F1_2020_Cover.jpg",
    },
    {
      id: "345678",
      title: "Grand Theft Auto V",
      description:
        "Grand Theft Auto V offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.",
      price: 50.99,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
    },
    {
      id: "456789",
      title: "Ratchet & Clank",
      description:
        "Ratchet & Clank is a third-person three-dimensional action-adventure game with elements of platforming, shooting, and puzzle solving in the vein of the original, updated with gameplay elements returning from previous games in the franchise.",
      price: 45.99,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/37/Ratchet_and_Clank_cover.jpg",
    },
  ];

  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  get games(): Observable<Game[]> {
    return this.authService.token.pipe(
      switchMap((token) => this.httpClient.get<any>(`https://cob-game-store.firebaseio.com/games.json?auth=${token}`)),
      map((games) => {
        if (games) {
          // the id field is contained in name field for firebase
          return Object.keys(games).map((gameId) => {
            const storedGame = games[gameId];
            storedGame.id = gameId;
            return storedGame;
          });
        } else {
          return [];
        }
      })
    );
  }

  find(gameId: string): Observable<Game> {
    return this.authService.token.pipe(
      switchMap((token) =>
        this.httpClient.get<Game>(`https://cob-game-store.firebaseio.com/games/${gameId}.json?auth=${token}`)
      ),
      map((game) => {
        if (game) {
          game.id = gameId;
          return game;
        } else {
          return null;
        }
      })
    );
  }

  add(title: string, description: string, price: number, imageUrl: string): Observable<any> {
    return this.authService.token.pipe(
      switchMap((token) =>
        this.httpClient.post<any>(`https://cob-game-store.firebaseio.com/games.json?auth=${token}`, {
          title: title,
          description: description,
          price: price,
          imageUrl: imageUrl,
        })
      )
    );
  }
}
