import { Component, OnInit } from "@angular/core";
import { delay } from "rxjs/operators";
import { Order } from "./order.model";
import { OrdersService } from "./orders.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"],
})
export class OrdersPage implements OnInit {
  orders: Order[];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.ordersService.orders.pipe(delay(1000)).subscribe((orders) => (this.orders = orders));
  }
}
