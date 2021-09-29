package com.Ai2018.ResourceServer.controllers;

import com.Ai2018.ResourceServer.models.Account;
import com.Ai2018.ResourceServer.models.requestModels.AccountRegistration;
import com.Ai2018.ResourceServer.services.AccountService;
import com.fasterxml.jackson.databind.JsonSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;
    @GetMapping(path = "/account", produces = "application/json" )
    public ResponseEntity<Object> account(@AuthenticationPrincipal String username) {
        Account a;
        try {
           a = accountService.findAccountByUsername(username);
           return new ResponseEntity<>(a,HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping(path = "/register", produces = "application/json")
    public ResponseEntity<?> register(@RequestBody AccountRegistration ar) {
        try {
            return new ResponseEntity<Object>(accountService.register(ar), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(new Error(e.getMessage()),HttpStatus.BAD_REQUEST );
        }
    }
/*
    @PostMapping(path = "/api/register-admin", produces = "application/json")
    public ResponseEntity<?> registerAdmin(@RequestBody Account account) {
        try {
            if(accountService.existsAccountByRole("ADMIN")){
                return new ResponseEntity<Object>(new RestErrorResponse("AN_ADMIN_ALREADY_EXISTS"),HttpStatus.BAD_REQUEST );
            }
            account.grantAuthority("ROLE_ADMIN");
            account.grantAuthority("ROLE_USER");
            account.grantAuthority("ROLE_CUSTOMER");
            return new ResponseEntity<Object>(accountService.register(account), HttpStatus.OK);
        } catch (AccountException e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(new RestErrorResponse(e.getMessage()),HttpStatus.BAD_REQUEST );
        }
    }*/

}
