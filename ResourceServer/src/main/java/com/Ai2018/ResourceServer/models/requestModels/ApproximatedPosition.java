package com.Ai2018.ResourceServer.models.requestModels;

import com.Ai2018.ResourceServer.models.Position;
import com.Ai2018.ResourceServer.models.PositionSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import java.util.Objects;

@JsonSerialize(using = APositionSerializer.class)
public class ApproximatedPosition {
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint point;
    private String userId;
    public ApproximatedPosition(){}

    public double getLongitude(){
        return point.getX();
    }
    public double getLatitude(){
        return point.getY();
    }
    public GeoJsonPoint getPoint() {
        return point;
    }
    public void setPoint(GeoJsonPoint point) {
        this.point = point;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserId() {
        return this.userId;
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
}
