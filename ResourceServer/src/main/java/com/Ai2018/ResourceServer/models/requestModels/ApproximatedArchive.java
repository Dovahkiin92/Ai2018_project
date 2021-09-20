package com.Ai2018.ResourceServer.models.requestModels;

import java.util.Set;

public class ApproximatedArchive {
    private String id;
    private Set<ApproximatedPosition> approxPositions;
    private Set<ApproximatedTimePosition> approxTimestamps;
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

    public Set<ApproximatedTimePosition> getApproxTimestamps() {
        return approxTimestamps;
    }

    public void setApproxTimestamps(Set<ApproximatedTimePosition> approxTimestamps) {
        this.approxTimestamps = approxTimestamps;
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
