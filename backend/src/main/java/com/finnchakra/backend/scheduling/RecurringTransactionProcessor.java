package com.finnchakra.backend.scheduling;

import com.finnchakra.backend.model.Transaction;
import com.finnchakra.backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class RecurringTransactionProcessor {

    @Autowired
    private TransactionRepository transactionRepository;

    //  Runs daily at midnight
    @Scheduled(cron = "0 0 0 * * ?") // Everyday at 00:00
    @Transactional
    public void processRecurringTransactions() {
        List<Transaction> recurringTxs = transactionRepository.findAll()
                .stream()
                .filter(Transaction::isRecurring)
                .toList();

        LocalDate today = LocalDate.now();

        for (Transaction tx : recurringTxs) {
            LocalDate lastProcessed = tx.getLastProcessedDate();
            if (lastProcessed == null) {
                lastProcessed = tx.getDate(); // fallback
            }

            LocalDate nextDate = switch (tx.getRecurrence()) {
                case "DAILY" -> lastProcessed.plusDays(1);
                case "WEEKLY" -> lastProcessed.plusWeeks(1);
                case "MONTHLY" -> lastProcessed.plusMonths(1);
                default -> null;
            };

            if (nextDate == null || nextDate.isAfter(today)) continue;

            //  Create new transaction
            Transaction newTx = new Transaction();
            newTx.setTitle(tx.getTitle());
            newTx.setAmount(tx.getAmount());
            newTx.setType(tx.getType());
            newTx.setDate(today);
            newTx.setCategory(tx.getCategory());
            newTx.setUserEmail(tx.getUserEmail());
            newTx.setRecurring(false); // cloned txn is one-time
            newTx.setRecurrence(null);
            newTx.setLastProcessedDate(null);

            transactionRepository.save(newTx);

            // Update original
            tx.setLastProcessedDate(today);
            transactionRepository.save(tx);
        }
    }
}
