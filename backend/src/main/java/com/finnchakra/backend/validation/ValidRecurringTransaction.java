package com.finnchakra.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RecurringTransactionValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRecurringTransaction {
    String message() default "Recurrence must be DAILY, WEEKLY, or MONTHLY if isRecurring is true";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
