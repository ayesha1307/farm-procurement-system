package com.farm.system.service;

import org.springframework.stereotype.Service;

@Service
public class QualityGradeService {

    public String getGradeByScore(int score) {

        if (score >= 85 && score <= 100) {
            return "A";
        } else if (score >= 60 && score <= 84) {
            return "B";
        } else {
            return "C";
        }
    }
}