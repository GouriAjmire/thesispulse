package com.thesispulse.repo;

import com.thesispulse.domain.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findAllByOrderByCreatedAtDesc();

    List<Enquiry> findByStatusOrderByCreatedAtDesc(Enquiry.Status status);

    long countByStatus(Enquiry.Status status);
}
