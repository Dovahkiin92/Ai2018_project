package com.Ai2018.ResourceServer.controllers;

import com.Ai2018.ResourceServer.models.requestModels.ApproximatedArchive;
import com.Ai2018.ResourceServer.models.requestModels.ApproximatedPosition;
import com.Ai2018.ResourceServer.models.requestModels.ApproximatedTimePosition;
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
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class PositionController {
    @Autowired
    ArchiveService archiveService;
    @Autowired
    PositionService positionService;
    @Autowired
     StoreService storeService;


    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping(path="/positions/within", produces="application/json")
    public ResponseEntity<?> showPositionsIn(
            @RequestBody MapArchiveRequest req)
    {
       List<ApproximatedPosition> positions ;
       List<ApproximatedArchive> archives;
       try {
       archives = archiveService.getApproximatedArchivesWithinPolygon(positionService.buildRect(req.getTopRight(), req.getBottomLeft()));

       positions = archives.stream()
               .map(ApproximatedArchive::getApproxPositions)
               .flatMap(Set::stream)
               .collect(Collectors.toList());
           return new ResponseEntity<>(positions, HttpStatus.OK);
       }
       catch (Exception e){
           return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.BAD_REQUEST);
       }
    }
    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping(path="/positions/time", produces="application/json")
    public ResponseEntity<?> showPositionsInTime(
            @RequestBody MapArchiveRequest req)
    {
        List<ApproximatedTimePosition> positions ;
        List<ApproximatedArchive> archives;
        try {
            archives = archiveService.getApproximatedArchivesInTimeRange(req.getFrom(), req.getTo());
            positions = archives.stream()
                    .map(ApproximatedArchive::getApproxTimestamps)
                    .flatMap(Set::stream)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(positions, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<Object>(new Error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
