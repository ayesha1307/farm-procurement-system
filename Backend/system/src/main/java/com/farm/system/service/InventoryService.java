package com.farm.system.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.farm.system.model.ProduceInventory;
import com.farm.system.repository.ProduceInventoryRepository;

@Service
public class InventoryService {

    private final ProduceInventoryRepository repo;

    public InventoryService(ProduceInventoryRepository repo) {
        this.repo = repo;
    }

    public ProduceInventory save(ProduceInventory inv) {
        return repo.save(inv);
    }

    public List<ProduceInventory> getAll() {
        return repo.findAll();
    }

    public String getStatus(int stock) {

        if (stock > 50) {
            return "AVAILABLE";
        } else if (stock >= 10) {
            return "LOW_STOCK";
        } else {
            return "OUT_OF_STOCK";
        }
    }
}