import axios from "axios";
import React, { useState, useEffect } from "react";
import { LuDownload } from "react-icons/lu";

// Input Component
const Input = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value !== undefined && value !== null && !isNaN(value)) {
      setInputValue(Number(value).toLocaleString("de-DE"));
    }
  }, [value]);

  const handleInput = (e) => {
    let raw = e.target.value
      .replace(/[^\d,]/g, "") // Allow digits and comma for decimal
      .replace(/,+/g, ",") // Collapse multiple commas
      .replace(/^,/, ""); // Prevent starting with comma

    // Convert to dot-decimal for JS number parsing
    const numericValue = parseFloat(raw.replace(",", "."));
    setInputValue(raw);
    if (onChange && !isNaN(numericValue)) {
      onChange(numericValue); // Update parent component state
    }
  };

  return (
    <input
      className="w-full border-gray-300 rounded-lg my-2 text-sm"
      type="text"
      inputMode="decimal"
      pattern="[0-9,]*"
      value={inputValue}
      onInput={handleInput}
    />
  );
};

// LoanCalculator Component
const LoanCalculator = () => {
  const [info, setInfo] = useState({
    propertyValue: 3000000000,
    loanPercentage: 50,
    loanMoney: 1500000000,
    loanDuration: 5,
    bankInterestRate: 6,
  });
  const [equity, setEquity] = useState(1500000000);
  const [loanMoney, setLoanMoney] = useState(1500000000);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0);
  const [loanTermMonths, setLoanTermMonths] = useState(0);
  const [monthlyPrincipal, setMonthlyPrincipal] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [firstMonthPayment, setFirstMonthPayment] = useState(0);
  const [loanMode, setLoanMode] = useState("Dư nợ giảm dần");

  const bankInterestRate = [
    { name: "Tùy chọn", rate: 6 },
    { name: "BIDV", rate: 7.5 },
    { name: "Vietcombank", rate: 7.2 },
    { name: "VietinBank", rate: 7.3 },
    { name: "Agribank", rate: 7.0 },
    { name: "Techcombank", rate: 8.2 },
    { name: "VPBank", rate: 9.0 },
    { name: "MB Bank", rate: 7.8 },
    { name: "ACB", rate: 8.7 },
    { name: "Sacombank", rate: 8.5 },
    { name: "TPBank", rate: 8.3 },
    { name: "HDBank", rate: 8.4 },
    { name: "SHB", rate: 8.8 },
    { name: "OCB", rate: 8.6 },
    { name: "Eximbank", rate: 8.9 },
    { name: "SCB", rate: 9.1 },
    { name: "LienVietPostBank", rate: 8.0 },
    { name: "VIB", rate: 8.4 },
    { name: "ABBANK", rate: 9.5 },
    { name: "PVcomBank", rate: 9.2 },
    { name: "SeABank", rate: 8.8 },
    { name: "Nam A Bank", rate: 8.7 },
    { name: "Bac A Bank", rate: 8.3 },
    { name: "KienlongBank", rate: 8.5 },
    { name: "BaoViet Bank", rate: 8.6 },
    { name: "NCB", rate: 9.0 },
  ];
  useEffect(() => {
    calculateLoan(info, loanMode);
  }, [info, loanMode]);

  const calculateLoan = (info, loanMode) => {
    const calculatedEquity = info.propertyValue * (info.loanPercentage / 100);
    const calculatedLoanMoney = info.propertyValue - calculatedEquity;
    const calculatedMonthlyInterestRate = info.bankInterestRate / 100 / 12;
    const calculatedLoanTermMonths = info.loanDuration * 12;

    if (loanMode === "Dư nợ giảm dần") {
      const calculatedMonthlyPrincipal =
        calculatedLoanMoney / calculatedLoanTermMonths;
      let calculatedTotalInterest = 0;
      for (let i = 0; i < calculatedLoanTermMonths; i++) {
        const remaining = calculatedLoanMoney - calculatedMonthlyPrincipal * i;
        const interest = remaining * calculatedMonthlyInterestRate;
        calculatedTotalInterest += interest;
      }

      const calculatedTotalPayment =
        calculatedLoanMoney + calculatedTotalInterest;
      const calculatedFirstMonthPayment =
        calculatedMonthlyPrincipal +
        calculatedLoanMoney * calculatedMonthlyInterestRate;

      setEquity(calculatedEquity);
      setLoanMoney(calculatedLoanMoney);
      setMonthlyInterestRate(calculatedMonthlyInterestRate);
      setLoanTermMonths(calculatedLoanTermMonths);
      setMonthlyPrincipal(calculatedMonthlyPrincipal);
      setTotalInterest(calculatedTotalInterest);
      setTotalPayment(calculatedTotalPayment);
      setFirstMonthPayment(calculatedFirstMonthPayment);
    } else if (loanMode === "Trả lãi chia đều") {
      const totalInterest =
        calculatedLoanMoney *
        calculatedMonthlyInterestRate *
        calculatedLoanTermMonths;
      const monthlyInterest = totalInterest / calculatedLoanTermMonths;
      const monthlyPrincipal = calculatedLoanMoney / calculatedLoanTermMonths;
      const monthlyPayment = monthlyPrincipal + monthlyInterest;
      const totalPayment = monthlyPayment * calculatedLoanTermMonths;

      setEquity(calculatedEquity);
      setLoanMoney(calculatedLoanMoney);
      setMonthlyInterestRate(calculatedMonthlyInterestRate);
      setLoanTermMonths(calculatedLoanTermMonths);
      setMonthlyPrincipal(monthlyPrincipal);
      setTotalInterest(totalInterest);
      setTotalPayment(totalPayment);
      setFirstMonthPayment(monthlyPayment);
    }
  };

  const handleLoanPercentageChange = (value) => {
    const loanMoney = info.propertyValue * (value / 100);
    setInfo((prev) => ({
      ...prev,
      loanPercentage: value,
      loanMoney: loanMoney, // Adjust loanMoney based on new loanPercentage
    }));
  };

  const handleLoanMoneyChange = (value) => {
    const loanPercentage = (value / info.propertyValue) * 100;
    setInfo((prev) => ({
      ...prev,
      loanMoney: value,
      loanPercentage: loanPercentage, // Adjust loanPercentage based on new loanMoney
    }));
  };

  const handleInputChange = (field) => (value) => {
    setInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownloadPlan = () => {
    axios
      .post(
        "/api/utilities/exportLoanExcel",
        { info, loanMode },
        { responseType: "blob" }
      ) // <-- important: responseType 'blob'
      .then(async (res) => {
        const blob = await res.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "loan_schedule.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log(info);

  return (
    <div className="flex gap-10 items-start">
      <div className="w-1/2">
        <label className="text-sm">Giá trị nhà đất</label>
        <div className="relative flex-col flex w-full">
          <Input
            value={info.propertyValue}
            onChange={handleInputChange("propertyValue")}
          />
          <p className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">đ</p>
        </div>

        <div className="flex gap-2 w-full items-end">
          <div className="w-1/2">
            <label className="text-sm">Tỉ lệ vay</label>
            <div className="relative">
              <Input
                value={info.loanPercentage.toFixed(1)}
                onChange={handleLoanPercentageChange}
              />
              <p className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                %
              </p>
            </div>
          </div>
          <div className="w-1/2 flex-col flex">
            <label className="text-sm">Số tiền vay</label>
            <div className="relative">
              <Input value={info.loanMoney} onChange={handleLoanMoneyChange} />
              <p className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                đ
              </p>
            </div>
          </div>
        </div>

        <div className="flex-col flex w-full">
          <label className="text-sm">Thời hạn vay</label>
          <div className="relative">
            <Input
              value={info.loanDuration}
              onChange={handleInputChange("loanDuration")}
            />
            <p className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              năm
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-end w-full">
          <div className="w-3/4 flex-col flex">
            <label className="text-sm">Lãi suất theo ngân hàng %/năm</label>
            <select
              className="rounded-lg border border-gray-300 my-2 text-sm"
              value={info.bankInterestRate}
              onChange={(e) =>
                setInfo((prev) => ({
                  ...prev,
                  bankInterestRate: parseFloat(e.target.value),
                }))
              }
            >
              {bankInterestRate.map((item, index) => (
                <option key={index} value={item.rate}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/4 relative">
            <Input value={info.bankInterestRate} />
            <p className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              %
            </p>
          </div>
        </div>

        <div className="flex-col flex w-full">
          <label className="text-sm">Loại hình</label>
          <select
            className="rounded-lg border border-gray-300 my-2 text-sm"
            onChange={(e) => setLoanMode(e.target.value)}
          >
            <option value={"Dư nợ giảm dần"}>Dư nợ giảm dần</option>
            <option value={"Trả lãi chia đều"}>Trả lãi chia đều</option>
          </select>
        </div>
      </div>

      <div className="w-1/2 border px-5 py-7 shadow rounded-lg">
        <h1 className="text-sm">Tổng số tiền bạn cần phải trả</h1>
        <p className="text-2xl font-medium my-2">
          {(
            (equity + loanMoney + Math.round(totalInterest)) /
            1000000000
          ).toFixed(2)}{" "}
          tỷ
        </p>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full relative flex gap-0.5 mt-3 mb-8">
          {/* Equity */}
          <div
            className="h-full rounded-full relative"
            style={{
              width: `${
                (equity / (equity + loanMoney + totalInterest)) * 100
              }%`,
              backgroundColor: "green", // Customize the color for equity
            }}
          >
            <p className="absolute left-1/2 -translate-x-1/2 top-1 text-green-700 text-xs">
              {((equity / (equity + loanMoney + totalInterest)) * 100).toFixed(
                1
              )}
              %
            </p>
          </div>

          {/* Loan Money */}
          <div
            className="h-full rounded-full relative"
            style={{
              width: `${
                (loanMoney / (equity + loanMoney + totalInterest)) * 100
              }%`,
              backgroundColor: "purple", // Customize the color for loanMoney
            }}
          >
            <p className="absolute left-1/2 -translate-x-1/2 top-1 text-purple-700 text-xs">
              {(
                (loanMoney / (equity + loanMoney + totalInterest)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>

          {/* Total Interest */}
          <div
            className="h-full rounded-full relative"
            style={{
              width: `${
                (totalInterest / (equity + loanMoney + totalInterest)) * 100
              }%`,
              backgroundColor: "orange", // Customize the color for totalInterest
            }}
          >
            <p className="absolute left-1/2 -translate-x-1/2 top-1 text-orange-700 text-xs">
              {(
                (totalInterest / (equity + loanMoney + totalInterest)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {[
            {
              name: "Vốn tự có",
              color: `border-green-700`,
              value: equity.toLocaleString(),
            },
            {
              name: "Gốc cần trả",
              color: `border-purple-700`,
              value: loanMoney.toLocaleString(),
            },
            {
              name: "Lãi cần trả",
              color: `border-orange-300`,
              value: Math.round(totalInterest).toLocaleString(),
            },
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between py-1 text-xs`}
            >
              <div className="flex gap-2">
                <span className={`${item.color} border`}></span>
                <h1>{item.name}</h1>
              </div>
              {item.value} đ
            </li>
          ))}
          <li className="h-1"></li>
          <li className="text-center border-y p-2 border-gray-400">
            Thanh toán tháng đầu:{" "}
            {Math.round(firstMonthPayment).toLocaleString()} đ
          </li>
        </ul>

        <button
          className="w-full mt-7 border-red-500 border py-1 text-sm font-medium text-red-500 rounded-md flex items-center justify-center gap-2"
          onClick={handleDownloadPlan}
        >
          <LuDownload /> Chi tiết kế hoạch tài chính
        </button>
      </div>
    </div>
  );
};

export default LoanCalculator;
