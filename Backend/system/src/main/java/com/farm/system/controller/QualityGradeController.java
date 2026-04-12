package com.farm.system.controller;

import org.springframework.web.bind.annotation.*;
import com.farm.system.service.QualityGradeService;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin
public class QualityGradeController {

    private final QualityGradeService service;

    public QualityGradeController(QualityGradeService service) {
        this.service = service;
    }

    // 🎓 Get grade based on score
    @GetMapping("/{score}")
    public String getGrade(@PathVariable int score) {
        return service.getGradeByScore(score);
    }
}