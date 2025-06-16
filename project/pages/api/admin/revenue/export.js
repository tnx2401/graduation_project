import ExcelJS from "exceljs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { day, month, year, fromDate, toDate, data } = req.body;

    let sheetTitle = "";
    if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        sheetTitle = `Doanh thu tin đăng ${from.getDate()}-${from.getMonth() + 1}-${from.getFullYear()} đến ${to.getDate()}-${to.getMonth() + 1}-${to.getFullYear()}`;
    } else if (day) {
        sheetTitle = `Doanh thu tin đăng ${day}-${month}-${year}`;
    } else {
        sheetTitle = `Doanh thu tin đăng ${month}-${year}`;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetTitle);

    // Define columns first (headers go to row 1 by default)
    worksheet.columns = [
        { header: "Mã hóa đơn", key: "invoice_id", width: 15 },
        { header: "Mã tin đăng", key: "post_id", width: 15 },
        { header: "Mã người dùng", key: "user_id", width: 50 },
        { header: "Người đăng", key: "username", width: 25 },
        { header: "Giá tiền", key: "price", width: 20 },
    ];

    // Insert an empty row at the very top (row 1), so headers move down to row 2
    worksheet.spliceRows(1, 0, []);

    // Now merge cells A1:E1 for your title
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = sheetTitle;
    titleCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF007ACC' }, // same blue as header background or whatever you want
    };

    // Style header row now at row 2
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF007ACC" },
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Add data rows starting from row 3
    data.forEach((invoice) => {
        worksheet.addRow({
            invoice_id: invoice.id,
            post_id: invoice.post_id,
            user_id: invoice.user_id,
            username: invoice.contact_name,
            price: Number(invoice.amount),
        });
    });

    // Format price column as currency
    worksheet.getColumn("price").numFmt = '#,##0" ₫"';

    // Add total row at the right place (after data)
    const totalRowIndex = data.length + 3; // data starts at row 3
    worksheet.getCell(`D${totalRowIndex}`).value = "Tổng cộng:";
    worksheet.getCell(`D${totalRowIndex}`).font = { bold: true };
    worksheet.getCell(`E${totalRowIndex}`).value = {
        formula: `SUM(E3:E${totalRowIndex - 1})`,
        result: data.reduce((sum, i) => sum + Number(i.amount), 0),
    };
    worksheet.getCell(`E${totalRowIndex}`).numFmt = '#,##0" ₫"';
    worksheet.getCell(`E${totalRowIndex}`).font = { bold: true };

    // Borders for data rows and total row
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 2) return; // skip title row
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    let formattedFilename = "";
    if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const pad = (num) => String(num).padStart(2, "0");
        formattedFilename = `doanh-thu-${pad(from.getDate())}-${pad(from.getMonth() + 1)}-${from.getFullYear()}-den-${pad(to.getDate())}-${pad(to.getMonth() + 1)}-${to.getFullYear()}.xlsx`;
    } else if (day) {
        formattedFilename = `doanh-thu-${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}.xlsx`;
    } else {
        formattedFilename = `doanh-thu-${String(month).padStart(2, "0")}-${year}.xlsx`;
    }

    res.setHeader("Content-Disposition", `attachment; filename=${formattedFilename}`);

    await workbook.xlsx.write(res);
    res.end();
}
