import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { Order, OrderItem } from "./order.model";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  get orders(): Observable<Order[]> {
    return this.authService.user.pipe(
      switchMap((user) =>
        this.httpClient.get<any>(
          `https://cob-game-store.firebaseio.com/orders.json?orderBy="userId"&equalTo="${user.localId}"&auth=${user.idToken}`
        )
      ),
      map((orders) => {
        return Object.keys(orders).map((orderId) => {
          return {
            id: orderId,
            ...orders[orderId],
          };
        });
      })
    );
  }

  find(orderId: string): Observable<Order> {
    return this.authService.token.pipe(
      switchMap((token) =>
        this.httpClient.get<any>(`https://cob-game-store.firebaseio.com/orders/${orderId}.json?auth=${token}`)
      ),
      map((order) => {
        if (order) {
          order.id = orderId;
          return order;
        } else {
          return null;
        }
      })
    );
  }

  add(
    addressLine1: string,
    addressLine2: string,
    postCode: string,
    city: string,
    country: string,
    items: OrderItem[]
  ): Observable<any> {
    return this.authService.user.pipe(
      switchMap((user) =>
        this.httpClient.post<any>(`https://cob-game-store.firebaseio.com/orders.json?auth=${user.idToken}`, {
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          postCode: postCode,
          city: city,
          country: country,
          items: items,
          totalPrice: items.map((item) => item.subTotalPrice).reduce((total, itemSubTotal) => total + itemSubTotal, 0),
          userId: user.localId,
        })
      )
    );
  }
}
