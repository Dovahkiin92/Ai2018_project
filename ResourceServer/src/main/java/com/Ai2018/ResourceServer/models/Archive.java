package com.Ai2018.ResourceServer.models;
/*
    Positions are uploaded to the server grouped in archives,
     seen as minimum unit of exchange
*/


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection="archives")
public class Archive {
    @Id
    private String id;
    private List<Position>  positions;
    private String userId;
    private double price;
    private int purchases;
    private boolean deleted;
    public Archive(){
        this.purchases = 0;
        this.deleted = false;
    }
    public void setPrice(double price) {this.price = price;}

    public int getPurchases() { return purchases;}
    public Archive setPurchases(int i) { this.purchases = i; return this; }
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public List<Position> getPositions() {
        return positions;
    }

    public void setPositions(List<Position> positions) {
        this.positions = positions;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getPrice() {
        return this.price;
    }
    public String getId() {return this.id;}
    public void addPurchases(int purchases) {
        this.purchases+=purchases;
    }
}
