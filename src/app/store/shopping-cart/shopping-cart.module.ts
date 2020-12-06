import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ShoppingCartPageRoutingModule } from "./shopping-cart-routing.module";

import { ShoppingCartPage } from "./shopping-cart.page";
import { ShoppingCartLoadingComponent } from "./shopping-cart-loading/shopping-cart-loading.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ShoppingCartPageRoutingModule],
  declarations: [ShoppingCartPage, ShoppingCartLoadingComponent],
})
export class ShoppingCartPageModule {}
