// pages/api/exportLoanExcel.js

import ExcelJS from "exceljs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { info, loanMode } = req.body;

  const { loanMoney, loanDuration, bankInterestRate } = info;

  const totalMonths = loanDuration * 12;
  const monthlyPrincipal = loanMoney / totalMonths;
  const monthlyInterestRate = bankInterestRate / 100 / 12;

  // Create workbook and sheet
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Loan Schedule");

  sheet.columns = [
    { header: "Tháng", width: 10 },
    { header: "Dư nợ đầu kỳ (VND)", width: 20 },
    { header: "Tiền gốc (VND)", width: 18 },
    { header: "Tiền lãi (VND)", width: 18 },
    { header: "Tổng trả (VND)", width: 20 },
    { header: "Dư nợ cuối kỳ (VND)", width: 20 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  let remaining = loanMoney;

  if (loanMode === "Trả lãi chia đều") {
    const totalInterest = loanMoney * monthlyInterestRate * totalMonths;
    const monthlyInterest = totalInterest / totalMonths;
    const monthlyPayment = monthlyPrincipal + monthlyInterest;

    for (let i = 1; i <= totalMonths; i++) {
      const endBalance = remaining - monthlyPrincipal;

      sheet.addRow([
        i,
        Math.round(remaining).toLocaleString("de-DE"),
        Math.round(monthlyPrincipal).toLocaleString("de-DE"),
        Math.round(monthlyInterest).toLocaleString("de-DE"),
        Math.round(monthlyPayment).toLocaleString("de-DE"),
        Math.round(endBalance).toLocaleString("de-DE"),
      ]);

      remaining = endBalance;
    }
  } else {
    // Default to "Dư nợ giảm dần"
    for (let i = 1; i <= totalMonths; i++) {
      const interest = remaining * monthlyInterestRate;
      const totalPayment = monthlyPrincipal + interest;
      const endBalance = remaining - monthlyPrincipal;

      sheet.addRow([
        i,
        Math.round(remaining).toLocaleString("de-DE"),
        Math.round(monthlyPrincipal).toLocaleString("de-DE"),
        Math.round(interest).toLocaleString("de-DE"),
        Math.round(totalPayment).toLocaleString("de-DE"),
        Math.round(endBalance).toLocaleString("de-DE"),
      ]);

      remaining = endBalance;
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();

  res.setHeader("Content-Disposition", "attachment; filename=loan_schedule.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.status(200).send(buffer);
}
