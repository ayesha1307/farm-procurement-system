package com.farm.system.service;

import org.springframework.stereotype.Service;
import com.farm.system.model.Inspection;
import com.farm.system.model.Produce;
import com.farm.system.repository.InspectionRepository;
import com.farm.system.repository.ProduceRepository;

@Service
public class InspectionService {

    private final InspectionRepository inspectionRepository;
    private final ProduceRepository produceRepository;
    private final QualityGradeService qualityGradeService;

    public InspectionService(InspectionRepository inspectionRepository,
                             ProduceRepository produceRepository,
                             QualityGradeService qualityGradeService) {
        this.inspectionRepository = inspectionRepository;
        this.produceRepository = produceRepository;
        this.qualityGradeService = qualityGradeService;
    }
<<<<<<< HEAD
=======

>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32
    public Inspection inspect(Long produceId, int score) {

        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new RuntimeException("Produce NOT FOUND"));

<<<<<<< HEAD
       
        if (score >= 80) {
            produce.setStatus("APPROVED");
        } else {
            produce.setStatus("REJECTED");
        }
        produceRepository.save(produce); 
        Inspection inspection = new Inspection();
        inspection.setProduce(produce);
        inspection.setScore(score);

=======
        Inspection inspection = new Inspection();

        inspection.setProduce(produce);
        inspection.setScore(score);

        // 🔥 AUTO GRADE ASSIGN
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32
        String grade = qualityGradeService.getGradeByScore(score);
        inspection.setGrade(grade);

        return inspectionRepository.save(inspection);
    }
}