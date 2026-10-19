package com.thesispulse.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "enquiries")
@Getter
@Setter
public class Enquiry {
    public enum Status { NEW, CONTACTED, CONFIRMED, CLOSED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String specialty;
    private String university;

    @Column(name = "service_code")
    private String serviceCode;

    private LocalDate deadline;

    @Column(columnDefinition = "text")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.NEW;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
