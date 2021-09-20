import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { PayDialogComponent } from './pay-dialog/pay-dialog.component';
import { CancelDialogComponent } from './cancel-dialog/cancel-dialog.component';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StoreService} from '../_services/store.service';
import {ActivatedRoute} from '@angular/router';
import {Invoice} from '../_models/Invoice';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'createdAt', 'amount', 'isPaid', 'actions'];
  dataSource = new MatTableDataSource();
  invoice: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  noInvoices: boolean;

  constructor(
    private location: Location,
    private storeService: StoreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const currentId = params.get('id');
      if ( currentId  ) {
        this.storeService.getInvoice(currentId).subscribe(
          invoice => {
            console.log('Invoices retrieved', invoice.id);
            this.invoice = invoice;
            this.reload();
            this.detailsInvoice(this.invoice);
             },
          err => console.log('Error getting invoice', err)
        );
      } else{
        this.storeService.getInvoices().subscribe( items => {
            console.log('items' + items);
            if ( items.length === 0) {
              this.noInvoices = true;
            }
            this.dataSource.data = items;
          });
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  goBack(): void {
    this.location.back();
  }

  reload(): void {
    const invoices = this.storeService.getInvoices();
    invoices.subscribe( items => {
        console.log('Invoices retrieved', items);
        this.dataSource.data = items;
      },
      err => {
        console.log('Error retrieving invoices', err);
      });
  }

  detailsInvoice(invoice: any): void {
    console.log('invoice' + invoice.items);
    const dialogRef = this.dialog.open(DetailsDialogComponent, {
      width: '400px',
      height: '300px',
      data: invoice
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.payInvoice(invoice);
      }
    });
  }

  payInvoice(invoice: Invoice): void {
    const dialogRef = this.dialog.open(PayDialogComponent, {
      data: invoice
    });
    dialogRef.afterClosed().subscribe( conf => {
      if (conf) {
        const resp = this.storeService.payInvoice(conf);
        resp.subscribe(res => {
          console.log('Invoice paid', res);
          this.snackBar.open('Positions purchased', 'Close', {duration: 1300});
          this.reload();
        },
        err => {
          this.snackBar.open('Unable to proceed.', 'Close', {duration: 800});
        });
      }
    });
  }

  cancelInvoice(invoice: Invoice): void {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      data: invoice
    });
    dialogRef.afterClosed().subscribe( res => {
      if (res) {
        const resp = this.storeService.cancelInvoice(invoice.id);
        resp.subscribe(req => {
            this.snackBar.open('Invoice successful deleted!', 'Close', {duration: 800});
            this.reload();
          },
          err => {
            this.snackBar.open('Unable to proceed.', 'Close', {duration: 800});
          });
      }
    });
  }
}
