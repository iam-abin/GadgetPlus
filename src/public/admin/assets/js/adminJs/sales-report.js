$("#date-wise-report").on("submit", function (e) {
    e.preventDefault();
    swal("do you want to do this", {
        buttots: ["no", "yes"],
    }).then((res) => {
        if (res) {
            $.ajax({
                url: "/admin/sales-report",
                type: "post",
                data: $("#date-wise-report").serialize(),
            }).done((res) => {
                let sales = res.sales;
                $("#defaultReport").remove();

                $("#sales-table").append(
                    '<tbody id="date-wise-report"></tbody>'
                );

                for (let i = 0; i < sales.length; i++) {
                    $("#sales-table").append(
                        `
                        <tr>
                            <td class="text-center">` +
                            (i + 1) +
                            `</td>
                            <td class="text-center"><b>` +
                            sales[i]._id +
                            `</b></td>
                            <td class="text-center">` +
                            sales[i].user +
                            `</td>
                            <td class="text-center">` +
                            sales[i].orderDate +
                            `</td>
                            <td class="text-center">` +
                            sales[i].paymentMethod +
                            `</td>
                            <td class="text-center"><span class="badge rounded-pill alert-warning">` +
                            sales[i].orderStatus +
                            `</span></td>
                            <td class="text-center">` +
                            sales[i].totalAmount +
                            `</td>
                                    
                        </tr>
                        `
                    );
                }

                document.getElementById("salesReportStore").value = sales;
            });
        }
    });
});

$("#pdf").on("click", function (e) {
    e.preventDefault();
    swal("Do you want to download this pdf", {
        buttons: ["No", "Yes"],
    }).then((res) => {
        if (res) {
            event.preventDefault();
            let element = document.getElementById("sales-report");
            const randomNumber = Math.floor(Math.random() * 10000);

            var opt = {
                margin: 0,
                filename: `myfile${randomNumber}.pdf`,
                html2canvas: { scale: 10 },
                jsPDF: {
                    unit: "in",
                    format: "letter",
                    orientation: "portrait",
                },
            };

            html2pdf().set(opt).from(element).save();
        }
    });
});

function ExportToExcel() {
    swal("Do you want to download this Excel Sheet", {
        buttons: ["No", "Yes"],
    }).then((res) => {
        if (res) {
            var elt = document.getElementById("sales-table");
            var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });

            // Adjust column widths
            var ws = wb.Sheets["sheet1"];
            var columnWidths = [
                { wch: 5 }, // Width for column "No"
                { wch: 15 }, // Width for column "Order Id"
                { wch: 20 }, // Width for column "Customer"
                { wch: 15 }, // Width for column "Order Date"
                { wch: 20 }, // Width for column "Payment Method"
                { wch: 15 }, // Width for column "Order Status"
                { wch: 15 }, // Width for column "Total Amount"
            ];

            // Set column widths
            columnWidths.forEach(function (width, index) {
                var col = XLSX.utils.encode_col(index);
                ws["!cols"] = ws["!cols"] || [];
                ws["!cols"][index] = width;
            });

            XLSX.writeFile(wb, "sales-table.xlsx");
        }
    });
}