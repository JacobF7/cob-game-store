import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { Game } from "../game.model";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

export type ShoppingCart = Map<Game, number>;

const CART_STORAGE_KEY = "cart";

@Injectable({
  providedIn: "root",
})
export class ShoppingCartService {
  private _shoppingCart = new BehaviorSubject<ShoppingCart>(null);

  constructor() {}

  addToCart(game: Game): Observable<ShoppingCart> {
    return this.getCurrentCart().pipe(
      take(1),
      map((cart) => {
        const newCart = new Map(cart);
        if (newCart.has(game)) {
          const currentQuantity = newCart.get(game);
          newCart.set(game, currentQuantity + 1);
        } else {
          newCart.set(game, 1);
        }
        return newCart;
      }),
      tap((newCart) => this.setCurrentCart(newCart))
    );
  }

  removeFromCart(game: Game) {
    return this.getCurrentCart().pipe(
      take(1),
      map((cart) => {
        const newCart = new Map(cart);
        if (newCart.has(game) && newCart.get(game) === 1) {
          newCart.delete(game);
        } else if (newCart.has(game)) {
          const currentQuantity = newCart.get(game);
          newCart.set(game, currentQuantity - 1);
        }
        return newCart;
      }),
      tap((newCart) => this.setCurrentCart(newCart))
    );
  }

  removeAllFromCart(game: Game) {
    return this.getCurrentCart().pipe(
      take(1),
      map((cart) => {
        const newCart = new Map(cart);
        if (newCart.has(game)) {
          newCart.delete(game);
        }
        return newCart;
      }),
      tap((newCart) => this.setCurrentCart(newCart))
    );
  }

  emptyCart() {
    this.setCurrentCart(new Map());
  }

  getCurrentCart(): Observable<ShoppingCart> {
    return this._shoppingCart.asObservable().pipe(
      switchMap((cart) => {
        if (cart) {
          return of(cart);
        } else {
          return this.getCurrentCartFromStorage();
        }
      })
    );
  }

  getCurrentCartFromStorage(): Promise<ShoppingCart> {
    return Storage.get({ key: CART_STORAGE_KEY }).then((storedCart) => {
      if (storedCart.value) {
        return this.prepareCartFromStorage(storedCart.value);
      } else {
        return new Map() as ShoppingCart;
      }
    });
  }

  setCurrentCart(cart: ShoppingCart) {
    if (cart) {
      Storage.set({ key: CART_STORAGE_KEY, value: this.prepareCartToStorage(cart) }).then(() =>
        this._shoppingCart.next(cart)
      );
    }
  }

  prepareCartToStorage(cart: ShoppingCart): string {
    const cartItems = [...cart.entries()].map(([game, quantity]) => {
      return { game: game, quantity: quantity };
    });
    return JSON.stringify(cartItems);
  }

  prepareCartFromStorage(storedCart: string): ShoppingCart {
    const cart = new Map() as ShoppingCart;
    const cartItems = JSON.parse(storedCart) as Array<{ game: Game; quantity: number }>;
    cartItems.forEach(({ game, quantity }) => cart.set(game, quantity));
    return cart;
  }

  getShippingCountries(): String[] {
    return [
      "Albania",
      "Andorra",
      "Austria",
      "Belarus",
      "Belgium",
      "Bosnia and Herzegovina",
      "Bulgaria",
      "Croatia",
      "Czech Republic",
      "Denmark",
      "Estonia",
      "Finland",
      "France",
      "Germany",
      "Greece",
      "Hungary",
      "Iceland",
      "Ireland",
      "Italy",
      "Latvia",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Malta",
      "Moldova",
      "Monaco",
      "Montenegro",
      "Netherlands",
      "North Macedonia",
      "Norway",
      "Poland",
      "Portugal",
      "Romania",
      "Russia",
      "San Marino",
      "Serbia",
      "Slovakia",
      "Slovenia",
      "Spain",
      "Sweden",
      "Switzerland",
      "Ukraine",
      "United Kingdom",
    ];
  }
}
