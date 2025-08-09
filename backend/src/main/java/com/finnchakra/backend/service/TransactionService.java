package com.finnchakra.backend.service;

import com.finnchakra.backend.dto.MonthlySummaryDTO;
import com.finnchakra.backend.dto.SummaryResponse;
import com.finnchakra.backend.dto.TransactionDTO;
import com.finnchakra.backend.model.BudgetThreshold;
import com.finnchakra.backend.model.Transaction;
import com.finnchakra.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetThresholdService budgetThresholdService;

    @Autowired
    private EmailService emailService;

    public List<Transaction> getTransactionsByUserEmail(String email) {
        return transactionRepository.findByUserEmail(email);
    }

    public Transaction createTransaction(TransactionDTO dto, String email) {
        Transaction tx = new Transaction();
        tx.setTitle(dto.getTitle());
        tx.setAmount(dto.getAmount());
        tx.setType(dto.getType());
        tx.setDate(dto.getDate());
        tx.setCategory(dto.getCategory());
        tx.setUserEmail(email);
        tx.setRecurring(dto.isRecurring());
        tx.setRecurrence(dto.getRecurrence());
        tx.setCurrency(dto.getCurrency());

        Transaction saved = transactionRepository.save(tx);

        //  Send confirmation email
        emailService.sendSimpleEmail(
                email,
                " Transaction Added",
                "Transaction '" + tx.getTitle() + "' of " + tx.getAmount() + " " + tx.getCurrency() + " added successfully."
        );

        //  Check if category budget is exceeded
        if ("EXPENSE".equalsIgnoreCase(tx.getType())) {
            List<Transaction> expenses = transactionRepository.findByUserEmailAndCategory(email, tx.getCategory());

            BigDecimal totalExpense = expenses.stream()
                    .map(e -> BigDecimal.valueOf(e.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            budgetThresholdService.findByUserEmailAndCategory(email, tx.getCategory()).ifPresent(threshold -> {
                if (totalExpense.compareTo(threshold.getThresholdAmount()) > 0) {
                    emailService.sendSimpleEmail(
                            email,
                            "🚨 Budget Limit Exceeded",
                            "You've exceeded your budget for category '" + threshold.getCategory() + "'.\n\n" +
                                    "Limit: " + threshold.getThresholdAmount() + " " + threshold.getCurrency() + "\n" +
                                    "Current: " + totalExpense + " " + threshold.getCurrency()
                    );
                }
            });
        }

        return saved;
    }

    public Transaction updateTransaction(Long id, TransactionDTO dto, String email) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!tx.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized update attempt");
        }

        tx.setTitle(dto.getTitle());
        tx.setAmount(dto.getAmount());
        tx.setType(dto.getType());
        tx.setDate(dto.getDate());
        tx.setCategory(dto.getCategory());
        tx.setRecurring(dto.isRecurring());
        tx.setRecurrence(dto.getRecurrence());
        tx.setCurrency(dto.getCurrency());

        return transactionRepository.save(tx);
    }

    public void deleteTransaction(Long id, String email) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!tx.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized delete attempt");
        }
        transactionRepository.delete(tx);
    }

    public SummaryResponse getSummary(String email) {
        List<Transaction> transactions = transactionRepository.findByUserEmail(email);

        Map<String, Double> income = transactions.stream()
                .filter(tx -> tx.getType().equalsIgnoreCase("INCOME"))
                .collect(Collectors.groupingBy(Transaction::getCategory, Collectors.summingDouble(Transaction::getAmount)));

        Map<String, Double> expense = transactions.stream()
                .filter(tx -> tx.getType().equalsIgnoreCase("EXPENSE"))
                .collect(Collectors.groupingBy(Transaction::getCategory, Collectors.summingDouble(Transaction::getAmount)));

        return new SummaryResponse(income, expense);
    }

    public Page<Transaction> getTransactionsByUser(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return transactionRepository.findByUserEmail(email, pageable);
    }

    public Page<Transaction> getFilteredTransactions(
            String email,
            int page,
            int size,
            String category,
            LocalDate start,
            LocalDate end,
            Double minAmount,
            Double maxAmount
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return transactionRepository.findFilteredTransactions(
                email, category, start, end, minAmount, maxAmount, pageable
        );
    }


    public List<Transaction> getAllTransactionsForUser(String email) {
        return transactionRepository.findByUserEmail(email);
    }

    public List<MonthlySummaryDTO> getMonthlySummary(String email) {
        List<Transaction> transactions = transactionRepository.findByUserEmail(email);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH);

        return transactions.stream()
                .collect(Collectors.groupingBy(tx -> YearMonth.from(tx.getDate())))
                .entrySet()
                .stream()
                .map(entry -> {
                    YearMonth month = entry.getKey();
                    List<Transaction> monthTx = entry.getValue();

                    double income = monthTx.stream()
                            .filter(tx -> tx.getType().equalsIgnoreCase("INCOME"))
                            .mapToDouble(Transaction::getAmount)
                            .sum();

                    double expense = monthTx.stream()
                            .filter(tx -> tx.getType().equalsIgnoreCase("EXPENSE"))
                            .mapToDouble(Transaction::getAmount)
                            .sum();

                    Map<String, Double> categoryBreakdown = monthTx.stream()
                            .filter(tx -> tx.getType().equalsIgnoreCase("EXPENSE"))
                            .collect(Collectors.groupingBy(
                                    Transaction::getCategory,
                                    Collectors.summingDouble(Transaction::getAmount)
                            ));

                    return new MonthlySummaryDTO(
                            month.format(formatter),
                            income,
                            expense,
                            categoryBreakdown
                    );
                })
                .sorted(Comparator.comparing(
                        entry -> YearMonth.parse(entry.getMonth(), formatter),
                        Comparator.reverseOrder()
                ))
                .collect(Collectors.toList());
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
