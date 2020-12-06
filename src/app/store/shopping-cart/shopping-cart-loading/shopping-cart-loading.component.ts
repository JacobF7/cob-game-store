import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-shopping-cart-loading",
  templateUrl: "./shopping-cart-loading.component.html",
  styleUrls: ["./shopping-cart-loading.component.scss"],
})
export class ShoppingCartLoadingComponent implements OnInit {
  loadingShoppingCartItems = Array(15);

  constructor() {}

  ngOnInit() {}
}
