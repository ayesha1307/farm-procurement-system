package com.farm.system.controller;

import org.springframework.web.bind.annotation.*;
import com.farm.system.model.Inspection;
import com.farm.system.service.InspectionService;

@RestController
@RequestMapping("/api/inspection")
@CrossOrigin
public class InspectionController {

    private final InspectionService service;

    public InspectionController(InspectionService service) {
        this.service = service;
    }

    @PostMapping("/{produceId}/{grade}")
public Inspection inspect(@PathVariable Long produceId,
                          @PathVariable int grade) {
    return service.inspect(produceId, grade);
}
}