package com.jobtracker.controller;

import com.jobtracker.model.JobApplication;
import com.jobtracker.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:3000"})
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository repo;

    @GetMapping
    public List<JobApplication> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public JobApplication create(@RequestBody JobApplication job) {
        if (job.getDeadline() == null) {
            job.setDeadline(java.time.LocalDate.now());
        }
        return repo.save(job);
    }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable("id") Long id, @RequestBody JobApplication job) {
        System.out.println("🔄 Updating job ID: " + id);
        job.setId(id);
        return repo.save(job);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk-upload")
    public List<JobApplication> bulkUpload(@RequestBody List<JobApplication> jobs) {
        return repo.saveAll(jobs);
    }
}
