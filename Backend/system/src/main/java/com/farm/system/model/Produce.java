package com.farm.system.model;

import jakarta.persistence.*;

@Entity
public class Produce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int stock;
    private String inventoryStatus;
    private String name;
    private String category;
    private int quantity;
    private String status;

    @ManyToOne
    private User farmer;

    public Produce() {}

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }

    public int getStock() {
    return stock;
}

public void setStock(int stock) {
    this.stock = stock;
}

public String getInventoryStatus() {
    return inventoryStatus;
}

public void setInventoryStatus(String inventoryStatus) {
    this.inventoryStatus = inventoryStatus;
}
}