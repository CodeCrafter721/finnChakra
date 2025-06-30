package com.finnchakra.backend.dto;

import java.util.Map;

public class SummaryResponse {
    private Map<String, Double> incomeByCategory;
    private Map<String, Double> expenseByCategory;

    // Constructors
    public SummaryResponse() {}
    public SummaryResponse(Map<String, Double> incomeByCategory, Map<String, Double> expenseByCategory) {
        this.incomeByCategory = incomeByCategory;
        this.expenseByCategory = expenseByCategory;
    }

    // Getters and Setters
    public Map<String, Double> getIncomeByCategory() { return incomeByCategory; }

    public void setIncomeByCategory(Map<String, Double> incomeByCategory) { this.incomeByCategory = incomeByCategory; }

    public Map<String, Double> getExpenseByCategory() { return expenseByCategory; }

    public void setExpenseByCategory(Map<String, Double> expenseByCategory) { this.expenseByCategory = expenseByCategory; }
}
