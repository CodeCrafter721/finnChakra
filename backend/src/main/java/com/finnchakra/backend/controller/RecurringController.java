package com.finnchakra.backend.controller;

import com.finnchakra.backend.scheduling.RecurringTransactionProcessor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recurring")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Recurring Transactions", description = "Manual trigger for recurring transaction processing")
public class RecurringController {

    @Autowired
    private RecurringTransactionProcessor processor;

    @PostMapping("/process")
    @Operation(summary = "Manually process recurring transactions")
    public ResponseEntity<String> processRecurringTransactions() {
        processor.processRecurringTransactions();
        return ResponseEntity.ok("Recurring transactions processed successfully.");
    }
}
