"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Loading from '@/app/(trang-chu)/loading';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart, Bar, ResponsiveContainer, BarChart } from "recharts";

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {

  return (
    <div className="w-1/2">
      <h1>Khoảng ngày</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="w-full bg-white flex gap-4">
          <DatePicker
            label="Từ ngày"
            value={fromDate}
            onChange={(date) => setFromDate(date)}
            slotProps={{ textField: { fullWidth: true } }}
            format="dd/MM/yyyy"
          />

          <DatePicker
            label="Đến ngày"
            value={toDate}
            onChange={(date) => setToDate(date)}
            slotProps={{ textField: { fullWidth: true } }}
            format="dd/MM/yyyy"
            minDate={fromDate}
          />
        </div>
      </LocalizationProvider>
    </div>
  )
}

const MembershipIncomeChart = ({ data }) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthlyData = months.map((month) => {
    const found = data.find(item => Number(item.month) === month);
    return {
      month: `T${month}`, // Shortened label
      income: found ? Number(found.total_income) : 0,
    };
  });

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          barSize={16}
        >
          <XAxis dataKey="month" fontSize={10} />
          <YAxis
            fontSize={10}
            tickFormatter={(value) => value.toLocaleString("vi-VN")}
          />
          <Tooltip
            formatter={(value) => value.toLocaleString("vi-VN")}
          />
          <Bar dataKey="income" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const page = () => {
  const [currentInvoices, setCurrentInvoices] = useState("post_invoices");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [rangedInvoice, setRangedInvoice] = useState([]);

  const [monthIncomeGraphData, setMonthIncomeGraphData] = useState(null);
  const [monthGraphViewMode, setMonthGraphViewMode] = useState(selectedDate.getMonth() + 1 <= 6 ? 'first-half' : 'second-half');
  const [dayIncomeGraphData, setDayIncomeGraphData] = useState(null);
  const [dayGraphViewMode, setDayGraphViewMode] = useState(selectedDate.getDate() <= 15 ? 'first-half' : 'second-half');
  const [cityTrend, setCityTrend] = useState([]);
  const [districtTrend, setDistrictTrend] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const [membershipInvoices, setMembershipInvoices] = useState([]);
  const [membershipYearIncome, setMembershipYearIncome] = useState([]);

  const [currentMode, setCurrentMode] = useState("month");
  const [loading, setLoading] = useState(true);

  const graph_mode = ['revenue', 'city-trend'];

  const [currentGraphMode, setCurrentGraphMode] = useState(graph_mode[0]);
  const [searchValue, setSearchValue] = useState('')
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const keyTranslations = {
    day_invoices: "Tin đăng trong ngày",
    month_invoices: "Tin đăng trong tháng",
    total_day: "Tổng tiền theo ngày",
    total_month: "Tổng tiền theo tháng",
  };

  const filteredDayData = dayIncomeGraphData?.filter((d) => dayGraphViewMode === 'first-half' ? d.day <= 15 : d.day > 15)
  const filteredMonthData = monthIncomeGraphData?.filter((d) => monthGraphViewMode === 'first-half' ? d.month <= 6 : d.month > 6)

  console.log(selectedDate);

  useEffect(() => {
    if (currentInvoices === 'post_invoices') {
      axios.post(`/api/admin/revenue/getInvoices`, {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      }).then((res) => {
        setInvoices(res.data);
        setLoading(false)
      }).catch((error) => {
        console.log(error);
      });
    } else {
      axios.post(`/api/admin/revenue/getMembershipInvoices`, {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      }).then((res) => {
        setMembershipInvoices(res.data);
        setLoading(false)
      }).catch((error) => {
        console.log(error);
      });
    }

  }, [selectedDate]);

  useEffect(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthData = invoices?.graph_report.month_total_income.find((d) => Number(d.month) === i + 1);
      return {
        month: i + 1,
        total_amount: monthData ? Number(monthData.total_amount) : 0,
      };
    });
    setMonthIncomeGraphData(months);

    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayData = invoices?.graph_report.day_total_income.find((d) => Number(d.day) === i + 1);
      return {
        day: i + 1,
        total_amount: dayData ? Number(dayData.total_amount) : 0,
      };
    });
    setDayIncomeGraphData(days);

    setCityTrend(invoices?.graph_report.city_trend);
  }, [invoices])

  useEffect(() => {
    setMonthGraphViewMode(selectedDate.getMonth() + 1 <= 6 ? "first-half" : "second-half");
    setDayGraphViewMode(selectedDate.getDate() <= 15 ? "first-half" : "second-half");
  }, [selectedDate]);

  useEffect(() => {
    axios.post(`/api/admin/revenue/getCityTrend`, {
      city_name: selectedCity
    }).then((res) => {
      setDistrictTrend(res.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [selectedCity])

  useEffect(() => {
    axios.post(`/api/admin/revenue/getRangedInvoices`, {
      from_date: fromDate ? `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()}` : null,
      to_date: toDate ? `${toDate.getFullYear()}-${toDate.getMonth() + 1}-${toDate.getDate()}` : null,
    }).then((res) => {
      setRangedInvoice(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [fromDate, toDate])

  useEffect(() => {
    const key = currentMode === 'day' ? 'day_invoices' : 'month_invoices';

    if (searchValue.trim() === "") {
      setFilteredInvoices([]);  // Clear filtered invoices if search is empty
    } else {
      if (rangedInvoice.length > 0) {
        const filtered = rangedInvoice.filter(
          (item) => String(item.post_id) === String(searchValue) || item.contact_name.includes(searchValue)
        );
        setFilteredInvoices(filtered);
      } else {
        if (invoices?.text_report[key]) {
          const filtered = invoices.text_report[key]?.filter(
            (item) => String(item.post_id) === String(searchValue) || item.contact_name.includes(searchValue)
          );

          setFilteredInvoices(filtered);
        }
      }
    }
  }, [searchValue, currentMode]);

  useEffect(() => {
    if (currentInvoices === 'membership_invoices') {
      axios.post(`/api/admin/revenue/getMembershipInvoices`, {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      })
        .then((res) => {
          setMembershipInvoices(res.data);
        }).catch((error) => {
          console.log(error);
        })

      axios.post(`/api/admin/revenue/getMembershipYearIncome`, {
        year: selectedDate.getFullYear(),
      }).then((res) => {
        setMembershipYearIncome(res.data);
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [currentInvoices])

  let displayInvoices;

  if (filteredInvoices?.length > 0) {
    displayInvoices = filteredInvoices;
  } else if (searchValue.trim() === "") {
    if (rangedInvoice.length > 0) {
      displayInvoices = rangedInvoice;
    } else {
      displayInvoices = invoices?.text_report[currentMode === "day" ? "day_invoices" : "month_invoices"];
    }
  } else {
    displayInvoices = [];
  }

  const handleSwitchGraphMode = () => {
    setCurrentGraphMode((prevMode) =>
      prevMode === graph_mode[0] ? graph_mode[1] : graph_mode[0]
    );
  }

  const handleExcelExport = async () => {
    console.log("Current mode: ", currentMode);

    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    let dataToSend, fileName;
    if (rangedInvoice.length > 0) {
      dataToSend = rangedInvoice;
      const pad = (num) => String(num).padStart(2, '0');

      const from = new Date(fromDate);
      const to = new Date(toDate);

      // Remove const here, assign to outer fileName
      fileName = `doanh-thu-tin-dang-${pad(from.getDate())}-${pad(from.getMonth() + 1)}-${from.getFullYear()}-${pad(to.getDate())}-${pad(to.getMonth() + 1)}-${to.getFullYear()}.xlsx`;
    } else {
      dataToSend =
        currentMode === 'month'
          ? invoices.text_report.month_invoices
          : invoices.text_report.day_invoices;

      fileName =
        currentMode === 'day'
          ? `doanh-thu-tin-dang-${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}.xlsx`
          : `doanh-thu-tin-dang-${String(month).padStart(2, '0')}-${year}.xlsx`;
    }

    try {
      const response = await axios.post(
        `/api/admin/revenue/export`,
        {
          day: currentMode === 'day' ? day : undefined,
          month,
          year,
          fromDate: rangedInvoice.length > 0 ? fromDate : undefined,
          toDate: rangedInvoice.length > 0 ? toDate : undefined,
          data: dataToSend,
        },
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };


  if (loading) {
    return <Loading />
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex items-center gap-5 p-5 py-8 bg-white border-b shadow">
        <h1 className="text-2xl">Báo cáo doanh thu</h1>
        <select
          onChange={(e) => setCurrentInvoices(e.target.value)}
          className="h-10  py-1 text-sm border rounded-md"
        >
          <option value="post_invoices">Doanh thu tin đăng</option>
          <option value="membership_invoices">Doanh thu hội viên</option>
        </select>
      </div>

      {currentInvoices === 'post_invoices' && (
        <div className='flex'>
          <div className='flex flex-col flex-grow p-5 w-8/12'>
            <ul className={`grid ${rangedInvoice.length > 0 ? 'grid-cols-2' : 'grid-cols-4'} gap-10 justify-center`}>
              {rangedInvoice.length === 0 ? Object.entries(invoices.text_report).map(([key, value], index) => (
                <li key={index} className='h-40 flex flex-col border rounded-lg p-5 bg-white shadow-md text-center items-center'>
                  <h1 className='font-semibold text-lg'>{keyTranslations[key] || key}</h1>
                  <p className='text-2xl font-medium text-red-600 flex flex-col justify-center flex-grow'>{Array.isArray(value) ? value.length : `${Number(value).toLocaleString("de-DE")} đ`}</p>
                </li>
              )) : <>
                <li className='h-40 flex flex-col border rounded-lg p-5 bg-white shadow-md text-center items-center'>
                  <h1 className='font-semibold text-lg'>Tin đăng từ {`${fromDate.getDate()}-${fromDate.getMonth() + 1}-${fromDate.getFullYear()}`} đến {`${toDate.getDate()}-${toDate.getMonth() + 1}-${toDate.getFullYear()}`}</h1>
                  <p className='text-2xl font-medium text-red-600 flex flex-col justify-center flex-grow'>{rangedInvoice.length}</p>
                </li>

                <li className='h-40 flex flex-col border rounded-lg p-5 bg-white shadow-md text-center items-center'>
                  <h1 className='font-semibold text-lg'>Tổng tiền</h1>
                  <p className='text-2xl font-medium text-red-600 flex flex-col justify-center flex-grow'>{Number(rangedInvoice.reduce((acc, invoice) => acc + Number(invoice.amount), 0)).toLocaleString("de-DE")} đ</p>
                </li>
              </>}
            </ul>

            <div className='mt-16 flex items-center justify-between gap-5'>
              <div className='w-1/2'>
                <h1>Ngày</h1>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div className="w-full bg-white">
                    <DatePicker
                      value={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      slotProps={{ textField: { fullWidth: true } }}
                      inputFormat="dd/MM/yyyy"
                    />
                  </div>
                </LocalizationProvider>
              </div>
              <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
              {rangedInvoice.length > 0 && (
                <div className='relative w-12'>
                  <button className='hover:scale-110 transition-all absolute' onClick={() => { setFromDate(null); setToDate(null); setRangedInvoice([]) }}><ArrowPathIcon className='w-7 h-7 text-red-400' /></button>
                </div>
              )}
            </div>

            <div className='border border-gray-300 rounded-lg shadow-lg mt-2 h-full'>
              <div className='flex gap-2 py-4 border-b border-gray-300 bg-white rounded-tl-lg rounded-tr-lg pl-5'>
                <div className='relative flex items-center'>
                  <MagnifyingGlassIcon className='absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5' />
                  <input className='rounded-lg border-gray-300 pl-10' placeholder='Tìm kiếm hóa đơn...' onChange={(e) => setSearchValue(e.target.value)} />
                </div>

                <select className='rounded-lg border-gray-300 shadow' value={currentMode} onChange={(e) => setCurrentMode(e.target.value)}>
                  <option value={"day"}>Ngày</option>
                  <option value={"month"}>Tháng</option>
                </select>

                <div className='flex-grow pr-5'>
                  <button className='float-end rounded-lg border-green-400 border px-4 bg-green-700 text-white shadow h-full hover:scale-105 transition' onClick={handleExcelExport}>
                    Xuất excel
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto h-[470px]">
                {displayInvoices.length > 0 ? (
                  <table className="min-w-full table-auto border-collapse overflow-auto text-sm">
                    <thead>
                      <tr className="text-black bg-gray-200">
                        <th className="px-2 py-3 text-left">Mã hóa đơn</th>
                        <th className=" py-3 text-left">Mã tin đăng</th>
                        <th className=" py-3 text-left">Mã người dùng</th>
                        <th className=" py-3 text-left">Đăng bởi</th>
                        <th className=" py-3 text-left">Giá tiền</th>
                        <th className=" py-3 text-left">Đẩy</th>
                        <th className=" py-3 text-left">Tạo vào ngày</th>
                      </tr>
                    </thead>
                    <tbody className="h-full">
                      {displayInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-100 cursor-pointer h-16">
                          <td className="px-2 py-4">{invoice.id}</td>
                          <td className="py-4">{invoice.post_id}</td>
                          <td className="py-4">{invoice.user_id}</td>
                          <td className="py-4">{invoice.contact_name}</td>
                          <td className="py-4">{Number(invoice.amount).toLocaleString("de-DE")} đ</td>
                          <td className="py-4">{invoice.order === 1 ? "Đã đẩy" : "Chưa đẩy"}</td>
                          <td className="py-4">{new Date(invoice.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex justify-center items-center h-96">
                    <h1 className='text-center text-xl'>Không có dữ liệu tin đăng...</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='w-4/12 bg-white mt-5 mb-5 rounded-lg border shadow flex flex-col'>
            <div className='bg-red-500 flex mt-5 py-2 w-5/6 mx-auto rounded-lg justify-between px-2'>
              <button className='text-white' onClick={handleSwitchGraphMode}><ChevronLeftIcon className='w-7 h-7 stroke-[2]' /></button>
              <h1 className='text-center text-white text-xl font-medium'>{currentGraphMode === 'revenue' ? 'Biểu đồ thống kê doanh thu' : 'Biểu đồ thống kê xu hướng'}</h1>
              <button className='text-white' onClick={handleSwitchGraphMode}><ChevronRightIcon className='w-7 h-7 stroke-[2]' /></button>
            </div>
            <div className='flex flex-col justify-evenly flex-grow'>
              {currentGraphMode === 'revenue' ? (
                <>
                  <div className='mt-10 ml-5 text-xs'>
                    <LineChart width={520} height={250} data={filteredMonthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(tick) => `Tháng ${tick}`} // Convert to "Tháng X"
                        allowDuplicatedCategory={false} // Prevent duplicate labels
                      />
                      <YAxis tickFormatter={(tick) => tick.toLocaleString()} width={70} />
                      <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                      <Line type="monotone" dataKey="total_amount" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                    <div className='flex items-center justify-center gap-5' onClick={() => setMonthGraphViewMode((prev) => prev === 'second-half' ? 'first-half' : 'second-half')} >
                      <h1 className='text-center text-sm'>Doanh thu {monthGraphViewMode === 'first-half' ? 'từ tháng 1 - 6' : 'từ tháng 6 - 12'} / {selectedDate.getFullYear()}</h1>
                      <button className='border p-1 rounded-lg bg-gray-100'>
                        <ChevronRightIcon className={`w-5 h-5 transition-all duration-300 ease-in-out ${monthGraphViewMode === 'second-half' ? 'rotate-180' : null}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className='mt-10 ml-5 text-xs'>
                    <ComposedChart width={520} height={250} data={filteredDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tickFormatter={(tick) => `${tick}`}
                        allowDuplicatedCategory={false}
                      />
                      <YAxis
                        tickFormatter={(tick) => tick.toLocaleString()}
                        width={70}
                      />
                      <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />

                      {/* Bar Graph for Total Income */}
                      <Bar dataKey="total_amount" fill="#82ca9d" />

                      {/* Line Graph for Trends */}
                    </ComposedChart>

                    <div className='flex items-center justify-center gap-5' onClick={() => setDayGraphViewMode((prev) => prev === 'second-half' ? 'first-half' : 'second-half')} >
                      <h1 className='text-center text-sm'>Doanh thu {dayGraphViewMode === 'first-half' ? 'từ ngày 1 - 15' : `từ ngày 15 - ${new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()}`} / {selectedDate.getMonth() + 1}</h1>
                      <button className='border p-1 rounded-lg bg-gray-100'>
                        <ChevronRightIcon className={`w-5 h-5 transition-all duration-300 ease-in-out ${dayGraphViewMode === 'second-half' ? 'rotate-180' : null}`}
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='mt-10 ml-5 text-xs'>
                    <ComposedChart width={520} height={250} data={cityTrend?.slice(0, 5)} onClick={(e) => {
                      if (e && e.activePayload) {
                        const clickedData = e.activePayload[0].payload;
                        console.log("Clicked City:", clickedData.province, "Posts:", clickedData.posts);
                        setSelectedCity(clickedData.province);
                      }
                    }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="province"
                        tickFormatter={(tick) => `${tick}`}
                        allowDuplicatedCategory={false}
                      />
                      <YAxis
                        tickFormatter={(tick) => tick}
                        width={70}
                        domain={[0, 50]} // Set your desired Y-axis range here
                        tickCount={5}   // Optional: controls the number of ticks (0, 1, 2, 3, 4, 5)
                      />
                      <Tooltip formatter={(posts) => `${posts} bài đăng.`} />

                      {/* Bar Graph for Total Income */}
                      <Bar dataKey="posts" fill="#82ca9d" cursor="pointer" />

                      {/* Line Graph for Trends */}
                    </ComposedChart>
                    <h1 className='text-center'>Xu hướng tin đăng trên cả nước</h1>
                  </div>

                  <div className='mt-10 ml-5 text-xs'>
                    <ComposedChart width={520} height={250} data={districtTrend?.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="district"
                        tickFormatter={(tick) => `${tick}`}
                        allowDuplicatedCategory={false}
                      />
                      <YAxis
                        tickFormatter={(tick) => tick}
                        width={70}
                      />
                      <Tooltip formatter={(posts) => `${posts} bài đăng`} />

                      {/* Bar Graph for Total Income */}
                      <Bar dataKey="posts" fill="#82ca9d" />

                      {/* Line Graph for Trends */}
                    </ComposedChart>
                    {selectedCity ? (
                      <h1 className='text-center'>Xu hướng tin đăng tại {selectedCity}</h1>
                    ) : (
                      <h1 className='text-center'>Nhấn vào thanh tương ứng với tên tỉnh/thành ở trên để xem chi tiết xu hướng</h1>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {currentInvoices === 'membership_invoices' && (
        <div className='flex px-5 gap-5'>
          <div className='mt-6 w-3/4 border bg-white p-5 shadow h-[800px] flex flex-col'>
            <div className='flex items-center justify-between gap-5 mb-5'>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="w-full bg-white">
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    slotProps={{ textField: { fullWidth: true } }}
                    inputFormat="dd/MM/yyyy"
                  />
                </div>
              </LocalizationProvider>
            </div>

            <div className='flex-grow overflow-auto'>
              {membershipInvoices.length > 0 ? (
                <table className="min-w-full table-auto border-collapse overflow-auto text-sm">
                  <thead>
                    <tr className="text-black bg-gray-200">
                      <th className="px-1 py-3 text-left">Mã h.đơn</th>
                      <th className=" py-3 text-left">Mã ng.dùng</th>
                      <th className=" py-3 text-left">SĐT</th>
                      <th className=" py-3 text-left">Tên gói</th>
                      <th className=" py-3 text-left">Tổng tiền</th>
                      <th className=" py-3 text-left">Ngày b.đầu</th>
                      <th className=" py-3 text-left">Ngày k.thúc</th>
                    </tr>
                  </thead>
                  <tbody className="h-full">
                    {membershipInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-100 cursor-pointer h-16">
                        <td className="px-2 py-4">{invoice.id}</td>
                        <td className="py-4">{invoice.user_id}</td>
                        <td className="py-4">{invoice.phone_number}</td>
                        <td className="py-4">{invoice.membership_name}</td>
                        <td className="py-4">{Number(invoice.total).toLocaleString("de-DE")} đ</td>
                        <td className="py-4">{new Date(invoice.created_date).toLocaleString()}</td>
                        <td className="py-4">{new Date(invoice.end_date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="mt-5">
                  <h1 className='text-lg'>Không có dữ liệu hóa đơn...</h1>
                </div>
              )}
            </div>
          </div>

          <div className='mt-6 w-1/4 border bg-white p-5 shadow h-[800px]'>
            <div className='w-full h-32 border shadow rounded-lg text-center flex flex-col items-center justify-center gap-5'>
              <h1 className='text-lg'>Số lượng hội viên trong tháng</h1>
              <p className='text-2xl text-red-500'>{membershipInvoices.length}</p>
            </div>

            <div className='w-full h-32 border shadow rounded-lg text-center flex flex-col items-center justify-center gap-5 mt-5'>
              <h1 className='text-lg'>Doanh thu tháng</h1>
              <p className='text-2xl text-red-500'>
                {
                  Number(membershipYearIncome.find(item => Number(item.month) === selectedDate.getMonth() + 1)?.total_income || 0).toLocaleString("de-DE")
                }
                đ
              </p>
            </div>

            <div className='mt-10'>
              <MembershipIncomeChart data={membershipYearIncome} />
              <p className='text-xs text-center text-gray-500'>Doanh thu từ hội viên năm {selectedDate.getFullYear()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
