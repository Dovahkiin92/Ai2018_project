// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
 // const RESOURCE_SERVER_HOST = '192.168.99.103';
 const RESOURCE_SERVER_HOST = 'localhost';
const RESOURCE_SERVER_PORT = '8081';
const AUTHORIZATION_SERVER_HOST = '192.168.99.103';
const AUTHORIZATION_SERVER_PORT = '9000';
export const environment = {
  production: false,
  client_credentials: 'trusted-app:secret',
  register_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/register',
  trusted_url: 'http://trusted-app:secret@localhost:8080/oauth/token',
  refresh_url: 'http://register-app:secret@localhost:8080/oauth/token',
  authorization_code_url : 'http://'+AUTHORIZATION_SERVER_HOST +':' + AUTHORIZATION_SERVER_PORT +'/oauth/authorize',
  access_token_url : 'http://'+AUTHORIZATION_SERVER_HOST +':' + AUTHORIZATION_SERVER_PORT +'/oauth/token',
  logout_url : 'http://'+AUTHORIZATION_SERVER_HOST +':' + AUTHORIZATION_SERVER_PORT +'/exit',
  GET_ACCOUNT_URL: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/account',
  map_position_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions/within',
  map_archives_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/within',
  positions_buy_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions/buy',
  store_invoice_detail_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices/{id}',
  store_invoices_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices',
  store_invoice_cancel_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices/{id}',
  position_delete_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions/delete',
  username_url:  'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/account/name',
  // GET_ACCOUNT_URL: ' ../../assets/account.json',
  user_topup_url: 'http://localhost:8080/topup',
  user_changepw_url: 'http://localhost:8080/change-password',
  archives_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives',
  position_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions',
  // archives_url: 'http://localhost:8081/archives',
  archives_upload_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/upload',
  archives_uploaded_url: 'http://localhost:8080/archives/upload', // GET
  // archives_upload_url: 'http://localhost:8080/archives/upload', // POST
  archives_download_url: 'http://localhost:8080/archives/download/{id}',
  archives_public_url: 'http://localhost:8080/archives/public/{id}',
  archives_delete_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/{id}',
  archives_search_url: 'http://localhost:8080/archives/search',
  // archives_buy_url: 'http://localhost:8080/archives/buy',
  archives_buy_url:  'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/buy',
 // store_invoices_url: 'http://localhost:8080/store/invoices',
 //
  // store_invoice_detail_url: 'http://localhost:8080/store/invoices/{id}',
  store_invoice_pay_url:  'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices/{id}/pay',

  // store_invoice_cancel_url: 'http://localhost:8080/store/invoices/{id}'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
