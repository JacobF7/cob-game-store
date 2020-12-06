import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-orders-loading",
  templateUrl: "./orders-loading.component.html",
  styleUrls: ["./orders-loading.component.scss"],
})
export class OrdersLoadingComponent implements OnInit {
  loadingOrders = Array(10);

  constructor() {}

  ngOnInit() {}
}
