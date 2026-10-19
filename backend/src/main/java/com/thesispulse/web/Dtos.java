package com.thesispulse.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** Request/response shapes for the REST API. */
public final class Dtos {
    private Dtos() {}

    // ------------------------------------------------------------ public responses
    public record CategoryDto(Long id, String name, String slug, String description, long postCount) {}

    public record PostSummaryDto(Long id, String title, String slug, String excerpt, String author,
                                 int readMinutes, LocalDate publishedOn,
                                 String categoryName, String categorySlug) {}

    public record PostDetailDto(Long id, String title, String slug, String excerpt, String content,
                                String author, int readMinutes, LocalDate publishedOn,
                                String categoryName, String categorySlug) {}

    public record PageDto<T>(List<T> items, int page, int totalPages, long totalItems) {}

    public record ArchiveDto(int year, int month, String label, long count) {}

    public record ServiceDto(Long id, String code, String number, String title, String summary,
                             List<String> features, String badge, boolean highlight) {}

    public record FaqDto(Long id, String question, String answer) {}

    public record SpecialtyDto(String name, String group) {}

    public record ResourceDto(Long id, String title, String description, String fileType, String url) {}

    public record ReviewDto(Long id, String name, int rating, String review, Instant createdAt) {}

    // ------------------------------------------------------------ public requests
    public record EnquiryRequest(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Email @Size(max = 160) String email,
            @NotBlank @Pattern(regexp = "^\\+[1-9][0-9]{7,14}$",
                    message = "Enter a valid phone number including its country code.")
            String phone,
            @Size(max = 100) String specialty,
            @Size(max = 160) String university,
            @Size(max = 40) String serviceCode,
            LocalDate deadline,
            @Size(max = 4000) String message) {}

    public record SubscribeRequest(@NotBlank @Email @Size(max = 160) String email) {}

    public record ReviewRequest(
            @NotBlank @Size(max = 100) String name,
            @NotNull @Min(1) @Max(5) Integer rating,
            @NotBlank @Size(max = 2000) String review) {}

    public record MessageResponse(String message) {}

    // ------------------------------------------------------------ admin
    public record PostRequest(
            @NotBlank @Size(max = 255) String title,
            @Size(max = 255) String slug,
            @NotBlank String excerpt,
            @NotBlank String content,
            @NotNull Long categoryId,
            @Size(max = 100) String author,
            LocalDate publishedOn,
            Boolean published) {}

    public record AdminPostDto(Long id, String title, String slug, String excerpt, String content,
                               String author, int readMinutes, LocalDate publishedOn, boolean published,
                               Long categoryId, String categoryName) {}

    public record EnquiryDto(Long id, String name, String email, String phone, String specialty,
                             String university, String serviceCode, LocalDate deadline, String message,
                             String status, Instant createdAt) {}

    public record StatusRequest(@NotBlank String status) {}

    public record SubscriberDto(Long id, String email, Instant subscribedAt) {}

    public record StatsDto(long posts, long enquiries, long newEnquiries, long subscribers) {}
}
