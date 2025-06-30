package com.finnchakra.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BudgetThresholdRequestDTO {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Threshold amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be positive")
    private BigDecimal thresholdAmount;

    @NotBlank(message = "Currency is required")
    private String currency;
}
