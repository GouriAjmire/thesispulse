package com.thesispulse.repo;

import com.thesispulse.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Search published posts. Callers pass "" for no category filter, "%" for no text filter
     * and a wide date range for no date filter, which avoids untyped NULL parameters.
     */
    @Query("""
            select p from Post p
            where p.published = true
              and (:cat = '' or p.category.slug = :cat)
              and (lower(p.title) like :q or lower(p.excerpt) like :q)
              and p.publishedOn >= :fromDate and p.publishedOn < :toDate
            order by p.publishedOn desc, p.id desc
            """)
    Page<Post> search(@Param("cat") String cat,
                      @Param("q") String q,
                      @Param("fromDate") LocalDate fromDate,
                      @Param("toDate") LocalDate toDate,
                      Pageable pageable);

    Optional<Post> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Post> findByPublishedTrueOrderByPublishedOnDescIdDesc(Pageable pageable);

    List<Post> findAllByOrderByPublishedOnDescIdDesc();

    @Query("select p.category.id, count(p) from Post p where p.published = true group by p.category.id")
    List<Object[]> countPerCategory();

    @Query("""
            select year(p.publishedOn), month(p.publishedOn), count(p) from Post p
            where p.published = true
            group by year(p.publishedOn), month(p.publishedOn)
            order by year(p.publishedOn) desc, month(p.publishedOn) desc
            """)
    List<Object[]> archives();
}
