package com.finnchakra.backend.repository;

import com.finnchakra.backend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    //  List all by user email
    List<Transaction> findByUserEmail(String userEmail);

    //  Paginated query by user email
    Page<Transaction> findByUserEmail(String userEmail, Pageable pageable);

    //  Recurring
    List<Transaction> findByRecurringTrue();



    List<Transaction> findByUserEmailOrderByDateDesc(String email);


    //  Filter by category (optional search)
    Page<Transaction> findByUserEmailAndCategoryContainingIgnoreCase(String userEmail, String category, Pageable pageable);

    // Filter by date range
    Page<Transaction> findByUserEmailAndDateBetween(String userEmail, LocalDate start, LocalDate end, Pageable pageable);

    //  Filter by category + date range
    Page<Transaction> findByUserEmailAndCategoryContainingIgnoreCaseAndDateBetween(
            String userEmail, String category, LocalDate start, LocalDate end, Pageable pageable
    );

    List<Transaction> findByUserEmailAndCategory(String userEmail, String category);

}
