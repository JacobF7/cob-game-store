import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrdersPageRoutingModule } from "./orders-routing.module";

import { OrdersPage } from "./orders.page";
import { OrdersLoadingComponent } from "./orders-loading/orders-loading.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, OrdersPageRoutingModule],
  declarations: [OrdersPage, OrdersLoadingComponent],
})
export class OrdersPageModule {}
