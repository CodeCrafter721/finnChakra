package com.finnchakra.backend.dto;

import java.util.Map;

public class MonthlySummaryDTO {

    private String month;
    private double totalIncome;
    private double totalExpense;
    private double totalSavings;
    private Map<String, Double> categoryBreakdown;

    public MonthlySummaryDTO(String month, double totalIncome, double totalExpense, Map<String, Double> categoryBreakdown) {
        this.month = month;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.totalSavings = totalIncome - totalExpense;
        this.categoryBreakdown = categoryBreakdown;
    }

    // Getters
    public String getMonth() { return month; }
    public double getTotalIncome() { return totalIncome; }
    public double getTotalExpense() { return totalExpense; }
    public double getTotalSavings() { return totalSavings; }
    public Map<String, Double> getCategoryBreakdown() { return categoryBreakdown; }

    // Setters
    public void setMonth(String month) { this.month = month; }
    public void setTotalIncome(double totalIncome) { this.totalIncome = totalIncome; }
    public void setTotalExpense(double totalExpense) { this.totalExpense = totalExpense; }
    public void setTotalSavings(double totalSavings) { this.totalSavings = totalSavings; }
    public void setCategoryBreakdown(Map<String, Double> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
}
