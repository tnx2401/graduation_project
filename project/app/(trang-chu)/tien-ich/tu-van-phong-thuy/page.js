"use client";
import React, { useEffect, useState } from 'react'
import pathFunction from '@/components/general_page/shared/pathFunction';
import axios from 'axios';

export const parseFengShuiData = (rawData) => {
  if (!rawData) return null;

  const parsePersonalInfo = (detail) => {
    const defaultInfo = {
      birthYear: "Quý Mùi (2003)",
      element: "Mộc (Dương liễu mộc)",
      palace: {
        male: "Nam Càn",
        female: "Nữ cung Ly",
      },
      fortuneYear: "2025 (Canh Tý)",
      gender: "Nam",
    };

    if (!detail) return defaultInfo;

    const info = { ...defaultInfo };

    const extractField = (label, text, nextLabelRegex) => {
      const regex = new RegExp(`${label}:\\s*([^]*?)${nextLabelRegex.source ? `(?=${nextLabelRegex.source})` : ''}`, 's');
      const match = text.match(regex);
      return match ? match[1].replace(/\s+/g, ' ').trim() : null;
    };

    info.birthYear = extractField('Năm sinh âm lịch', detail, /Giới tính:/) || info.birthYear;
    info.gender = extractField('Giới tính', detail, /Ngũ hành|Cung phi:/) || info.gender;
    info.element = extractField('Ngũ hành bản mệnh', detail, /Cung phi:/) || info.element;

    const palaceText = extractField('Cung phi', detail, /Năm xem|$/);
    if (palaceText) {
      const maleMatch = palaceText.match(/Nam\s+([^\/\n]*)/);
      const femaleMatch = palaceText.match(/Nữ\s+cung\s+([^]*)/);
      info.palace = {
        male: maleMatch ? `Nam ${maleMatch[1].trim()}` : info.palace.male,
        female: femaleMatch ? `Nữ cung ${femaleMatch[1].trim()}` : info.palace.female,
      };
    }

    info.fortuneYear = extractField('Năm xem sao chiếu mệnh', detail, /Luận xem|$|$/) || info.fortuneYear;

    return info;
  };

  const parseDirections = (content) => {
    if (!content) return { directions: [], conclusion: '' };

    const result = {
      directions: [],
      conclusion: '',
    };

    // Extract and remove "Kết luận"
    const conclusionMatch = content.match(/Kết luận[\s:-]*(.*)/s);
    if (conclusionMatch) {
      const rawConclusion = conclusionMatch[1]
        .split(/Tuy nhiên|Để xem/i)[0]
        .trim();

      const firstSentence = rawConclusion.match(/^(.*?[.!?])\s/);
      result.conclusion = firstSentence ? firstSentence[1].trim() : rawConclusion;

      // Remove conclusion from original content
      content = content.replace(/Kết luận[\s:-]*(.*)/s, '');
    }

    // Extract each direction entry
    const entries = content.split(/(?=\d+\s+[^\d])/);
    for (const entry of entries) {
      if (!entry.trim()) continue;

      const rankMatch = entry.match(/^(\d+)/);
      const nameDirectionMatch = entry.match(/\d+\s+([^(]+)\(([^)]+)\)/);
      const contentMatch = entry.match(/\([^)]+\)\s*-\s*(.*)/s);

      if (!rankMatch || !nameDirectionMatch) continue;

      const rank = parseInt(rankMatch[1]);
      const name = nameDirectionMatch[1].trim();
      const direction = nameDirectionMatch[2].trim();
      const contentText = contentMatch ? contentMatch[1].trim() : '';

      const [descriptionRaw, analysisRaw] = contentText.split(/Từ Cửa|(?<=\.)\s*-\s*Từ/);
      const description = (descriptionRaw || '').replace(/^[\s-]+/, '').replace(/\s*-\s*$/, '').trim();
      const analysis = analysisRaw ? `Từ Cửa${analysisRaw.trim()}` : '';

      const contentLower = contentText.toLowerCase();
      let status = 'neutral';
      if (
        /phát đạt|giàu có|sang trọng|quang minh|phú quý|hiền lương/.test(contentLower)
      ) {
        status = /Phục vị|Diên niên/.test(name) ? 'excellent' : 'good';
      } else if (
        /bại|sát|tuyệt|chết|tai họa|dâm đãng/.test(contentLower)
      ) {
        status = 'bad';
      }

      result.directions.push({
        rank,
        name,
        direction,
        description,
        analysis,
        status,
      });
    }

    result.directions = result.directions
      .sort((a, b) => a.rank - b.rank)
      .filter(d =>
        ["Sinh Khí", "Diên niên", "Thiên Y", "Phục vị"].includes(d.name.trim())
      );
    return result;
  };

  const male = parseDirections(rawData.line2);
  const female = parseDirections(rawData.line3);

  return {
    personalInfo: parsePersonalInfo(rawData.detail),
    maleDirections: male.directions,
    maleConclusion: male.conclusion,
    femaleDirections: female.directions,
    femaleConclusion: female.conclusion,
    description: rawData.description,
  };
};

const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
  switch (status) {
    case 'excellent':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'bad':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'neutral':
      return `${baseClasses} bg-gray-100 text-gray-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'excellent': return 'Tốt';
    case 'bad': return 'Xấu';
    case 'neutral': return 'Trung tính';
    default: return 'Không xác định';
  }
};

const DirectionCard = ({ direction, index }) => (
  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
          {direction.rank}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">{direction.name}</h3>
          <p className="text-gray-600 text-sm">{direction.direction}</p>
        </div>
      </div>
      <span className={getStatusBadge(direction.status)}>
        {getStatusText(direction.status)}
      </span>
    </div>

    {direction.description && (
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-relaxed">{direction.description}</p>
      </div>
    )}

    {direction.analysis && (
      <div className="bg-gray-50 rounded p-3">
        <p className="text-gray-600 text-sm font-medium">{direction.analysis}</p>
      </div>
    )}
  </div>
);

const page = () => {
  const [birthYear, setBirthYear] = useState("");
  const [houseDirection, setHouseDirection] = useState("1");
  const [gender, setGender] = useState("nam");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');

  const getCanChi = (year) => {
    const canList = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const chiList = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

    const canIndex = (Number(year) + 6) % 10;
    const chiIndex = (Number(year) + 8) % 12;

    return `${canList[canIndex]} ${chiList[chiIndex]}`;
  }

  const handleSubmit = () => {
    if (!birthYear) {
      setInputError("Vui lòng nhập năm sinh.");
      return;
    }

    if (Number(birthYear) < 1900 || Number(birthYear) > new Date().getFullYear()) {
      setInputError("Năm sinh không hợp lệ.");
      return;
    }

    setInputError("");
    setLoading(true);
    axios.post(`/api/utilities/xemHuongNha`, {
      nam_sinh: pathFunction.convertToSlug(getCanChi(birthYear)),
      gioi_tinh: gender,
      huong: houseDirection
    }).then((res) => {
      setResult(parseFengShuiData(res.data));
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    })
  }


  console.log(result);

  useEffect(() => {

  }, [result])

  return (
    <div className="max-w-5xl h-screen mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Xem tuổi xây dựng, cải tạo nhà
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6 border max-w-xl mx-auto mb-10">
        <div>
          <div className="flex items-center gap-6">
            <div className='w-2/3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Năm sinh của gia chủ
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 1995"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value);
                  setInputError("");
                }}
              />
              {inputError && <p className="text-sm text-red-500 mt-1">{inputError}</p>}
            </div>
            <div className="flex gap-4 items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="nam"
                  checked={gender === 'nam'}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Nam</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="nu"
                  checked={gender === 'nu'}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Nữ</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hướng nhà
          </label>
          <select
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={houseDirection}
            onChange={(e) => setHouseDirection(e.target.value)}
          >
            {[
              { value: "1", name: "Khảm - Chính Bắc" },
              { value: "2", name: "Khôn - Tây Nam" },
              { value: "3", name: "Chấn - Chính Đông" },
              { value: "4", name: "Tốn - Đông Nam" },
              { value: "6", name: "Càn - Tây Bắc" },
              { value: "7", name: "Đoài - Chính Tây" },
              { value: "8", name: "Cấn - Đông Bắc" },
              { value: "9", name: "Ly - Chính Nam" }].map((item, index) => (
                <option key={index} value={item.value}>{item.name}</option>
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
        {result && (
          <div className="max-w-4xl mx-auto min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Phân Tích Hướng Nhà Phong Thủy</h1>
                <p className="text-gray-600">Theo tuổi và mệnh của gia chủ</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông Tin Cá Nhân</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Năm sinh:</span>
                      <span className="font-medium text-gray-900">{result.personalInfo.birthYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngũ hành:</span>
                      <span className="font-medium text-gray-900">{result.personalInfo.element}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giới tính:</span>
                      <span className="font-medium text-gray-900">{result.personalInfo.gender}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cung nam:</span>
                      <span className="font-medium text-gray-900">{result.personalInfo.palace.male}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cung nữ:</span>
                      <span className="font-medium text-gray-900">{result.personalInfo.palace.female}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Năm vận:</span>
                      <span className="font-medium text-gray-900">{result.personalInfo.fortuneYear}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Male Directions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hướng Nhà Cho Nam Mạng</h2>
                <div className="space-y-4">
                  {result.maleDirections.map((direction, index) => (
                    <DirectionCard key={index} direction={direction} index={index} />
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-blue-800 font-medium">Kết luận cho Nam mạng:</p>
                  <p className="text-blue-700 mt-1">{result.maleConclusion}</p>
                </div>
              </div>

              {/* Female Directions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hướng Nhà Cho Nữ Mạng</h2>
                <div className="space-y-4">
                  {result.femaleDirections.map((direction, index) => (
                    <DirectionCard key={index} direction={direction} index={index} />
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <p className="text-green-800 font-medium">Kết luận cho Nữ mạng:</p>
                  <p className="text-green-700 mt-1">{result.femaleConclusion}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  * Thông tin này chỉ mang tính chất tham khảo. Nên tham khảo ý kiến chuyên gia phong thủy để có quyết định tốt nhất.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default page