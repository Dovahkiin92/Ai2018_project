package com.Ai2018.ResourceServer.services;

import com.Ai2018.ResourceServer.models.Archive;
import com.Ai2018.ResourceServer.models.Position;
import com.Ai2018.ResourceServer.repositories.ArchiveRepository;
import com.Ai2018.ResourceServer.repositories.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PositionService {
    public int MAXIMUM_SPEED =100;
    @Autowired
    PositionRepository positionRepository;

    public List<Position> getPositionInTime(String userId, Optional<Long> start, Optional<Long> end){
        List<Position> positions;
        if(start.isPresent() && end.isPresent())
            positions= positionRepository.findAllByUserIdEqualsAndTimestampBetween(userId,start.get(),end.get());
        else if(end.isPresent())
            positions =positionRepository.findAllByUserIdEqualsAndTimestampBefore(userId,end.get());
        else
            positions = positionRepository.findAllByUserIdEqualsAndTimestampAfter(userId,start.get());
        return positions;
    }

    public List<Position> getPositionWithinPolygon(String userId, GeoJsonPolygon area, Long from, Long to) throws Exception{
             if(to != null && to > new Date().getTime())
                throw new Exception("Cannot purchase future archives!");
        return positionRepository.findAllByUserIdEqualsAndPointWithinAndTimestampBetween( userId,area, from, to);
        }
    public List<Position> getPositionWithinPolygon( GeoJsonPolygon area, Long from, Long to) throws Exception{
        if(to != null && to > new Date().getTime())
            throw new Exception("Cannot purchase future archives!");
        return positionRepository.findAllByPointWithinAndTimestampBetween( area, from, to);
    }

    public void checkPositions(List<Position> positions) throws Exception{
        Position previous = positions.get(0);
        for(Position p: positions.subList(1,positions.size())){
            System.out.println("Checking constraints between:"+previous+" "+p);
            if(!p.isValidTimestamp())  throw new Exception("Invalid Timestamp");
            if(!p.isGreaterTimestamp(previous)) throw new Exception("Invalid Sequence");
         if(p.getSpeed(previous)>=MAXIMUM_SPEED) throw new Exception("Invalid Sequence");
            System.out.println("Speed: "+p.getSpeed(previous));

        }
    }


    public GeoJsonPolygon buildRect(Position topLeft, Position bottomRight) {
        GeoJsonPolygon result = new GeoJsonPolygon(
                new GeoJsonPoint(topLeft.getLongitude(), bottomRight.getLatitude()), // C
                new GeoJsonPoint(bottomRight.getLongitude(), bottomRight.getLatitude()), // D
                new GeoJsonPoint(bottomRight.getLongitude(), topLeft.getLatitude()), // B
                new GeoJsonPoint(topLeft.getLongitude(), topLeft.getLatitude()), // A
                new GeoJsonPoint(topLeft.getLongitude(), bottomRight.getLatitude()) // C
        );
        return result;
    }
}
