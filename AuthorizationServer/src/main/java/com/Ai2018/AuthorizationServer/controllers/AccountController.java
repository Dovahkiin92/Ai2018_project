package com.Ai2018.AuthorizationServer.controllers;


import com.Ai2018.AuthorizationServer.models.Account;
import com.Ai2018.AuthorizationServer.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping(path = "/me", produces = "application/json" )
    public Account me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return accountService.loadUserByUsername(username);
    }

    /*@PostMapping(path = "/api/register", produces = "application/json")
    public ResponseEntity<?> register(@RequestBody Account account) {
        try {
            account.grantAuthority("ROLE_USER");
            account.grantAuthority("ROLE_CUSTOMER");
            return new ResponseEntity<Object>(accountService.register(account), HttpStatus.OK);
        } catch (AccountException e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(new RestErrorResponse(e.getMessage()),HttpStatus.BAD_REQUEST );
        }
    }

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
