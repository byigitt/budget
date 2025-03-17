import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Papa from "papaparse";
import { Transaction, Report } from "../types";
import { formatCurrency, formatDateString } from "./format";

/**
 * Export data to CSV format
 */
export const exportToCSV = (
  data: Transaction[],
  filename: string = "transactions"
): void => {
  // Transform data for CSV
  const csvData = data.map((transaction) => ({
    Date: formatDateString(transaction.date),
    Description: transaction.description,
    Amount: transaction.amount,
    Type: transaction.type,
    Category: transaction.categoryId, // This would be enhanced to show category name
    Account: transaction.accountId, // This would be enhanced to show account name
    Tags: transaction.tags.join(", "),
  }));

  // Generate CSV
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Download file
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export report to PDF format
 */
export const exportToPDF = async (
  reportElement: HTMLElement,
  report: Report,
  filename: string = "budget-report"
): Promise<void> => {
  try {
    // Capture the report element as canvas
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add title
    pdf.setFontSize(20);
    pdf.text(report.title, 15, 15);

    // Add date range
    pdf.setFontSize(12);
    pdf.text(
      `Period: ${formatDateString(
        report.dateRange.startDate
      )} - ${formatDateString(report.dateRange.endDate)}`,
      15,
      25
    );

    // Add summary info
    pdf.text(
      `Total Income: ${formatCurrency(report.summary.totalIncome)}`,
      15,
      35
    );
    pdf.text(
      `Total Expenses: ${formatCurrency(report.summary.totalExpenses)}`,
      15,
      42
    );
    pdf.text(
      `Net Savings: ${formatCurrency(report.summary.netSavings)}`,
      15,
      49
    );

    // Add chart image
    const imgWidth = (canvas.width * 180) / canvas.width;
    const imgHeight = (canvas.height * 180) / canvas.width;
    pdf.addImage(imgData, "PNG", 15, 60, imgWidth, imgHeight);

    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

/**
 * Download JSON data
 */
export const downloadJSON = (
  data: Record<string, unknown>,
  filename: string = "data"
): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
