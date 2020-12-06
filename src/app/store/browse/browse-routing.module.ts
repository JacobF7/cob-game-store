import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BrowsePage } from "./browse.page";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: BrowsePage,
  },
  {
    path: "new",
    loadChildren: () => import("./new-game/new-game.module").then((m) => m.NewGamePageModule),
  },
  {
    path: ":id",
    loadChildren: () => import("./game-details/game-details.module").then((m) => m.GameDetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowsePageRoutingModule {}
