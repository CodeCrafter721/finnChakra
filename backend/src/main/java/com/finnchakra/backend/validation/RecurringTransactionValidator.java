package com.finnchakra.backend.validation;

import com.finnchakra.backend.dto.TransactionDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class RecurringTransactionValidator implements ConstraintValidator<ValidRecurringTransaction, TransactionDTO> {

    private static final List<String> ALLOWED = Arrays.asList("DAILY", "WEEKLY", "MONTHLY");

    @Override
    public boolean isValid(TransactionDTO dto, ConstraintValidatorContext context) {
        if (dto == null) return true;

        if (dto.isRecurring()) {
            String recurrence = dto.getRecurrence();
            return recurrence != null && ALLOWED.contains(recurrence.toUpperCase());
        }
        return true;
    }
}
