package com.farm.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farm.system.model.QualityGrade;

public interface QualityGradeRepository extends JpaRepository<QualityGrade, Long> {
}