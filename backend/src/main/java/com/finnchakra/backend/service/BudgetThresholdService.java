package com.finnchakra.backend.service;

import com.finnchakra.backend.dto.BudgetThresholdRequestDTO;
import com.finnchakra.backend.dto.BudgetThresholdResponseDTO;
import com.finnchakra.backend.model.BudgetThreshold;
import com.finnchakra.backend.repository.BudgetThresholdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetThresholdService {

    @Autowired
    private BudgetThresholdRepository repository;

    public Optional<BudgetThreshold> findByUserEmailAndCategory(String email, String category) {
        return repository.findByUserEmailAndCategory(email, category);
    }

    public List<BudgetThreshold> findByUserEmail(String email) {
        return repository.findByUserEmail(email);
    }

    public BudgetThreshold save(BudgetThresholdRequestDTO dto, String email) {
        boolean exists = repository.findByUserEmailAndCategory(email, dto.getCategory()).isPresent();

        if (exists) {
            throw new RuntimeException("Threshold already exists for this category.");
        }

        BudgetThreshold threshold = new BudgetThreshold();
        threshold.setUserEmail(email);
        threshold.setCategory(dto.getCategory());
        threshold.setThresholdAmount(dto.getThresholdAmount());
        threshold.setCurrency(dto.getCurrency());

        return repository.save(threshold);
    }

    public BudgetThreshold updateThreshold(Long id, BudgetThresholdRequestDTO dto, String email, boolean isAdmin) {
        BudgetThreshold existing = findById(id);

        if (!isAdmin && !existing.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized update attempt");
        }

        existing.setCategory(dto.getCategory());
        existing.setThresholdAmount(dto.getThresholdAmount());
        existing.setCurrency(dto.getCurrency());

        return repository.save(existing);
    }

    public void deleteThreshold(Long id, String email, boolean isAdmin) {
        BudgetThreshold existing = findById(id);

        if (!isAdmin && !existing.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized delete attempt");
        }

        repository.deleteById(id);
    }

    public BudgetThreshold findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Threshold not found"));
    }

    public List<BudgetThreshold> findAll() {
        return repository.findAll();
    }

    public Page<BudgetThreshold> getAllThresholdsAdmin(String category, String email, Pageable pageable) {
        if (category != null && email != null) {
            return repository.findByUserEmailContainingIgnoreCaseAndCategoryContainingIgnoreCase(email, category, pageable);
        } else if (category != null) {
            return repository.findByCategoryContainingIgnoreCase(category, pageable);
        } else if (email != null) {
            return repository.findByUserEmailContainingIgnoreCase(email, pageable);
        } else {
            return repository.findAll(pageable);
        }
    }

    public boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    public BudgetThresholdResponseDTO mapToDto(BudgetThreshold entity) {
        return BudgetThresholdResponseDTO.builder()
                .id(entity.getId())
                .userEmail(entity.getUserEmail())
                .category(entity.getCategory())
                .thresholdAmount(entity.getThresholdAmount())
                .currency(entity.getCurrency())
                .build();
    }

    public List<BudgetThresholdResponseDTO> findAllAsDto() {
        return repository.findAll().stream().map(this::mapToDto).toList();
    }

    public List<BudgetThresholdResponseDTO> findAllByEmail(String email) {
        return repository.findByUserEmail(email).stream().map(this::mapToDto).toList();
    }

    public Page<BudgetThresholdResponseDTO> getAllThresholdsAdminAsDto(String category, String email, Pageable pageable) {
        Page<BudgetThreshold> page = getAllThresholdsAdmin(category, email, pageable);
        return page.map(this::mapToDto);
    }

    public List<BudgetThreshold> findAllEntities() {
        return repository.findAll();
    }
}
