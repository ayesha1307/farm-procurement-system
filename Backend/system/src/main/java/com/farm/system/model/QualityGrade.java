package com.farm.system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class QualityGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gradeName;
    private String description;

    private int minScore;
    private int maxScore;

    private LocalDateTime createdAt;

    public QualityGrade() {
        this.createdAt = LocalDateTime.now();
    }

    // ✅ GETTERS

    public Long getId() {
        return id;
    }

    public String getGradeName() {
        return gradeName;
    }

    public String getDescription() {
        return description;
    }

    public int getMinScore() {
        return minScore;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ✅ SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMinScore(int minScore) {
        this.minScore = minScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}