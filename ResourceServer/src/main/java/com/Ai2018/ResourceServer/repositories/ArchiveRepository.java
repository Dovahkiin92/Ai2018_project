package com.Ai2018.ResourceServer.repositories;

import com.Ai2018.ResourceServer.models.Archive;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArchiveRepository extends MongoRepository<Archive, String> {

    List<Archive> findAllByUserIdEqualsAndDeletedFalse(String userId);
    List<Archive> findAllByPositions_pointWithinAndPositions_timestampBetweenAndDeletedFalse(GeoJsonPolygon polygon, long start, long end);
    List<Archive> findAllByPositions_pointWithin(GeoJsonPolygon polygon);
    List<Archive> findAllByPositions_timestampBetween(Long from, Long to);
    Optional<Archive> findById(String archiveId);
    Archive save(Archive archive);
    List<Archive> deleteAllByUserId(String username);
    List<Archive> findAllByIdIn(List<String> ids);
    List<Archive> findAllByIdInAndDeletedFalse(List<String> ids);

}
