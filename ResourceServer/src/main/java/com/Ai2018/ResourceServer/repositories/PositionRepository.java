package com.Ai2018.ResourceServer.repositories;

import com.Ai2018.ResourceServer.models.Position;
import com.mongodb.client.model.geojson.Polygon;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PositionRepository extends MongoRepository<Position,String> {

    List<Position> findAllByUserIdEqualsAndTimestampBetween(String userId,long start, long end);
    List<Position> findAllByUserIdEqualsAndTimestampBefore(String userId,long end);
    List<Position> findAllByUserIdEqualsAndTimestampAfter(String userId,long start);
    List<Position> findAllByUserIdEqualsAndPointWithinAndTimestampBetween(String userId, GeoJsonPolygon polygon, long start, long end);
    List<Position> findAllByPointWithinAndTimestampBetween(GeoJsonPolygon polygon, long start, long end);
}
