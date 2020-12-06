import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ActionSheetController, AlertController, LoadingController, ToastController } from "@ionic/angular";
import { Game } from "../game.model";
import { OrdersService } from "../orders/orders.service";
import { ShoppingCartService } from "./shopping-cart.service";

export type ShoppingCartItem = {
  game: Game;
  quantity: number;
};

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.page.html",
  styleUrls: ["./shopping-cart.page.scss"],
})
export class ShoppingCartPage {
  shoppingCartItems: ShoppingCartItem[];

  shippingCountries = [];

  orderForm = new FormGroup({
    addressLine1: new FormControl(null, [Validators.required]),
    addressLine2: new FormControl(null, [Validators.required]),
    postCode: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
  });

  constructor(
    private shoppingCartService: ShoppingCartService,
    private ordersService: OrdersService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.shoppingCartItems = null;
    this.shoppingCartService.getCurrentCart().subscribe((cart) => {
      this.shoppingCartItems = [...cart.entries()].map(([game, quantity]) => {
        return { game: game, quantity: quantity };
      });
    });

    this.shippingCountries = this.shoppingCartService.getShippingCountries();
  }

  incrementGameQuantity(item: ShoppingCartItem) {
    this.shoppingCartService.addToCart(item.game).subscribe(() =>
      this.toastController
        .create({
          message: `${item.game.title} has been added to cart!`,
          duration: 2000,
        })
        .then((toastElement) => toastElement.present())
    );
  }

  decrementGameQuantity(item: ShoppingCartItem) {
    this.shoppingCartService.removeFromCart(item.game).subscribe(() =>
      this.toastController
        .create({
          message: `${item.game.title} has been removed from cart!`,
          duration: 2000,
        })
        .then((toastElement) => toastElement.present())
    );
  }

  removeGame(item: ShoppingCartItem) {
    this.actionSheetController
      .create({
        buttons: [
          {
            text: "Delete",
            role: "destructive",
            handler: () => this.confirmRemoveGameFromCart(item),
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      })
      .then((actionSheetElement) => actionSheetElement.present());
  }

  confirmRemoveGameFromCart(item: ShoppingCartItem) {
    this.shoppingCartService.removeAllFromCart(item.game).subscribe(() => {
      this.toastController
        .create({
          message: `${item.game.title} has been removed from cart!`,
          duration: 2000,
        })
        .then((toastElement) => toastElement.present());
    });
  }

  isFieldInvalid(field: string) {
    const formField = this.orderForm.get(field);
    return formField.touched && formField.invalid;
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      return;
    }

    this.alertController
      .create({
        header: "Confirm Order",
        message: "Are you sure you want to submit this order?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: () => this.confirmOrder(),
          },
        ],
      })
      .then((alertElement) => alertElement.present());
  }

  confirmOrder() {
    this.loadingController
      .create({
        message: "Loading...",
      })
      .then((loadingElement) => {
        loadingElement.present();

        this.ordersService
          .add(
            this.orderForm.get("addressLine1").value,
            this.orderForm.get("addressLine2").value,
            this.orderForm.get("postCode").value,
            this.orderForm.get("city").value,
            this.orderForm.get("country").value,
            this.shoppingCartItems.map((item) => {
              return {
                gameId: item.game.id,
                quantity: item.quantity,
                subTotalPrice: item.game.price * item.quantity,
              };
            })
          )
          .subscribe(() => {
            this.shoppingCartService.emptyCart();
            loadingElement.dismiss();
            this.router.navigate(["/", "store", "orders"]);
            this.orderForm.reset();
          });
      });
  }
}
