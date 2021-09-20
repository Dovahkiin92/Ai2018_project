### ai2018 Lab 3

# OAUTH2 protocol to access resources
 Use of authorization code grant flow: 
 - Request code at `oauth/authorize/` [specify client id and response_type=code]
 - Authenticate and give permission to the AuthZ server
 - Use code grant to request access token at `oauth/token/` [authenticate with client_id and client_secret]
 - Use token to access REST API 
 
  
