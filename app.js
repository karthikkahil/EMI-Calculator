// Element
const loanPrice = document.querySelector(".loanAmount--price");
// console.log(loanPrice.value);
const loanInterest = document.querySelector(".loanAmount--interest");
const loanTenure = document.querySelector(".loanAmount--tenure");
let selectOption = document.querySelector("#selectOption");
const reload = document.querySelector(".reload");
const emiTable = document.querySelector(".EMI_table");

// Button
const buttonEMI = document.querySelector(".calculate--emi");
const buttonGenerate = document.querySelector(".generate--emi");

// Final
const totalInterest = document.querySelector("#total--interest");
const totalAmount = document.querySelector("#total--amount");
const totalRatePA = document.querySelector("#total--ratePA");
const totalRatePM = document.querySelector("#total--ratePM");

// Funtions

// Tenure period converting

function calcTenure() {
  let calcTenureValue =
    selectOption.value === "month"
      ? 0 + Number(loanTenure.value)
      : Number(loanTenure.value) * 12;
  return calcTenureValue;
}

// Final values store

let monthlyPayment;
let totalInterestPaid;
let totalAmounPaid;

//Emi operation

buttonEMI.addEventListener("click", () => {
  // Math operation

  if (
    (Number(loanPrice.value) &&
      Number(loanInterest.value) &&
      Number(loanTenure.value)) === 0
  ) {
    alert("Please enter some value in Number!");
  } else {
    // Elements
    const principal = Number(loanPrice.value);
    const calculatedInterest = Number(loanInterest.value) / 100 / 12; //0.01125
    const calculatedPayments = calcTenure(); //36

    // FORUMULA
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    // Total Calcaulate:
    let calcEMI = (document.querySelector(".calcEMI").textContent = `₹ ${Number(
      monthly.toFixed(2)
    ).toLocaleString("en-IN")}`);

    monthlyPayment = monthly;

    totalInterestPaid = `${Math.round(
      monthly * calcTenure() - Number(loanPrice.value)
    )}`;

    totalAmounPaid = `${Math.round(monthly * calcTenure())}`;

    // console.log(totalInterestPaid.replace(",", ""));
    // Final updates:

    // Total interest paid
    totalInterest.textContent = `₹ ${Number(totalInterestPaid).toLocaleString(
      "en-IN"
    )}`;

    // Total amount paid
    totalAmount.textContent = `₹ ${Number(totalAmounPaid).toLocaleString(
      "en-IN"
    )}`;

    // Percentage per annum

    const percentageCalc =
      Math.round(monthly * calcTenure() - Number(loanPrice.value)) / 3;

    const percentageCalcFinal = (
      (percentageCalc * (100 / (principal / (calculatedPayments / 12)))) /
      (calculatedPayments / 12)
    ).toFixed(2);

    totalRatePA.textContent = `% ${percentageCalcFinal}`;

    // Percentage per month
    totalRatePM.textContent = `% ${(percentageCalcFinal / 12).toFixed(2)}`;
  }
});

// reload page

reload.addEventListener("click", () => {
  window.location.reload();
});

// Generate EMI

buttonGenerate.addEventListener(
  "click",
  () => {
    // Table elements

    const borderTable = document.querySelector(".border_table");

    // Looping elements
    const start = new Date();
    const end = new Date();
    let monthly = end.setMonth(end.getMonth() + calcTenure());

    // Looping

    let loop = new Date(start);

    const monthList = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthListArray = [];

    while (loop <= end) {
      monthListArray.push(
        `${monthList[loop.getMonth()]}-${loop.getFullYear()}`
      );
      const newDate = loop.setMonth(loop.getMonth() + 1);
      loop = new Date(newDate);
    }
    // Looping elements

    if (calcTenure() === 0) {
      alert("Please enter some value in Number!");
    } else {
      let insertHtml = `
      <thead>
      <tr>
      <th><b>S.no</b></th>
      <th><b> Month</b></th>
      <th><b> Principal</b></th>
      <th><b> Interest</b></th>
      <th><b> EMI payment</b></th>
      <th><b>Balance</b></th>
      </tr>
      </thead>`;

      borderTable.insertAdjacentHTML("afterbegin", insertHtml);

      // Exporting PDF
      const exportPdf = `<div class="btn--ExportPDF">
    <button class="btnExport"  type="button" value="Export" >Export to PDF</button>
    </div>`;

      emiTable.insertAdjacentHTML("beforebegin", exportPdf);

      const btnExport = document.querySelector(".btnExport");

      btnExport.addEventListener("click", (e) => {
        e.preventDefault();
        html2canvas(document.querySelector(".border_table"), {
          onrendered: function (canvas) {
            let data = canvas.toDataURL();
            let docDefinition = {
              content: [
                {
                  image: data,
                  width: 500,
                },
              ],
            };
            pdfMake.createPdf(docDefinition).download("Emi_Calculate.pdf");
          },
        });
      });

      // Exporting PDF
    }

    // Calculating Balance & interest

    let totalBalance = Number(totalAmounPaid - totalInterestPaid);
    // console.log(totalBalance);

    // Calculating Balance & interest

    // Generate EMI table

    for (let i = 1; i <= calcTenure(); i++) {
      let calcInterestValue =
        (totalBalance * (Number(loanInterest.value) / 100)) / 12;

      let calcPrincipalValue = monthlyPayment - calcInterestValue;
      // console.log(calcPrincipalValue);

      totalBalance = totalBalance - calcPrincipalValue;

      let insertHtmlChild = `<tr>
    <td>${i}</td>
    <td>${monthListArray[i - 1]}</td>
    <td>₹ ${Math.round(calcPrincipalValue).toLocaleString("en-IN")}</td>
    <td>₹ ${Math.round(calcInterestValue)}</td>
    <td>₹ ${Math.round(monthlyPayment).toLocaleString("en-IN")}</td>
    <td>₹ ${Math.round(
      (totalBalance = totalBalance > 0 ? totalBalance : 0)
    ).toLocaleString("en-IN")}</td>
    </tr>`;
      borderTable.insertAdjacentHTML("beforeend", insertHtmlChild);
    }

    // Generate EMI table

    //
  },
  { once: true }
);
