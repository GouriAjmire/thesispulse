package com.thesispulse.service;

import com.thesispulse.domain.Category;
import com.thesispulse.domain.Post;
import com.thesispulse.repo.CategoryRepository;
import com.thesispulse.repo.PostRepository;
import com.thesispulse.web.Dtos.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class PostService {

    private static final LocalDate MIN_DATE = LocalDate.of(1900, 1, 1);
    private static final LocalDate MAX_DATE = LocalDate.of(9999, 1, 1);
    private static final String DEFAULT_AUTHOR = "ThesisPulse Editorial Team";

    private final PostRepository posts;
    private final CategoryRepository categories;

    public PostService(PostRepository posts, CategoryRepository categories) {
        this.posts = posts;
        this.categories = categories;
    }

    // ------------------------------------------------------------------ public reads
    public PageDto<PostSummaryDto> search(String category, String text, Integer year, Integer month,
                                          int page, int size) {
        String cat = category == null ? "" : category.trim().toLowerCase(Locale.ROOT);
        String q = "%" + (text == null ? "" : text.trim().toLowerCase(Locale.ROOT)) + "%";

        LocalDate from = MIN_DATE;
        LocalDate to = MAX_DATE;
        if (year != null && month != null && month >= 1 && month <= 12) {
            from = LocalDate.of(year, month, 1);
            to = from.plusMonths(1);
        } else if (year != null) {
            from = LocalDate.of(year, 1, 1);
            to = from.plusYears(1);
        }

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        Page<Post> result = posts.search(cat, q, from, to, PageRequest.of(safePage, safeSize));
        return new PageDto<>(result.getContent().stream().map(PostService::toSummary).toList(),
                result.getNumber(), result.getTotalPages(), result.getTotalElements());
    }

    public PostDetailDto bySlug(String slug) {
        Post p = posts.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        return new PostDetailDto(p.getId(), p.getTitle(), p.getSlug(), p.getExcerpt(), p.getContent(),
                p.getAuthor(), p.getReadMinutes(), p.getPublishedOn(),
                p.getCategory().getName(), p.getCategory().getSlug());
    }

    public List<PostSummaryDto> recent(int limit) {
        return posts.findByPublishedTrueOrderByPublishedOnDescIdDesc(PageRequest.of(0, Math.min(Math.max(limit, 1), 20)))
                .stream().map(PostService::toSummary).toList();
    }

    public List<CategoryDto> categories() {
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : posts.countPerCategory()) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return categories.findAllByOrderByNameAsc().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getDescription(),
                        counts.getOrDefault(c.getId(), 0L)))
                .toList();
    }

    public List<ArchiveDto> archives() {
        return posts.archives().stream().map(row -> {
            int y = ((Number) row[0]).intValue();
            int m = ((Number) row[1]).intValue();
            String label = Month.of(m).getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + y;
            return new ArchiveDto(y, m, label, ((Number) row[2]).longValue());
        }).toList();
    }

    // ------------------------------------------------------------------ admin
    public List<AdminPostDto> adminList() {
        return posts.findAllByOrderByPublishedOnDescIdDesc().stream().map(PostService::toAdmin).toList();
    }

    @Transactional
    public AdminPostDto create(PostRequest req) {
        Post p = new Post();
        apply(p, req, null);
        return toAdmin(posts.save(p));
    }

    @Transactional
    public AdminPostDto update(Long id, PostRequest req) {
        Post p = posts.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        apply(p, req, id);
        return toAdmin(posts.save(p));
    }

    @Transactional
    public void delete(Long id) {
        if (!posts.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        posts.deleteById(id);
    }

    public long count() {
        return posts.count();
    }

    // ------------------------------------------------------------------ helpers
    private void apply(Post p, PostRequest req, Long existingId) {
        Category category = categories.findById(req.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown category"));
        p.setTitle(req.title().trim());
        p.setExcerpt(req.excerpt().trim());
        p.setContent(req.content().trim());
        p.setCategory(category);
        p.setAuthor(req.author() == null || req.author().isBlank() ? DEFAULT_AUTHOR : req.author().trim());
        p.setPublished(req.published() == null || req.published());
        if (req.publishedOn() != null) {
            p.setPublishedOn(req.publishedOn());
        }
        p.setReadMinutes(estimateReadMinutes(req.content()));
        String base = slugify(req.slug() == null || req.slug().isBlank() ? req.title() : req.slug());
        p.setSlug(uniqueSlug(base, existingId));
    }

    private String uniqueSlug(String base, Long existingId) {
        String slug = base;
        int n = 2;
        while (existingId == null ? posts.existsBySlug(slug) : posts.existsBySlugAndIdNot(slug, existingId)) {
            slug = base + "-" + n++;
        }
        return slug;
    }

    static int estimateReadMinutes(String content) {
        int words = content.trim().isEmpty() ? 0 : content.trim().split("\\s+").length;
        return Math.max(1, (int) Math.ceil(words / 200.0));
    }

    static String slugify(String input) {
        String s = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return s.isEmpty() ? "post" : s;
    }

    static PostSummaryDto toSummary(Post p) {
        return new PostSummaryDto(p.getId(), p.getTitle(), p.getSlug(), p.getExcerpt(), p.getAuthor(),
                p.getReadMinutes(), p.getPublishedOn(), p.getCategory().getName(), p.getCategory().getSlug());
    }

    static AdminPostDto toAdmin(Post p) {
        return new AdminPostDto(p.getId(), p.getTitle(), p.getSlug(), p.getExcerpt(), p.getContent(),
                p.getAuthor(), p.getReadMinutes(), p.getPublishedOn(), p.isPublished(),
                p.getCategory().getId(), p.getCategory().getName());
    }
}
