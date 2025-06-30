package com.finnchakra.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class BudgetThresholdResponseDTO {
    private Long id;
    private String userEmail;
    private String category;
    private BigDecimal thresholdAmount;
    private String currency;
}
