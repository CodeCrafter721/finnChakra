package com.finnchakra.backend.controller;

import com.finnchakra.backend.dto.MonthlySummaryDTO;
import com.finnchakra.backend.dto.SummaryResponse;
import com.finnchakra.backend.dto.TransactionDTO;
import com.finnchakra.backend.model.Transaction;
import com.finnchakra.backend.security.JwtUtil;
import com.finnchakra.backend.service.JwtService;
import com.finnchakra.backend.service.TransactionService;
import com.finnchakra.backend.util.CsvExportUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;

@Tag(name = "Transaction Controller", description = "Manage transactions and summaries")
@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtService jwtService;

    private String extractEmailFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractEmail(token);
        }
        throw new RuntimeException("JWT token missing or invalid");
    }

    @GetMapping("/transactions")
    @Operation(summary = "Get transactions (with pagination and filtering support)")
    public ResponseEntity<?> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            HttpServletRequest request
    ) {
        String email = extractEmailFromToken(request);
        boolean noPagination = page == 0 && size == 0 && category == null && start == null && end == null;

        if (noPagination) {
            List<Transaction> all = transactionService.getTransactionsByUserEmail(email);
            return ResponseEntity.ok(all);
        }

        Page<Transaction> result = transactionService.getFilteredTransactions(email, page, size, category, start, end);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/transactions")
    @Operation(summary = "Add a new transaction (recurring supported)")
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionDTO dto, HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        return ResponseEntity.ok(transactionService.createTransaction(dto, email));
    }

    @PutMapping("/transactions/{id}")
    @Operation(summary = "Update a transaction by ID")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody TransactionDTO dto, HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        return ResponseEntity.ok(transactionService.updateTransaction(id, dto, email));
    }

    @DeleteMapping("/transactions/{id}")
    @Operation(summary = "Delete a transaction by ID")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        transactionService.deleteTransaction(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    @Operation(summary = "Get summary of income and expenses by category")
    public ResponseEntity<SummaryResponse> getSummary(HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        return ResponseEntity.ok(transactionService.getSummary(email));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export all transactions as CSV")
    public void exportToCsv(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String email = extractEmailFromToken(request);

        response.setContentType("text/csv");
        String fileName = "transactions_" + LocalDate.now() + ".csv";
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

        List<Transaction> transactions = transactionService.getAllTransactionsForUser(email);

        try (PrintWriter writer = response.getWriter()) {
            CsvExportUtil.writeTransactionsToCsv(writer, transactions);
        }
    }

    @GetMapping("/summary/monthly")
    @Operation(summary = "Get monthly income/expense summaries")
    public ResponseEntity<List<MonthlySummaryDTO>> getMonthlySummary(HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        return ResponseEntity.ok(transactionService.getMonthlySummary(email));
    }

    @GetMapping("/export/monthly-summary/csv")
    @Operation(summary = "Export monthly summaries to CSV")
    public void exportMonthlySummaryCsv(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String email = extractEmailFromToken(request);

        List<MonthlySummaryDTO> summaries = transactionService.getMonthlySummary(email);

        response.setContentType("text/csv");
        String filename = "monthly_summary_" + LocalDate.now() + ".csv";
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        try (PrintWriter writer = response.getWriter()) {
            CsvExportUtil.writeMonthlySummariesToCsv(writer, summaries);
        }
    }

    // ADMIN-ONLY endpoint to export all transactions across users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/export/all-transactions")
    @Operation(summary = "Export all transactions (admin only)")
    public void exportAllTransactions(HttpServletResponse response) throws IOException {
        List<Transaction> allTransactions = transactionService.getAllTransactions();

        response.setContentType("text/csv");
        String filename = "all_transactions_" + LocalDate.now() + ".csv";
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        try (PrintWriter writer = response.getWriter()) {
            CsvExportUtil.writeTransactionsToCsv(writer, allTransactions);
        }
    }
}
