import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PurchaseComponent} from './purchase/purchase.component';
import {AccountComponent} from './account/account.component';
import {HomeComponent} from './home/home.component';
import {MapComponent} from './map/map.component';
import {InvoicesComponent} from './invoices/invoices.component';
import {  AuthGuard as AuthGuard} from './_guards/auth.guard';
import {LoginComponent} from './login/login.component';
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'purchase', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'store', component: InvoicesComponent, canActivate: [AuthGuard]}, // id should be optional
  { path: 'store/:id', component: InvoicesComponent, canActivate: [AuthGuard]} // id should be optional
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
