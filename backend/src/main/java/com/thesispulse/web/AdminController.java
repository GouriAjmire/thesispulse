package com.thesispulse.web;

import com.thesispulse.domain.Enquiry;
import com.thesispulse.repo.EnquiryRepository;
import com.thesispulse.repo.SubscriberRepository;
import com.thesispulse.service.PostService;
import com.thesispulse.web.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

/** Everything under /api/admin requires HTTP Basic authentication (see SecurityConfig). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PostService postService;
    private final EnquiryRepository enquiries;
    private final SubscriberRepository subscribers;

    public AdminController(PostService postService, EnquiryRepository enquiries, SubscriberRepository subscribers) {
        this.postService = postService;
        this.enquiries = enquiries;
        this.subscribers = subscribers;
    }

    @GetMapping("/me")
    public MessageResponse me() {
        return new MessageResponse("ok");
    }

    @GetMapping("/stats")
    public StatsDto stats() {
        return new StatsDto(postService.count(), enquiries.count(),
                enquiries.countByStatus(Enquiry.Status.NEW), subscribers.count());
    }

    // ---------------------------------------------------------------- posts
    @GetMapping("/posts")
    public List<AdminPostDto> posts() {
        return postService.adminList();
    }

    @PostMapping("/posts")
    public ResponseEntity<AdminPostDto> createPost(@Valid @RequestBody PostRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(req));
    }

    @PutMapping("/posts/{id}")
    public AdminPostDto updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest req) {
        return postService.update(id, req);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- enquiries
    @GetMapping("/enquiries")
    public List<EnquiryDto> enquiries(@RequestParam(required = false) String status) {
        List<Enquiry> list = (status == null || status.isBlank())
                ? enquiries.findAllByOrderByCreatedAtDesc()
                : enquiries.findByStatusOrderByCreatedAtDesc(parseStatus(status));
        return list.stream().map(AdminController::toDto).toList();
    }

    @PatchMapping("/enquiries/{id}/status")
    public EnquiryDto updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest req) {
        Enquiry e = enquiries.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enquiry not found"));
        e.setStatus(parseStatus(req.status()));
        return toDto(enquiries.save(e));
    }

    // ---------------------------------------------------------------- subscribers
    @GetMapping("/subscribers")
    public List<SubscriberDto> subscribers() {
        return subscribers.findAllByOrderBySubscribedAtDesc().stream()
                .map(s -> new SubscriberDto(s.getId(), s.getEmail(), s.getSubscribedAt())).toList();
    }

    // ---------------------------------------------------------------- helpers
    private static Enquiry.Status parseStatus(String raw) {
        try {
            return Enquiry.Status.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status: " + raw);
        }
    }

    private static EnquiryDto toDto(Enquiry e) {
        return new EnquiryDto(e.getId(), e.getName(), e.getEmail(), e.getPhone(), e.getSpecialty(),
                e.getUniversity(), e.getServiceCode(), e.getDeadline(), e.getMessage(),
                e.getStatus().name(), e.getCreatedAt());
    }
}
