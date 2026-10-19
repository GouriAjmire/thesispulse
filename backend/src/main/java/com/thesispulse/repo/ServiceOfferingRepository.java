package com.thesispulse.repo;

import com.thesispulse.domain.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
    List<ServiceOffering> findAllByOrderBySortOrderAsc();
}
