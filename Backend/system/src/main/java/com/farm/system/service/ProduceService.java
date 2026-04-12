package com.farm.system.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.farm.system.model.Produce;
import com.farm.system.repository.ProduceRepository;

@Service
public class ProduceService {

    private final ProduceRepository repo;

    public ProduceService(ProduceRepository repo) {
        this.repo = repo;
    }

    public Produce addProduce(Produce p) {
        p.setStatus("SUBMITTED");
        return repo.save(p);
    }

    public List<Produce> getAll() {
        return repo.findAll();
    }
}