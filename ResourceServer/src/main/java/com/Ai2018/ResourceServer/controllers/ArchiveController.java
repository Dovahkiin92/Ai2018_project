package com.Ai2018.ResourceServer.controllers;

import com.Ai2018.ResourceServer.models.Archive;
import com.Ai2018.ResourceServer.models.Invoice;
import com.Ai2018.ResourceServer.models.Position;
import com.Ai2018.ResourceServer.services.ArchiveService;
import com.Ai2018.ResourceServer.services.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ArchiveController {
    @Autowired
    private ArchiveService archiveService;
    @Autowired
    private StoreService storeService;


    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping(path="/archives/upload", produces="application/json")
    public ResponseEntity<?> uploadArchive(
            @RequestBody ArrayList<Position> positions,
             @AuthenticationPrincipal String username
    ) {
        try {
            Archive a = archiveService.createArchive(username, positions);
            return new ResponseEntity<Object>(a, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAnyRole('USER')")
    @GetMapping(path="/archives", produces="application/json")
    public ResponseEntity<?> purchasedArchives(@AuthenticationPrincipal String username)
    {
        List<Archive> archives;
        try {
            archives = archiveService.findOwnedArchives(username);
            return new ResponseEntity<>(archives, HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        }
    }
    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping(path="/archives/buy", produces="application/json")
    public ResponseEntity<?> buyAvailableArchives(
            @RequestBody List<String> archiveIds,
            @AuthenticationPrincipal String username
    ) {
        try{
        List<String> archive_ids = archiveService.getAvailableArchives(archiveIds, username)
                .stream()
                .map(Archive::getId)
                .collect(Collectors.toList());
        if (archive_ids.size() > 0 ) {
            Invoice invoice = storeService.createInvoice(username, archive_ids);
            return new ResponseEntity<>(invoice, HttpStatus.OK);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // TODO error mgmt
        }
    }
    @PreAuthorize("hasAnyRole('USER')")
    @RequestMapping(path="/archives/{archiveId}", produces="application/json", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(
            @PathVariable String archiveId,
            @AuthenticationPrincipal String username
    ) {
        try {
            archiveService.setDeleted(username, archiveId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<Object>(new Exception(e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

}
