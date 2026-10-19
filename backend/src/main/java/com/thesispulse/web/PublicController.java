package com.thesispulse.web;

import com.thesispulse.domain.Enquiry;
import com.thesispulse.domain.Review;
import com.thesispulse.domain.Subscriber;
import com.thesispulse.repo.*;
import com.thesispulse.service.EnquiryEmailService;
import com.thesispulse.service.PostService;
import com.thesispulse.web.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final PostService postService;
    private final ServiceOfferingRepository services;
    private final FaqRepository faqs;
    private final SpecialtyRepository specialties;
    private final ResourceRepository resources;
    private final EnquiryRepository enquiries;
    private final SubscriberRepository subscribers;
    private final ReviewRepository reviews;
    private final EnquiryEmailService enquiryEmailService;

    public PublicController(PostService postService, ServiceOfferingRepository services, FaqRepository faqs,
                            SpecialtyRepository specialties, ResourceRepository resources,
                            EnquiryRepository enquiries, SubscriberRepository subscribers,
                            ReviewRepository reviews, EnquiryEmailService enquiryEmailService) {
        this.postService = postService;
        this.services = services;
        this.faqs = faqs;
        this.specialties = specialties;
        this.resources = resources;
        this.enquiries = enquiries;
        this.subscribers = subscribers;
        this.reviews = reviews;
        this.enquiryEmailService = enquiryEmailService;
    }

    // ---------------------------------------------------------------- site content
    @GetMapping("/services")
    public List<ServiceDto> services() {
        return services.findAllByOrderBySortOrderAsc().stream()
                .map(s -> new ServiceDto(s.getId(), s.getCode(), s.getNumber(), s.getTitle(), s.getSummary(),
                        Arrays.stream(s.getFeatures().split("\\R")).map(String::trim).filter(f -> !f.isEmpty()).toList(),
                        s.getBadge(), s.isHighlight()))
                .toList();
    }

    @GetMapping("/faqs")
    public List<FaqDto> faqs() {
        return faqs.findAllByOrderBySortOrderAsc().stream()
                .map(f -> new FaqDto(f.getId(), f.getQuestion(), f.getAnswer())).toList();
    }

    @GetMapping("/specialties")
    public List<SpecialtyDto> specialties() {
        return specialties.findAllByOrderBySortOrderAsc().stream()
                .map(s -> new SpecialtyDto(s.getName(), s.getGroupName())).toList();
    }

    @GetMapping("/resources")
    public List<ResourceDto> resources() {
        return resources.findAllByOrderBySortOrderAsc().stream()
                .map(r -> new ResourceDto(r.getId(), r.getTitle(), r.getDescription(), r.getFileType(), r.getUrl()))
                .toList();
    }

    // ---------------------------------------------------------------- blog
    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return postService.categories();
    }

    @GetMapping("/posts")
    public PageDto<PostSummaryDto> posts(@RequestParam(required = false) String category,
                                         @RequestParam(required = false) String q,
                                         @RequestParam(required = false) Integer year,
                                         @RequestParam(required = false) Integer month,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "6") int size) {
        return postService.search(category, q, year, month, page, size);
    }

    @GetMapping("/posts/recent")
    public List<PostSummaryDto> recent(@RequestParam(defaultValue = "3") int limit) {
        return postService.recent(limit);
    }

    @GetMapping("/posts/archives")
    public List<ArchiveDto> archives() {
        return postService.archives();
    }

    @GetMapping("/posts/{slug}")
    public PostDetailDto post(@PathVariable String slug) {
        return postService.bySlug(slug);
    }

    // ---------------------------------------------------------------- forms
    @GetMapping("/reviews")
    public List<ReviewDto> reviews() {
        return reviews.findAllByOrderByCreatedAtDesc().stream()
                .map(r -> new ReviewDto(r.getId(), r.getName(), r.getRating(), r.getReview(), r.getCreatedAt()))
                .toList();
    }

    @PostMapping("/reviews")
    public ResponseEntity<MessageResponse> addReview(@Valid @RequestBody ReviewRequest req) {
        Review review = new Review();
        review.setName(req.name().trim());
        review.setRating(req.rating());
        review.setReview(req.review().trim());
        reviews.save(review);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Thank you for sharing your review."));
    }

    @PostMapping("/enquiries")
    public ResponseEntity<MessageResponse> enquire(@Valid @RequestBody EnquiryRequest req) {
        enquiryEmailService.send(req);
        Enquiry e = new Enquiry();
        e.setName(req.name().trim());
        e.setEmail(req.email().trim());
        e.setPhone(blankToNull(req.phone()));
        e.setSpecialty(blankToNull(req.specialty()));
        e.setUniversity(blankToNull(req.university()));
        e.setServiceCode(blankToNull(req.serviceCode()));
        e.setDeadline(req.deadline());
        e.setMessage(blankToNull(req.message()));
        enquiries.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Thanks " + e.getName() + "! We will get back to you within 24 hours."));
    }

    @PostMapping("/subscribers")
    public ResponseEntity<MessageResponse> subscribe(@Valid @RequestBody SubscribeRequest req) {
        String email = req.email().trim();
        if (!subscribers.existsByEmailIgnoreCase(email)) {
            Subscriber s = new Subscriber();
            s.setEmail(email);
            subscribers.save(s);
        }
        // Same answer whether or not the address already existed.
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("You are on the list. Watch your inbox for new guides."));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
