import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '../_models/Invoice';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class StoreService {

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
     return this.http.get<Invoice[]>(environment.store_invoices_url);
  //  return this.http.get<Invoice[]>('../../assets/invoice.json');
  }
  createInvoice(res): Invoice{
    let invoice = new Invoice();
    invoice.id = res.id;
    invoice.items = res.items;
    invoice.username = res.username;
    invoice.paid = res.paid;
    return invoice;
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
     return this.http.get<Invoice>(environment.store_invoice_detail_url.replace('{id}', invoiceId));
   // return this.http.get<Invoice>('../../assets/invoice.json');
  }

  viewInvoice(invoiceId: string): Observable<Invoice> {
    return this.http.get<Invoice>(environment.store_invoice_detail_url);
  }
  payInvoice(invoiceId: string): Observable<Invoice> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json; charset=utf-8',
      })
    };
    return this.http.post<Invoice>(
      environment.store_invoice_pay_url.replace('{id}', invoiceId),
      null,
      httpOptions
    );
  }
  cancelInvoice(invoiceId: string): Observable<Invoice> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json; charset=utf-8',
      })
    };
    return this.http.delete<Invoice>(
      environment.store_invoice_cancel_url.replace('{id}', invoiceId),
      httpOptions
    );
  }
}

