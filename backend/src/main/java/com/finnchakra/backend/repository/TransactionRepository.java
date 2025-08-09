package com.finnchakra.backend.repository;

import com.finnchakra.backend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserEmail(String userEmail);

    Page<Transaction> findByUserEmail(String userEmail, Pageable pageable);

    List<Transaction> findByRecurringTrue();

    List<Transaction> findByUserEmailOrderByDateDesc(String email);

    List<Transaction> findByUserEmailAndCategory(String userEmail, String category);

    // ✅ Combined filter query with category/date/amount
    @Query("""
        SELECT t FROM Transaction t
        WHERE t.userEmail = :email
        AND (:category IS NULL OR LOWER(t.category) LIKE LOWER(CONCAT('%', :category, '%')))
        AND (:start IS NULL OR t.date >= :start)
        AND (:end IS NULL OR t.date <= :end)
        AND (:minAmount IS NULL OR t.amount >= :minAmount)
        AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
    """)
    Page<Transaction> findFilteredTransactions(
            @Param("email") String email,
            @Param("category") String category,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            Pageable pageable
    );
}
