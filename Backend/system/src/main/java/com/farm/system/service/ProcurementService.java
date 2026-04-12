package com.farm.system.service;

import com.farm.system.model.Procurement;
import com.farm.system.model.Produce;
import com.farm.system.repository.ProcurementRepository;
import com.farm.system.repository.ProduceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProcurementService {

    private final ProcurementRepository procurementRepository;
    private final ProduceRepository produceRepository;
    private final InventoryService inventoryService; // ✅ ADD HERE

    // ✅ FIXED CONSTRUCTOR
    public ProcurementService(ProcurementRepository procurementRepository,
                              ProduceRepository produceRepository,
                              InventoryService inventoryService) {
        this.procurementRepository = procurementRepository;
        this.produceRepository = produceRepository;
        this.inventoryService = inventoryService;
    }

    public Procurement procure(Long produceId, int quantity, double price) {

    Produce produce = produceRepository.findById(produceId)
            .orElseThrow(() -> new RuntimeException("Produce NOT FOUND"));

    if (!produce.getStatus().equals("APPROVED")) {
        throw new RuntimeException("Produce is not APPROVED for procurement");
    }

    Procurement procurement = new Procurement();
    procurement.setProduce(produce);
    procurement.setQuantity(quantity);
    procurement.setPrice(price);

    double total = quantity * price;
    procurement.setTotalAmount(total);

    if (total >= 1000) {
        procurement.setStatus("APPROVED");
    } else {
        procurement.setStatus("PENDING");
    }
    int newStock = produce.getStock() + quantity;
    produce.setStock(newStock);

    String status = inventoryService.getStatus(newStock);
    produce.setInventoryStatus(status);

    produceRepository.save(produce);

    return procurementRepository.save(procurement);
}

    public List<Procurement> getAll() {
        return procurementRepository.findAll();
    }
}