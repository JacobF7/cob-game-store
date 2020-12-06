import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { BrowsePageRoutingModule } from "./browse-routing.module";

import { BrowsePage } from "./browse.page";
import { BrowseLoadingComponent } from "./browse-loading/browse-loading.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, BrowsePageRoutingModule],
  declarations: [BrowsePage, BrowseLoadingComponent],
})
export class BrowsePageModule {}
