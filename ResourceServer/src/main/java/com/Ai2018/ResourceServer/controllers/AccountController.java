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
    @PostMapping(path = "/topup", produces = "application/json")
    public ResponseEntity<?> topUp(@RequestBody Double amount,@AuthenticationPrincipal String username) {
        try {
            Account acc = accountService.topUpTokens(username, amount);
            return new ResponseEntity<Object>(acc, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<Object>(new Error("Account not found"), HttpStatus.NOT_FOUND);
        }
    }

}
