package com.finnchakra.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Double amount;
    private String type;
    private LocalDate date;
    private String category;
    private String userEmail;

    @Column(nullable = false)
    private String currency = "INR"; // default to INR


    @Column(name = "is_recurring")
    private boolean recurring;

    private String recurrence;

    @Column(name = "last_processed_date")
    private LocalDate lastProcessedDate;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    @JsonProperty("isRecurring")
    public boolean isRecurring() { return recurring; }

    @JsonProperty("isRecurring")
    public void setRecurring(boolean recurring) { this.recurring = recurring; }

    public String getRecurrence() { return recurrence; }
    public void setRecurrence(String recurrence) { this.recurrence = recurrence; }

    public LocalDate getLastProcessedDate() { return lastProcessedDate; }
    public void setLastProcessedDate(LocalDate lastProcessedDate) { this.lastProcessedDate = lastProcessedDate; }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }


    @Transient
    @JsonProperty("nextRecurrenceDate")
    public LocalDate getNextRecurrenceDate() {
        if (!recurring || recurrence == null || date == null) return null;

        LocalDate base = lastProcessedDate != null ? lastProcessedDate : date;

        return switch (recurrence) {
            case "DAILY" -> base.plusDays(1);
            case "WEEKLY" -> base.plusWeeks(1);
            case "MONTHLY" -> base.plusMonths(1);
            default -> null;
        };
    }
}
