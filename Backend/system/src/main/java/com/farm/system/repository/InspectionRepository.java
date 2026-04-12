package com.farm.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farm.system.model.Inspection;

public interface InspectionRepository extends JpaRepository<Inspection, Long> {
}