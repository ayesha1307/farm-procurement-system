package com.farm.system.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.farm.system.model.Produce;
import com.farm.system.service.ProduceService;

@RestController
@RequestMapping("/api/produce")
@CrossOrigin
public class ProduceController {

    private final ProduceService service;

    public ProduceController(ProduceService service) {
        this.service = service;
    }

    @PostMapping
    public Produce add(@RequestBody Produce p) {
        return service.addProduce(p);
    }

    @GetMapping
    public List<Produce> getAll() {
        return service.getAll();
    }
}