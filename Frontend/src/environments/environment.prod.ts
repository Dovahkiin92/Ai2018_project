const RESOURCE_SERVER_HOST = '192.168.99.111';
const RESOURCE_SERVER_PORT = '8081';
const AUTHORIZATION_SERVER_HOST = '192.168.99.111';
const AUTHORIZATION_SERVER_PORT = '9000';
const CLIENT_ID = 'datamarketplace-app'
const REDIRECT = 'http://192.168.99.111:8000'
export const environment = {
  production: true,
  client_credentials: 'trusted-app:secret',
  register_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/register',
  authorization_code_url : 'http://'+AUTHORIZATION_SERVER_HOST +':' + AUTHORIZATION_SERVER_PORT +'/oauth/authorize',
  access_token_url : 'http://'+AUTHORIZATION_SERVER_HOST +':' + AUTHORIZATION_SERVER_PORT +'/oauth/token',
  logout_url : 'http://'+AUTHORIZATION_SERVER_HOST +':' + AUTHORIZATION_SERVER_PORT +'/exit?returnTo='+REDIRECT+'%2f',
  GET_ACCOUNT_URL: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/account',
  map_position_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions/within',
  map_archives_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/within',
  positions_buy_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions/buy',
  store_invoice_detail_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices/{id}',
  store_invoices_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices',
  store_invoice_cancel_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices/{id}',
  position_delete_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions/delete',
  username_url:  'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/account/name',
  archives_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives',
  position_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/positions',
  archives_upload_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/upload',
  archives_download_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/download/{id}',
  archives_delete_url: 'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/{id}',
  archives_buy_url:  'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/archives/buy',
  TOPUP_URL: 'http://'+ RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT +'/topup',
  store_invoice_pay_url:  'http://' + RESOURCE_SERVER_HOST + ':' + RESOURCE_SERVER_PORT + '/store/invoices/{id}/pay',
  CLIENT_ID,
  REDIRECT
  };
