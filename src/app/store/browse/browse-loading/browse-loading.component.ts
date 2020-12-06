import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-browse-loading",
  templateUrl: "./browse-loading.component.html",
  styleUrls: ["./browse-loading.component.scss"],
})
export class BrowseLoadingComponent implements OnInit {
  loadingGames = Array(5);

  constructor() {}

  ngOnInit() {}
}
