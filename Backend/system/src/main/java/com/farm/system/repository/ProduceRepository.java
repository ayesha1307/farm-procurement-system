package com.farm.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farm.system.model.Produce;

public interface ProduceRepository extends JpaRepository<Produce, Long> {
}