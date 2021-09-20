package com.Ai2018.ResourceServer.controllers;

import com.Ai2018.ResourceServer.models.Archive;
import com.Ai2018.ResourceServer.models.requestModels.ApproximatedArchive;
import com.Ai2018.ResourceServer.models.requestModels.MapArchiveRequest;
import com.Ai2018.ResourceServer.services.ArchiveService;
import com.Ai2018.ResourceServer.services.PositionService;
import com.Ai2018.ResourceServer.services.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ApproximatedArchiveController {
    @Autowired
    private ArchiveService archiveService;
    @Autowired
    private PositionService positionService;
    @Autowired
    private StoreService storeService;

    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping(path="/archives/within", produces="application/json")
    public ResponseEntity<?> showArchivesIn(
            @RequestBody MapArchiveRequest req
    )//Authentication authentication)
    {
        List<ApproximatedArchive> app;
        List<Archive> archives;
        try {
            // get archives visible in map, in time interval
            archives = archiveService.getArchivesWithinPolygonAndTime(positionService.buildRect(req.getTopRight(),req.getBottomLeft()),req.getFrom(),req.getTo());
            app =  archives.stream().map(ArchiveService::approximate).collect(Collectors.toList());
        }
        catch (Exception e){
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(app, HttpStatus.OK);
    }
}