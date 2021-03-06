import {Component, OnDestroy, OnInit} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/Account';
import {MatSnackBar} from "@angular/material/snack-bar";
import * as L from "leaflet";
import {Position} from "../_models/Position";
import {MatDialog} from "@angular/material/dialog";
import {TopupDialogComponent} from "./topup-dialog/topup-dialog.component";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  account: Account;
  isAccount = false;
  map: L.Map;
  mapOptions: any = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 12,
    center: L.latLng([45.05, 7.6666667])
  };

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.accountService.account().subscribe(
      (data: any) => {
        this.account = new Account();
        this.account.id = data.id;
        this.account.username = data.username;
        this.account.wallet = data.wallet;
        this.isAccount = true;
      },
      error => {
        console.log(error);
        this.snackBar.open('Server currently unavailable', 'Retry')
          .onAction().subscribe(() => {
          window.location.reload();
        });
      }
    );
  }
  onTopUp(): void {
    const dialogRef = this.dialog.open(TopupDialogComponent);
    dialogRef.afterClosed()
      .subscribe(res => {
        if (res && res >= 100 && res <= 1000) {
          return this.accountService.topUp(res).subscribe((acc: Account) => {
              this.snackBar.open('Top Up successful!', 'Close', {duration: 1000});
              this.account.wallet = acc.wallet;
            },
            err => this.snackBar.open('Operation failed!', 'Close', {duration: 1000}));
        }
      });
  }
  /***** MAP SECTION ******/
  onMapReady(map: L.Map): void {
    this.map = map;
  }

  showPositions(positions: Position[]) {
    this.map.eachLayer(l =>{ if (l instanceof L.CircleMarker && l.getPopup() != null){
      this.map.removeLayer(l);}
    });
    positions.forEach(el => {
      const marker = L.circleMarker([el.latitude, el.longitude]);
      marker.bindPopup(this.popupBody(el));
      marker.addTo(this.map);
    });
  }
  popupBody(position: any): string {
    const date = new Date(position.timestamp*1000).toUTCString();
    return `` +
      `<div><strong>Latitude:</strong> ${ position.latitude }</div>` +
      `<div><strong>Longitude:</strong> ${ position.longitude }</div> `+
      `<div><strong>Timestamp:</strong> ${ date }</div> `+
      `<div><strong>ArchiveId:</strong> ${ position.archiveId }</div> `;
  }

  ngOnDestroy() {
    this.snackBar.dismiss();
  }
}
