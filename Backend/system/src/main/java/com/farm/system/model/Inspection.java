package com.farm.system.model;

import jakarta.persistence.*;

@Entity
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;
    private String grade;

    @ManyToOne
    private Produce produce;

    public Inspection() {}

    public Long getId() { return id; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Produce getProduce() { return produce; }
    public void setProduce(Produce produce) { this.produce = produce; }
}