package com.thesispulse.repo;

import com.thesispulse.domain.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    boolean existsByEmailIgnoreCase(String email);

    List<Subscriber> findAllByOrderBySubscribedAtDesc();
}
