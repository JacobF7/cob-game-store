import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { ShoppingCartService } from "./shopping-cart/shopping-cart.service";

@Component({
  selector: "app-store",
  templateUrl: "./store.page.html",
  styleUrls: ["./store.page.scss"],
})
export class StorePage implements OnInit {
  cartItems = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.shoppingCartService.getCurrentCart().subscribe((shoppingCart) => {
      this.cartItems = [...shoppingCart.values()].reduce(
        (gameQuanity, anotherGameQuantity) => gameQuanity + anotherGameQuantity,
        0
      );
    });
  }
}
