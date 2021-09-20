package com.Ai2018.ResourceServer.models.requestModels;
import com.Ai2018.ResourceServer.models.Position;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;

import java.util.*;

public class MapArchiveRequest {

    private Position topRight;
    private Position bottomLeft;
    private Long from;
    private Long to;
//    private List<String> users;

    public MapArchiveRequest() {
     //   users = new ArrayList<String>();
    }

    public GeoJsonPolygon getRect() {
        // IT STARTS FROM BOTTOM LEFT
        /* Basically, we have a rectangle like this:
         *       A --------- B
         *       |           |
         *       C --------- D
         *  And this model only contains points A and D.
         *  A ( lon1, lat1 ), D ( lon2, lat2)
         *  Therefore, we can derive pointd B and C by crossing:
         *  C ( lon1, lat2 ) and B ( lon2, lat1 )
         * */
        GeoJsonPolygon result = new GeoJsonPolygon(
                //ToDO: This results in a WRONG rectangle which hinders results. check it
//                new GeoJsonPoint(lon1, lat1), // A
//                new GeoJsonPoint(lon2, lat1), // B
//                new GeoJsonPoint(lon2, lat2), // D
//                new GeoJsonPoint(lon1, lat2), // C
//                new GeoJsonPoint(lon1, lat1) // A - Again, need to close the loop or mongo will cry
                new GeoJsonPoint(topRight.getLongitude(), bottomLeft.getLatitude()), // C
                new GeoJsonPoint(bottomLeft.getLongitude(), bottomLeft.getLatitude()), // D
                new GeoJsonPoint(bottomLeft.getLongitude(), topRight.getLatitude()), // B
                new GeoJsonPoint(topRight.getLongitude(), topRight.getLatitude()), // A
                // Repeat first point again, need to close the loop or mongo will cry
                new GeoJsonPoint(topRight.getLongitude(), bottomLeft.getLatitude()) // C
                //new GeoJsonPoint(topLeft.getLongitude(), topLeft.getLatitude())
        );
        return result;
    }

//    public GeoJsonPoint getPoint1(){
//        return new GeoJsonPoint(lon1, lat1);
//    }
//
//    public GeoJsonPoint getPoint2(){
//        return new GeoJsonPoint(lon2, lat2);
//    }

//    public double getLat1() {
//        return lat1;
//    }
//
//    public void setLat1(double lat1) {
//        this.lat1 = lat1;
//    }
//
//    public double getLon1() {
//        return lon1;
//    }
//
//    public void setLon1(double lon1) {
//        this.lon1 = lon1;
//    }
//
//    public double getLat2() {
//        return lat2;
//    }
//
//    public void setLat2(double lat2) {
//        this.lat2 = lat2;
//    }
//
//    public double getLon2() {
//        return lon2;
//    }
//
//    public void setLon2(double lon2) {
//        this.lon2 = lon2;
//    }

    public Position getTopRight() {
        return topRight;
    }

    public void setTopRight(Position topRight) {
        this.topRight = topRight;
    }

    public Position getBottomLeft() {
        return bottomLeft;
    }

    public void setBottomLeft(Position bottomLeft) {
        this.bottomLeft = bottomLeft;
    }

    public Long getFrom() {
        return from;
    }

    public void setFrom(Long from) {
        this.from = from;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long to) {
        this.to = to;
    }
}