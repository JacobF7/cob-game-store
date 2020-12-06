import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";

import { StorePage } from "./store.page";

const routes: Routes = [
  {
    path: "",
    component: StorePage,
    children: [
      {
        path: "browse",
        loadChildren: () => import("./browse/browse.module").then((m) => m.BrowsePageModule),
      },
      {
        path: "shopping-cart",
        loadChildren: () => import("./shopping-cart/shopping-cart.module").then((m) => m.ShoppingCartPageModule),
      },
      {
        path: "orders",
        loadChildren: () => import("./orders/orders.module").then((m) => m.OrdersPageModule),
      },
      {
        path: "profile",
        loadChildren: () => import("./profile/profile.module").then((m) => m.ProfilePageModule),
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "browse",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule {}
