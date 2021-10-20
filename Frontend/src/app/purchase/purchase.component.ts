import {Component, OnDestroy, OnInit} from '@angular/core';
import {PositionService} from '../_services/position.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CheckoutDialogComponent} from './checkout-dialog/checkout-dialog.component';
import {Invoice} from '../_models/Invoice';
import {Router} from '@angular/router';
import {ArchiveService} from '../_services/archive.service';
import {StoreService} from "../_services/store.service";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit, OnDestroy {
   subscription: Subscription;
   currentIds = [];
   selectedIds = [];
   selected: boolean = false;
   totalPrice = 0;
  private invoice: any;
  constructor(public dialog: MatDialog,
              public archiveService: ArchiveService,
              private storeService: StoreService,
              public router: Router ) {}

  ngOnInit(): void {
    this.subscription = this.archiveService.selectedArchivesSubject.subscribe(ids => {
      ids.forEach(id => {
        if ( id !== 'EMPTY' ){
          this.currentIds.push(id);
        } else {
          this.currentIds = [];
          this.selectedIds = [];
          this.selected = false;
        }
      });
    });
  }
  onConfirmPurchase(): void {
    this.archiveService.addBoughtArchives(this.selectedIds);
    this.archiveService.buyArchives(this.selectedIds).subscribe(res => {
    this.invoice =  this.storeService.createInvoice(res);
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
        this.selectedIds = [];
      }
    });
  }
  onSelectPosition(event: any): void {
    const option = event.option;
    if (option.selected) {
      this.selectedIds.push(option.value);
      this.totalPrice += 1; // TODO: get archive price
      this.selected =  true;
    } else { //undo selection
      const index = this.selectedIds.indexOf(option.value);
      this.selectedIds.splice(index, 1);
      this.totalPrice -= 1;
      if(this.selectedIds.length == 0){
        this.selected = false;
      }
    }
  }
  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }
}
