import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { delay, map, take, tap } from "rxjs/operators";
import { Game } from "../../game.model";
import { GamesService } from "../../games.service";
import { OrderDetails, OrderItemDetails } from "../order.model";
import { OrdersService } from "../orders.service";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  order: OrderDetails;

  constructor(
    private ordersService: OrdersService,
    private gamesService: GamesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const orderId = this.activatedRoute.snapshot.paramMap.get("id");
    this.ordersService
      .find(orderId)
      .pipe(
        delay(500),
        map((order) => order as OrderDetails)
      )
      .subscribe((order) => {
        if (order) {
          forkJoin(order.items.map((item) => this.scheduleSetOrderItemDetails(item))).subscribe(
            () => (this.order = order)
          );
        }
      });
  }

  scheduleSetOrderItemDetails(item: OrderItemDetails) {
    return this.gamesService.find(item.gameId).pipe(
      take(1),
      tap((game) => (item.gameDetails = game))
    );
  }
}
