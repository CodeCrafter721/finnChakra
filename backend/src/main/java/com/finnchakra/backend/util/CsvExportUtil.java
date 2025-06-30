package com.finnchakra.backend.util;

import com.finnchakra.backend.dto.MonthlySummaryDTO;
import com.finnchakra.backend.model.Transaction;

import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

public class CsvExportUtil {

    public static void writeTransactionsToCsv(PrintWriter writer, List<Transaction> transactions) {
        writer.println("ID,Title,Amount,Currency,Type,Date,Category,UserEmail,isRecurring,Recurrence");

        for (Transaction tx : transactions) {
            writer.printf(
                    "%d,%s,%.2f,%s,%s,%s,%s,%s,%b,%s%n",
                    tx.getId(),
                    escape(tx.getTitle()),
                    tx.getAmount(),
                    tx.getCurrency() != null ? tx.getCurrency() : "",
                    tx.getType(),
                    tx.getDate(),
                    escape(tx.getCategory()),
                    tx.getUserEmail(),
                    tx.isRecurring(),
                    tx.getRecurrence() != null ? tx.getRecurrence() : ""
            );
        }
    }

    private static String escape(String field) {
        if (field == null) return "";
        return "\"" + field.replace("\"", "\"\"") + "\"";
    }

    public static void writeMonthlySummariesToCsv(PrintWriter writer, List<MonthlySummaryDTO> summaries) {
        writer.println("Month,Income,Expense,Savings,Categories");

        for (MonthlySummaryDTO dto : summaries) {
            String categoryDetails = dto.getCategoryBreakdown().entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining(" | "));

            writer.printf(
                    "%s,%.2f,%.2f,%.2f,%s%n",
                    dto.getMonth(),
                    dto.getTotalIncome(),
                    dto.getTotalExpense(),
                    dto.getTotalSavings(),
                    categoryDetails
            );
        }
    }
}
