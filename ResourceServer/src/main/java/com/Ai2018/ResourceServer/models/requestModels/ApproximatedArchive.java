package com.Ai2018.ResourceServer.models.requestModels;

import com.Ai2018.ResourceServer.models.Archive;
import com.Ai2018.ResourceServer.models.Position;

import java.util.List;
import java.util.Set;

public class ApproximatedArchive {
    private String id;
    private Set<ApproximatedPosition> approxPositions;
    private Set<ApproximatedTimePosition> approxTimestamp;
    private String userId;
    private double price;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<ApproximatedPosition> getApproxPositions() {
        return approxPositions;
    }

    public void setApproxPositions(Set<ApproximatedPosition> approxPositions) {
        this.approxPositions = approxPositions;
    }

    public Set<ApproximatedTimePosition> getApproxTimestamp() {
        return approxTimestamp;
    }

    public void setApproxTimestamp(Set<ApproximatedTimePosition> approxTimestamp) {
        this.approxTimestamp = approxTimestamp;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

}
