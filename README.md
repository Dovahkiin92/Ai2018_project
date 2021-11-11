# Applicazioni Internet Project

This project is based on Spring boot and MongoDB.

### Running:
- Generate jar files with `mvn package`
- Build docker images with `docker-compose build`
- Start containers with  `docker-compose up` (--detached)
### Modules:

## Authorization Server
The purpose of this Server is to issue tokens to authorize access to the API
Based on OAUTH2 code flow to authenticate or register users.
Exposed on port `9000`

## Resource Server
Application API, exposed on port `8081`

## Frontend
Angular web application, exposed on port `8000`


  
