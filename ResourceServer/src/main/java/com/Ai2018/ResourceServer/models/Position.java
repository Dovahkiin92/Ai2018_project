package com.Ai2018.ResourceServer.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.sun.istack.NotNull;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;

import java.util.Date;
import java.util.Objects;

@JsonSerialize(using = PositionSerializer.class)

public class Position implements Comparable<Position> {

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint point;
    private long timestamp;
    private String userId;
    public Position(){}
    @JsonCreator
    public Position(
            @JsonProperty(value = "longitude", required = true) @NotNull double longitude,
            @JsonProperty(value = "latitude", required = true) @NotNull double latitude,
            @JsonProperty (value= "timestamp",required = true) @NotNull long timestamp,
            @JsonProperty (value= "userId") String userId

    ) throws Exception {
        this.userId = userId;
        this.timestamp = timestamp;
        this.point = new GeoJsonPoint(longitude, latitude); // X and Y
        if (!isValidTimestamp()) {
            throw new Exception("Invalid timestamp!");
        }
        if (!isValid()) {
            throw new Exception("Invalid position!");
        }
    }

    @JsonGetter("longitude")
    public double getLongitude(){
        return point.getX();
    }

    @JsonGetter("latitude")
    public double getLatitude(){
        return point.getY();
    }


    public GeoJsonPoint getPoint() {
        return point;
    }

    public void setPoint(GeoJsonPoint point) {
        this.point = point;
    }
    public long getTimestamp(){
        return this.timestamp;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    boolean isValid() {
        if (getLatitude() < -90 || getLatitude() > 90 || getLongitude() < -180 || getLongitude() > 180)
            return false;
        return true;
    }
    public boolean isValidTimestamp() {
        if(timestamp > new Date().getTime())
            return false;
        return true;
    }
    public boolean isGreaterTimestamp(Position that) {
        if(this.timestamp < that.getTimestamp())
            return false;
        return true;
    }
    public double getDistance(Position that) {
        final int R = 6371; // Radius of the earth
        double latDistance = Math.toRadians(that.getLatitude() - this.getLatitude());
        double lonDistance = Math.toRadians(that.getLongitude() - this.getLongitude());
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(this.getLatitude())) * Math.cos(Math.toRadians(that.getLatitude()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters
        return distance;
    }

    public double getSpeed(Position that){
        // Time between the two measurements in seconds (timestamps are unix epoch)
        long time = this.getTimestamp() - that.getTimestamp();
        if (time != 0){
            //Distance was multiplied by 1000, we don't want that.
            // We measure speed in meters per second m/s.
            return (this.getDistance(that))/time;
        }
        return 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Position)) return false;
        Position that = (Position) o;
        return Objects.equals(getPoint(), that.getPoint());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPoint());
    }

    @Override
    public int compareTo(Position that) {
        if (this.getLongitude() > that.getLongitude()) {
            return 1;
        } else if (getLongitude() < that.getLongitude()) {
            return -1;
        } else {
            if(getLatitude() > that.getLatitude()) {
                return 1;
            } else if (getLatitude() < that.getLatitude()) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    public String getUserId() {
        return this.userId;
    }
}