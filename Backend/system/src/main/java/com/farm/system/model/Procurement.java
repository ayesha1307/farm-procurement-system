package com.farm.system.model;

import jakarta.persistence.*;

@Entity
public class Procurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;
    private double price;
    private double totalAmount;
    private String status;

    @ManyToOne
    @JoinColumn(name = "produce_id")
    private Produce produce;

    public Long getId() { return id; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Produce getProduce() { return produce; }
    public void setProduce(Produce produce) { this.produce = produce; }
}