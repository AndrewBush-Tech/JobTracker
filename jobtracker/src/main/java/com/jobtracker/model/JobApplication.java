package com.jobtracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String position;
    private String status;
    private LocalDate deadline;
    @Column(length = 1000)
    private String jobLink;

    public JobApplication() {}

    public JobApplication(String company, String position, String status, LocalDate deadline, String jobLink) {
        this.company = company;
        this.position = position;
        this.status = status;
        this.deadline = deadline;
        this.jobLink = jobLink;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public void setJobLink(String jobLink) {
        this.jobLink = jobLink;
    }
// Right-click → Generate → Getters and Setters for all fields

    public Long getId() {
        return id;
    }

    public String getCompany() {
        return company;
    }

    public String getPosition() {
        return position;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public String getJobLink() {
        return jobLink;
    }
}
