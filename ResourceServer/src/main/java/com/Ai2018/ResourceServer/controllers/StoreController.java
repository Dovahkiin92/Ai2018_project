package com.Ai2018.ResourceServer.controllers;

import com.Ai2018.ResourceServer.models.Account;
import com.Ai2018.ResourceServer.models.Invoice;
import com.Ai2018.ResourceServer.services.AccountService;
import com.Ai2018.ResourceServer.services.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StoreController {

    @Autowired
    private StoreService storeService;
    @Autowired
    private AccountService accountService;

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    @GetMapping(path="/store/invoices", produces="application/json")
    public ResponseEntity<?> showInvoices(
            @AuthenticationPrincipal String username
    ) {
        List<Invoice> invoices = storeService.getInvoices(username);
        return new ResponseEntity<>(invoices, HttpStatus.OK);
    }

    /*
     * Each invoice shall be paid individually,
     * the client sends a request for each invoice.
     * Once the invoice is paid, the archive is accessible through the Archives API
     * */
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER')")
    @PostMapping(path="/store/invoices/{invoiceId}/pay", produces="application/json")
    public ResponseEntity<?> payInvoice(
            @PathVariable String invoiceId,
            @AuthenticationPrincipal String username
    ) {
        try {
            Invoice invoice = storeService.payInvoice(username, invoiceId);
            if(invoice.getPaid()) {
               storeService.buyArchives(username,invoice);
            }
            return new ResponseEntity<Invoice>(invoice, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<Object>( HttpStatus.FORBIDDEN);
        }
    }

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    @GetMapping(path="/store/invoices/{invoiceId}", produces="application/json")
    public ResponseEntity<?> getInvoice(
            @PathVariable String invoiceId,
            @AuthenticationPrincipal String username) {
        try {
            Invoice invoice = storeService.getInvoice(username, invoiceId);
            return new ResponseEntity<Invoice>(invoice, HttpStatus.OK);
        }
        catch(Exception  e){
            return new ResponseEntity<Object>((e.getMessage()), HttpStatus.OK);
        }
    }

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    @DeleteMapping(path="/store/invoices/{invoiceId}", produces="application/json")
    public ResponseEntity<?> deleteInvoice(
            @PathVariable String invoiceId,
            @AuthenticationPrincipal String username
    ) {
        try {
            Boolean result = storeService.cancelInvoice(username, invoiceId);
            return new ResponseEntity<>( result ? HttpStatus.OK : HttpStatus.NOT_MODIFIED);
        }
        catch(Exception e){
            return new ResponseEntity<Object>((e.getMessage()), HttpStatus.OK);
        }
    }
}
