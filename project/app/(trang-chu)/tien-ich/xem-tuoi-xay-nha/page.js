'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear + i);

    const [birthYear, setBirthYear] = useState('');
    const [buildYear, setBuildYear] = useState(currentYear);
    const [rawData, setRawData] = useState(null);
    const [formattedData, setFormattedData] = useState(null);
    const [inputError, setInputError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setInputError('');
        const age = currentYear - Number(birthYear);

        if (!birthYear) {
            setInputError('Vui lòng nhập năm sinh');
            return;
        }
        if (age < 18 || age > 75) {
            setInputError('Năm sinh không hợp lệ');
            return;
        }

        setLoading(true);
        axios
            .post('/api/utilities/xemTuoiXayNha', {
                age: birthYear,
                build_year: buildYear,
            })
            .then((res) => { setRawData(res.data); setLoading(false) })
            .catch(() => setInputError('Lỗi kết nối hoặc dữ liệu'));
    };

    const parseStringData = (rawString) => {

        try {
            // Extract title
            const titleMatch = rawString.match(/^([^1]+?)(?=1\.)/);
            const title = titleMatch ? titleMatch[1].trim() : "";

            // Extract personal info
            const age2025Match = rawString.match(/bao nhiêu tuổi.*?(\d+)/);
            const birthYearMatch = rawString.match(/Năm sinh \(DL\).*?(\d{4})/);
            const elementMatch = rawString.match(/Xem mệnh ngũ hành\s*(.*?)\s*(?=\n|Gia chủ|$)/);
            const destinyMatch = rawString.match(/Gia chủ thuộc mệnh\s*(.*?)\s*(?=\n|Năm dự kiến|$)/);
            const buildYearMatch = rawString.match(/Năm dự kiến làm nhà.*?(Năm \d+.*?\))/);
            const yearDestinyMatch = rawString.match(/\d+\s+thuộc mệnh\s+(.+?)(?=\n|$)/);

            // Extract analysis
            const tamTaiMatch = rawString.match(/Tam tai\s+(.*?)(?=Kim Lâu|$)/s);
            const kimLauMatch = rawString.match(/Kim Lâu\s+(.*?)(?=Hoang ốc|$)/s);
            const hoangOcMatch = rawString.match(/Hoang ốc\s+(.*?)(?=Kết luận|$)/s);
            const conclusionMatch = rawString.match(/Kết luận\s+(.*?)(?=Xem tử vi|$)/s);

            // Extract borrow ages table
            const tableMatch = rawString.match(/Năm sinh\s+Tuổi\s+tam tai\s+Hoàng ốc\s+Kim lâu(.*?)(?=Tóm lại|$)/s);
            const borrowAges = [];
            if (tableMatch) {
                const rows = tableMatch[1].split('\n').filter(row => row.trim() && /^\d{4}/.test(row.trim()));
                rows.forEach(row => {
                    const parts = row.trim().split(/\s+/);
                    if (parts.length >= 6) {
                        borrowAges.push({
                            year: parseInt(parts[0]),
                            zodiac: parts[1] + ' ' + parts[2],
                            age: parseInt(parts[3]),
                            tamTai: parts[4],
                            hoangOc: parts[5],
                            kimLau: parts[6] || parts[5]
                        });
                    }
                });
            }

            // Extract good years
            const goodYearsMatch = rawString.match(/Năm tốt làm nhà\s+Luận giải chi tiết(.*?)$/s);
            const goodYears = [];
            if (goodYearsMatch) {
                const yearRows = goodYearsMatch[1].split('\n').filter(row => row.trim() && /^\d{4}/.test(row.trim()));
                yearRows.forEach(row => {
                    const parts = row.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        goodYears.push({
                            year: parseInt(parts[0]),
                            description: parts.slice(1).join(' ')
                        });
                    }
                });
            }

            return {
                title: title,
                personalInfo: {
                    age2025: age2025Match ? parseInt(age2025Match[1]) : null,
                    birthYear: birthYearMatch ? parseInt(birthYearMatch[1]) : null,
                    element: elementMatch ? elementMatch[1].trim() : "",
                    destiny: destinyMatch ? destinyMatch[1].trim() : "",
                    buildYear: buildYearMatch ? buildYearMatch[1].trim() : "",
                    yearDestiny: yearDestinyMatch ? yearDestinyMatch[1].trim() : ""
                },
                analysis: {
                    tamTai: {
                        status: tamTaiMatch && tamTaiMatch[1].includes('phạm đại kỵ') ? "bad" : "good",
                        description: tamTaiMatch ? tamTaiMatch[1].trim() : ""
                    },
                    kimLau: {
                        status: kimLauMatch && !kimLauMatch[1].includes('Không phạm') ? "bad" : "good",
                        description: kimLauMatch ? kimLauMatch[1].trim() : ""
                    },
                    hoangOc: {
                        status: hoangOcMatch && hoangOcMatch[1].includes('Tứ Tấn Tài') ? "good" : "bad",
                        description: hoangOcMatch ? hoangOcMatch[1].trim() : ""
                    }
                },
                conclusion: conclusionMatch ? conclusionMatch[1].trim() : "",
                borrowAges: borrowAges,
                goodYears: goodYears
            };
        } catch (error) {
            console.error('Error parsing string data:', error);
            return null;
        }
    };

    const StatusIcon = ({ status }) => {
        return status === 'good' || status === 'Tốt' ?
            <span className="text-green-500">✅</span> :
            <span className="text-red-500">❌</span>;
    };


    useEffect(() => {
        if (rawData) {
            const parsed = parseStringData(rawData.content);
            setFormattedData(parsed);
        }
    }, [rawData]);

    return (
        <div className="max-w-5xl h-screen mx-auto px-4 py-10">
            <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
                Xem tuổi xây dựng, cải tạo nhà
            </h1>

            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6 border max-w-xl mx-auto">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Năm sinh của gia chủ
                    </label>
                    <input
                        type="number"
                        placeholder="Ví dụ: 1995"
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                    />
                    {inputError && <p className="text-red-600 px-2 pt-2">{inputError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Năm dự kiến khởi công
                    </label>
                    <select
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={buildYear}
                        onChange={(e) => setBuildYear(Number(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition flex justify-center items-center"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex gap-1 items-center">
                            <span>Đang xử lý</span>
                            <span className="animate-bounce [animation-delay:0s]">.</span>
                            <span className="animate-bounce [animation-delay:0.15s]">.</span>
                            <span className="animate-bounce [animation-delay:0.3s]">.</span>
                        </div>
                    ) : (
                        "Xem kết quả"
                    )}
                </button>
            </div>

            <div className='h-[550px] overflow-auto border shadow my-10 p-2'>
                {formattedData && (
                    <div className="space-y-8 mt-10">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-center">{formattedData.title}</h2>

                        {/* Personal Information */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 border">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">1. THÔNG TIN NGƯỜI SINH NĂM {formattedData.personalInfo.birthYear}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <tbody>
                                        <tr className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">Năm 2025 bao nhiêu tuổi (theo âm lịch)</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.personalInfo.age2025}</td>
                                        </tr>
                                        <tr className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">Năm sinh (DL)</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.personalInfo.birthYear}</td>
                                        </tr>
                                        <tr className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">Xem mệnh ngũ hành</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.personalInfo.element}</td>
                                        </tr>
                                        <tr className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">Gia chủ thuộc mệnh</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.personalInfo.destiny}</td>
                                        </tr>
                                        <tr className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">Năm dự kiến làm nhà</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.personalInfo.buildYear}</td>
                                        </tr>
                                        <tr className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">2025 thuộc mệnh</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.personalInfo.yearDestiny}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 border">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">2. BÌNH GIẢI TỐT XẤU XEM TUỔI LÀM NHÀ</h3>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">
                                    Dù là công việc động thổ, cải tạo hay xây cất thì gia chủ tuổi Quý Mùi đều cần phải xem xét việc tuổi của mình có phạm phải hạn kỵ làm nhà hay không.
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <strong>Hạn Tam Tai:</strong> Nếu gặp hạn Tam Tai làm nhà thì vận xui đưa tới, tai họa khó lường và gia đạo không được may mắn.
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <strong>Hạn Hoang Ốc:</strong> Hoang Ốc mang ý nghĩa về sự hoang vắng, lạnh lẽo vì thế làm nhà vào năm hạn này sinh khí giảm, gia đạo bất lợi.
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <strong>Hạn Kim Lâu:</strong> Đây là hạn nếu làm nhà sức khỏe gia đạo bị ảnh hưởng.
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-lg font-semibold mb-3">Phân tích cho gia chủ tuổi {formattedData.personalInfo.birthYear} trong năm {buildYear}:</h4>

                            <div className="overflow-x-auto mb-6">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Hạn tuổi</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Giải thích</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold">Tam Tai</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.analysis.tamTai.description}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold">Kim Lâu</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.analysis.kimLau.description}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold">Hoang Ốc</td>
                                            <td className="border border-gray-300 px-4 py-2">{formattedData.analysis.hoangOc.description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                <h4 className="text-lg font-semibold text-black mb-2">KẾT LUẬN</h4>
                                <p className="text-black">{formattedData.conclusion}</p>
                            </div>
                        </div>

                        {/* Borrow Ages Table */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 border">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">3. BẢNG TÍNH MƯỢN TUỔI LÀM NHÀ</h3>
                            <h4 className="text-lg font-semibold mb-3">Bảng các tuổi không phạm hạn trong năm {buildYear}:</h4>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Năm sinh</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Tuổi</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Tam Tai</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Hoàng Ốc</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Kim Lâu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formattedData.borrowAges.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {item.year} ({item.zodiac})
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">{item.age}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <StatusIcon status={item.tamTai} /> {item.tamTai}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <StatusIcon status={item.hoangOc} /> {item.hoangOc}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <StatusIcon status={item.kimLau} /> {item.kimLau}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Summary */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">📚 Tóm lại</h4>
                            <p className="text-gray-700 mb-4">
                                Trên đây là công cụ "xem tuổi gia chủ năm {buildYear} có tốt không" và cách hướng dẫn chọn tuổi cũng như cách mượn tuổi làm nhà năm {buildYear}.
                                Chúc quý gia chủ coi được tuổi hợp với mình để xây cất ngôi nhà gặp nhiều may mắn, hóa rủi thành may, công việc kinh doanh không bị ảnh hưởng, làm ăn phát tài phát lộc.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
