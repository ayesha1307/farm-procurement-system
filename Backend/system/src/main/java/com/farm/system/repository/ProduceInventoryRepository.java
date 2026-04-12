package com.farm.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farm.system.model.ProduceInventory;

import java.util.Optional;

public interface ProduceInventoryRepository extends JpaRepository<ProduceInventory, Long> {

    Optional<ProduceInventory> findByProduceCategory(String produceCategory);
}