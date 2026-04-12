package com.farm.system.controller;

import com.farm.system.model.Procurement;
import com.farm.system.service.ProcurementService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/procurement")
@CrossOrigin
public class ProcurementController {

    private final ProcurementService procurementService;

    public ProcurementController(ProcurementService procurementService) {
        this.procurementService = procurementService;
    }

    @PostMapping("/{produceId}/{quantity}/{price}")
    public Procurement procure(
            @PathVariable Long produceId,
            @PathVariable int quantity,
            @PathVariable double price
    ) {
        return procurementService.procure(produceId, quantity, price);
    }

    @GetMapping
    public List<Procurement> getAll() {
        return procurementService.getAll();
    }

    @GetMapping("/test")
    public String test() {
        return "Procurement working";
    }
}