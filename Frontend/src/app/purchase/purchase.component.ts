import {Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from '../_services/position.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CheckoutDialogComponent} from './checkout-dialog/checkout-dialog.component';
import {Invoice} from '../_models/Invoice';
import {Router} from '@angular/router';
import {StoreService} from '../_services/store.service';
import {ArchiveService} from '../_services/archive.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit, OnDestroy {
   subscription: Subscription;
   positions = [];
   selectedPositions = [];
   selected: boolean = false;
   totalPrice = 0;
  private invoice: any;
  constructor(private positionService: PositionService,
              public dialog: MatDialog,
              public archiveService: ArchiveService,
              public router: Router ) {}

  ngOnInit(): void {
    // this.subscription = this.positionService.selectedSubject.subscribe(markers => {
    this.subscription = this.archiveService.selectedArchivesSubject.subscribe(ids => {
      ids.forEach(id => {
        if ( id !== 'EMPTY' ){
          console.log('EL - ' + id);
          this.positions.push(id);
        } else {
          this.positions = [];
        }
      });
    });
  }

  onConfirmPurchase(): void {
    const positions = [];
  //  for (const layer of this.selectedPositions) {
  //    positions.push(layer);
  //  }
    // this.positionService.addBoughtPosition(this.selectedPositions);
    this.archiveService.addBoughtArchives(this.selectedPositions);
    this.archiveService.buyArchives(this.selectedPositions).subscribe(res => {
    this.invoice = new Invoice();
    this.invoice.id = res.id;
    this.invoice.items = res.items;
    this.invoice.username = res.username;
    this.invoice.paid = res.paid;
    alert(this.invoice.id);
    this.openDialog();
    },
      () => {console.log('ERROR GENERATING INVOICE'); }   );
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      width: '400px',
      height: '300px',
      data : this.invoice
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.router.navigate(['/store', this.invoice.id]);
      } else{
        this.selectedPositions = [];
      }
    });
  }
  onSelectPosition(event: any): void {
    const option = event.option;
    if (option.selected) {
      this.selectedPositions.push(option.value);
      this.totalPrice += 1;
      this.selected =  true;
    } else {
      const index = this.selectedPositions.indexOf(option.value);
      this.selectedPositions.splice(index, 1);
      this.totalPrice -= 1;
      if(this.selectedPositions.length == 0){
        this.selected = false;
      }
    }
    console.log('OnSelectArchive', option, this.selectedPositions);
  }
  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }
}
