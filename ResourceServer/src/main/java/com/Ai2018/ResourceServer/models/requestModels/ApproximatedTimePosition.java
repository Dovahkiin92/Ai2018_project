package com.Ai2018.ResourceServer.models.requestModels;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = ATPositionSerializer.class)
public class ApproximatedTimePosition {
    private long timestamp;
    private String userId;
    public ApproximatedTimePosition(){}

    public long getTimestamp(){
        return this.timestamp;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserId() { return this.userId;}

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}


