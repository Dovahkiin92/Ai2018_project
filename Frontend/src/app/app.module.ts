import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import { AppComponent } from './app.component';
import { PositionService } from './_services/position.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseComponent } from './purchase/purchase.component';
import { AppRoutingModule } from './app-routing.module';
import { MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { AccountComponent } from './account/account.component';
import {AccountService} from './_services/account.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {AuthenticationService} from './_services/authentication.service';
import { MapComponent } from './map/map.component';
import { CheckoutDialogComponent } from './purchase/checkout-dialog/checkout-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { InvoicesComponent } from './invoices/invoices.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CancelDialogComponent} from './invoices/cancel-dialog/cancel-dialog.component';
import {DetailsDialogComponent} from './invoices/details-dialog/details-dialog.component';
import {PayDialogComponent} from './invoices/pay-dialog/pay-dialog.component';
import {StoreService} from './_services/store.service';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import {AuthGuard} from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';
import {TokenInterceptor} from './_interceptors/token.interceptor';
import {ArchiveService} from './_services/archive.service';
import { ArchiveCancelDialogComponent } from './archives/archive-cancel-dialog/archive-cancel-dialog.component';
import {MatInputModule} from '@angular/material/input';
import { ArchiveDetailsDialogComponent } from './archives/archive-details-dialog/archive-details-dialog.component';
import { ArchivesComponent } from './archives/archives.component';
import { TimechartComponent } from './timechart/timechart.component';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [
    AppComponent,
    PurchaseComponent,
    AccountComponent,
    HomeComponent,
    NavbarComponent,
    MapComponent,
    CheckoutDialogComponent,
    InvoicesComponent,
    CancelDialogComponent,
    DetailsDialogComponent,
    PayDialogComponent,
    LoginComponent,
    ArchiveCancelDialogComponent,
    ArchiveDetailsDialogComponent,
    ArchivesComponent,
    TimechartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LeafletModule,
    LeafletDrawModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatOptionModule,
    NgApexchartsModule
  ],
  providers: [PositionService, AccountService, AuthenticationService, StoreService, ArchiveService, AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
