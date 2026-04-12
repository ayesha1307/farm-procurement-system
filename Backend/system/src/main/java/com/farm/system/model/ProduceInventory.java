package com.farm.system.model;

import jakarta.persistence.*;

@Entity
public class ProduceInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String produceCategory;
    private int availableQuantity;

    private String inventoryStatus; // AVAILABLE, LOW_STOCK, OUT_OF_STOCK

    // GETTERS

    public Long getId() {
        return id;
    }

    public String getProduceCategory() {
        return produceCategory;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public String getInventoryStatus() {
        return inventoryStatus;
    }

    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setProduceCategory(String produceCategory) {
        this.produceCategory = produceCategory;
    }

    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public void setInventoryStatus(String inventoryStatus) {
        this.inventoryStatus = inventoryStatus;
    }
}