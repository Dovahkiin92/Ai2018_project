package com.Ai2018.ResourceServer.controllers;

import com.Ai2018.ResourceServer.models.Account;
import com.Ai2018.ResourceServer.models.Archive;
import com.Ai2018.ResourceServer.services.AccountService;
import com.Ai2018.ResourceServer.services.ArchiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountException;
import java.util.List;

@RestController
public class AdminController {

    @Autowired
    private ArchiveService archiveService;

    @Autowired
    private AccountService accountService;


 //   @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path="/admin/users", produces="application/json")
    public ResponseEntity<?> getUsers() {
        List<Account> users = accountService.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path="/admin/users/{username}", produces="application/json")
    public ResponseEntity<?> getUser(
            @PathVariable String username
    ) {
        try {
            Account user = accountService.findAccountByUsername(username);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.NOT_FOUND );
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path="/admin/users/{username}/archives", produces="application/json")
    public ResponseEntity<?> getPositions(
            @PathVariable String username
    ) {
        List<Archive> result = archiveService.findUserArchives(username);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PreAuthorize("hasAnyRole('ADMIN')")
    @RequestMapping(path="/admin/users/{username}/archives/delete", produces="application/json", method= RequestMethod.DELETE)
    public ResponseEntity<?> deleteUserArchives(
            @PathVariable String username
    ) {
        List<Archive> result = archiveService.deleteUserArchives(username);
        return new ResponseEntity<List<Archive>>(result, HttpStatus.OK);
    }



    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping(path="/admin/users/grant/{username}", produces="application/json")
    public ResponseEntity<?> grantRole(
            @PathVariable String username,
            @RequestBody List<String> roles) {
        try {
            Account account = accountService.findAccountByUsername(username);
            for(String role : roles){
                accountService.grantRole(account,role);
            }
            return new ResponseEntity<Object>(accountService.update(account), HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.NOT_FOUND );
        }
    }
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping(path="/admin/users/{username}/revoke", produces="application/json")
    public ResponseEntity<?> revokeRole(
            @PathVariable String username,
            @RequestBody List<String> roles) {
        try {
            Account account = accountService.findAccountByUsername(username);
            for(String role : roles){
                accountService.revokeRole(account,role);
            }
            return new ResponseEntity<Object>(accountService.update(account), HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.NOT_FOUND );
        }
    }
    }