package com.thesispulse.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "service_offerings")
@Getter
@Setter
public class ServiceOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    /** Newline separated list of bullet points. */
    @Column(nullable = false, columnDefinition = "text")
    private String features;

    private String badge;

    @Column(nullable = false)
    private boolean highlight;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;
}
