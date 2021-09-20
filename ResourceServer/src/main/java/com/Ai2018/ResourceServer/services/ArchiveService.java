package com.Ai2018.ResourceServer.services;

import com.Ai2018.ResourceServer.models.Archive;
import com.Ai2018.ResourceServer.models.Invoice;
import com.Ai2018.ResourceServer.models.Position;
import com.Ai2018.ResourceServer.models.requestModels.ApproximatedArchive;
import com.Ai2018.ResourceServer.models.requestModels.ApproximatedPosition;
import com.Ai2018.ResourceServer.models.requestModels.ApproximatedTimePosition;
import com.Ai2018.ResourceServer.repositories.ArchiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ArchiveService {
    private static final double PRICE_PER_POSITION = 1.0 ;
    public int MAXIMUM_SPEED =100;
    @Autowired
    ArchiveRepository archiveRepository;
    @Autowired
    private AccountService accountService;
    @Autowired
    private StoreService storeService;

    @Transactional
    public Archive createArchive(String userId, ArrayList<Position> positions) {
      //  positionRepository.checkPositions(positions); // Will throw if any position is not valid.
        Archive a = new Archive();
        a.setUserId(userId);
        a.setPrice(positions.size() * PRICE_PER_POSITION);
        positions.forEach(p->p.setUserId(userId));
        a.setPositions(positions);
        archiveRepository.save(a);
        return a;
    }

    public List<Archive> findOwnedArchives(String username) {
        List<Archive> archives;
        archives = archiveRepository.findAllByUserIdEqualsAndDeletedFalse(username);
        List<Invoice> invoices =  storeService.getInvoices(username);
        if(archives!= null && invoices!= null && invoices.size()>0)
        archives.addAll( invoices.stream()
                        .map(Invoice::getItems)
                        .flatMap(List::stream)
                        .map(aid -> archiveRepository.findById(aid))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList())
        );
        return archives;
    }

    public List<Position> findOwnedPositions(String username) {
        List<Archive> archives = archiveRepository.findAllByUserIdEqualsAndDeletedFalse(username);
        return archives.stream().map(Archive::getPositions).flatMap(List::stream).collect(Collectors.toList());
    }

    public List<Archive> findUserArchives(String username) {
        return archiveRepository.findAllByUserIdEqualsAndDeletedFalse(username);
    }

    public List<Archive> deleteUserArchives(String username) {
        return archiveRepository.deleteAllByUserId(username);
    }


    public List<Archive> getArchivesWithinPolygon(GeoJsonPolygon polygon) {
        return archiveRepository.findAllByPositions_pointWithin(polygon);
    }

    public List<ApproximatedArchive> getApproximatedArchivesWithinPolygon(GeoJsonPolygon polygon) {
        return archiveRepository.findAllByPositions_pointWithin(polygon).stream()
                .map(ArchiveService::approximate)
                .collect(Collectors.toList());
    }
    public List<Archive> getArchivesInTimeRange(Long from, Long to) {
        return archiveRepository.findAllByPositions_timestampBetween(from, to);
    }
    public List<ApproximatedArchive> getApproximatedArchivesInTimeRange(Long from, Long to) {
        return archiveRepository.findAllByPositions_timestampBetween(from, to).stream()
                .map(ArchiveService::approximate)
                .collect(Collectors.toList());
    }
    public List<Archive> getArchives(List<String> archiveIds) {
        return archiveRepository.findAllByIdInAndDeletedFalse(archiveIds);
    }

    public static  ApproximatedArchive approximate(Archive a) {
            ApproximatedArchive approx = new ApproximatedArchive();
            approx.setId(a.getId());
            approx.setUserId(a.getUserId());
            approx.setPrice(a.getPrice());

            approx.setApproxPositions(
                    a.getPositions().stream()
                            .map(p -> {
                                ApproximatedPosition newpos = new ApproximatedPosition();
                                newpos.setPoint(new GeoJsonPoint(
                                        Math.floor(p.getLongitude()*100)/100,
                                        Math.floor(p.getLatitude()*100)/100)
                                );
                                newpos.setUserId(p.getUserId());
                                return newpos;
                            }).collect(Collectors.toSet()));

            approx.setApproxTimestamps( a.getPositions().stream()
                    .map(p -> {
                        ApproximatedTimePosition ap = new ApproximatedTimePosition();
                        ap.setTimestamp(Math.round(p.getTimestamp()*1.0/60));
                        ap.setUserId(p.getUserId());

                        return ap;
                    })
                    .collect(Collectors.toSet())
            );
            return approx;
    }

    public List<Archive> getArchivesWithinPolygonAndTime(GeoJsonPolygon polygon, Long from, Long to) {
        return archiveRepository.findAllByPositions_pointWithinAndPositions_timestampBetweenAndDeletedFalse(polygon,from,to);
    }

    public void setDeleted(String username, String archiveId) throws Exception {
        Optional<Archive> a = archiveRepository.findById(archiveId);

        if(a.isPresent() && a.get().getUserId().equals( username)){ // owner, archive must be marked as deleted
            a.get().setDeleted(true);
            archiveRepository.save(a.get());
        } else if(a.isPresent()){
            try { // remove  from purchased archives list if present
                accountService.findAccountByUsername(username).removeArchive(archiveId);
            }catch (Exception e){
                throw new Exception(e.getMessage());
            }
        }
    }
}
