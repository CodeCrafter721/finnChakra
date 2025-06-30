package com.finnchakra.backend.controller;
import com.finnchakra.backend.dto.BudgetThresholdRequestDTO;
import com.finnchakra.backend.dto.BudgetThresholdResponseDTO;
import com.finnchakra.backend.model.BudgetThreshold;
import com.finnchakra.backend.service.BudgetThresholdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/budget")
@Tag(name = "Budget Thresholds", description = "Manage budget alerts for users and admins")
public class BudgetThresholdController {

    @Autowired
    private BudgetThresholdService service;

    @PreAuthorize("hasRole('USER')")
    @GetMapping
    @Operation(summary = "Get all thresholds for current user", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<BudgetThresholdResponseDTO>> getUserThresholds(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(service.findAllByEmail(email));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    @Operation(
            summary = "Create new threshold for current user",
            security = @SecurityRequirement(name = "bearerAuth"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BudgetThresholdRequestDTO.class),
                            examples = @ExampleObject(value = """
                                {
                                  "category": "Travel",
                                  "thresholdAmount": 13000.00,
                                  "currency": "USD"
                                }
                                """)
                    )
            )
    )
    public ResponseEntity<BudgetThresholdResponseDTO> create(
            @Valid @RequestBody BudgetThresholdRequestDTO dto,
            Principal principal) {

        String email = principal.getName();
        BudgetThreshold saved = service.save(dto, email);
        return ResponseEntity.ok(service.mapToDto(saved));
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/{id}")
    @Operation(summary = "Update a budget threshold", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<BudgetThresholdResponseDTO> updateThreshold(
            @PathVariable Long id,
            @Valid @RequestBody BudgetThresholdRequestDTO dto,
            Principal principal) {

        String email = principal.getName();
        boolean isAdmin = service.isAdmin();
        BudgetThreshold updated = service.updateThreshold(id, dto, email, isAdmin);
        return ResponseEntity.ok(service.mapToDto(updated));
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a threshold", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        String email = principal.getName();
        boolean isAdmin = service.isAdmin();
        service.deleteThreshold(id, email, isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    @Operation(summary = "ADMIN: Get all thresholds", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<BudgetThresholdResponseDTO>> getAllThresholdsForAdmin() {
        return ResponseEntity.ok(service.findAllAsDto());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    @Operation(summary = "ADMIN: Paginated/searchable thresholds list", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<BudgetThresholdResponseDTO>> getAllThresholdsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String email) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAllThresholdsAdminAsDto(category, email, pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/export")
    @Operation(summary = "ADMIN: Export thresholds to CSV", security = @SecurityRequirement(name = "bearerAuth"))
    public void exportToCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=budget_thresholds.csv");

        List<BudgetThreshold> thresholds = service.findAll(); // Ensure this returns entities
        try (PrintWriter writer = response.getWriter()) {
            writer.println("User Email,Category,Amount,Currency");
            for (BudgetThreshold threshold : thresholds) {
                writer.printf("%s,%s,%s,%s%n",
                        threshold.getUserEmail(),
                        threshold.getCategory(),
                        threshold.getThresholdAmount(),
                        threshold.getCurrency());
            }
        }
    }
}
