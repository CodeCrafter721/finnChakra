package com.finnchakra.backend.repository;

import com.finnchakra.backend.model.BudgetThreshold;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetThresholdRepository extends JpaRepository<BudgetThreshold, Long> {

    List<BudgetThreshold> findByUserEmail(String email);

    Optional<BudgetThreshold> findByUserEmailAndCategory(String email, String category);

    Page<BudgetThreshold> findByUserEmailContainingIgnoreCase(String email, Pageable pageable);

    Page<BudgetThreshold> findByCategoryContainingIgnoreCase(String category, Pageable pageable);

    Page<BudgetThreshold> findByUserEmailContainingIgnoreCaseAndCategoryContainingIgnoreCase(
            String email, String category, Pageable pageable
    );
}
