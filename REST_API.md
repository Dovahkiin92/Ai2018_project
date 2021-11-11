# REST API
The REST API is exposed on port 8081.
Authentication is based on OAUTH2 protocol, using JWT tokens.

To access all resources an Access Token must be provided.

## User endpoints
- ### Current user profile
`GET` on `/account` to get information about current user.

- ### User registration
`POST` on `/register` 

with request body:
```
{ 
    "username": "your-username", 
    "password": "your-password" 
}
```
- ### Top Up tokens
`POST` on `/topup` double value.

Fictional endpoint for transactions.

---
## Archive Endpoints

- ### Archives summary
`GET` on `/archives`

Get a summary of all of the user-owned archives (both uploaded and purchased)

- ### Upload an archive
`POST` on `/archives/upload` 

Upload a new archive, request body must be a list of Positions :

```
[
    [...]
    {
     "latitude": 38.12233, 
     "longitude":15.65334, 
     "timestamp":1592324706,
     "userId": "fakeuser"
     }
]
```
- ### Delete an uploaded archive
`DELETE` on `/archives/{archiveId}` 
Mark the specified archive as deleted, so that it is not available for further purchases.

- ### Archive buy
`POST` on `/archives/buy` , list of archiveIds

Generate an invoice with available archives in archiveIds

- ### Archive search
`POST` on `/archives/within`
 top-left and bottom-right corners of the map
```
{
    "topRight": { "longitude" : 38.12386, "latitude" : 15.65228, "user": "fake" },
    "bottomLeft": {"longitude" : 38.12154, "latitude" : 15.65676, "user": "fake" },
    "from": null,
    "to": null
}
```
gets all the archives within map in the specific time range.
[!] This archives are approximated

---
## Store endpoints
- ### Invoices summary
`GET` on `/store/invoices` 

List all of user's invoices.

- ### Invoice details
`GET` on `/store/invoices/{invoiceId}` 

Details of a specific invoice.

- ### Pay invoice
`POST` on `/store/invoices/{invoiceId}/pay` 

Pay a specific invoice. Invoices are paid individually to give the user a second chance to review his purchase.





