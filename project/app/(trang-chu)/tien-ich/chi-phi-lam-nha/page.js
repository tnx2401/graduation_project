"use client"
import React, { useState } from 'react';
import matsPrice from "@/public/materials.json"

const ConstructionCostForm = () => {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    floors: '',
    floorHeight: '',
    roofType: 'tin'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.length || formData.length < 1 || formData.length > 50) {
      newErrors.length = 'Chiều dài phải từ 1m đến 50m';
    }

    if (!formData.width || formData.width < 1 || formData.width > 50) {
      newErrors.width = 'Chiều rộng phải từ 1m đến 50m';
    }

    if (!formData.floors || formData.floors < 1 || formData.floors > 20) {
      newErrors.floors = 'Số tầng phải từ 1 đến 20';
    }

    if (!formData.floorHeight || formData.floorHeight < 2 || formData.floorHeight > 6) {
      newErrors.floorHeight = 'Chiều cao tầng phải từ 2m đến 6m';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  function estimateCost({ length, width, floors, floorHeight, roofType }, priceList) {
    const floorArea = length * width;
    const totalFloorArea = floorArea * floors;

    const perimeter = 2 * (length + width);
    const wallArea = perimeter * floorHeight * floors;

    // Material quantities
    const quantities = {
      sand: 0.12 * totalFloorArea,                 // m3
      cement: 12 * totalFloorArea,                  // kg
      steel: 6 * totalFloorArea,                     // kg
      stone: 0.12 * totalFloorArea,                  // m3
      brick: 50 * wallArea,                          // viên
      tiles: floorArea,                              // m2 (if tiled floor, otherwise 0)
      roofTiles: 0,                                  // viên, set later if tile roof
      paintInside: 0.1 * wallArea,                   // kg
      puttyInside: 0.05 * wallArea,                  // kg
      paintOutside: 0.08 * wallArea,                  // kg
      puttyOutside: 0.04 * wallArea                   // kg
    };

    // Roof adjustment
    if (roofType === 'tile') {
      quantities.roofTiles = floorArea * 15; // 15 tiles per m2 roof
    }

    // Find prices by material name for quick access
    const prices = {};
    for (const item of priceList) {
      prices[item.Name] = item.Price;
    }

    // Calculate cost per material
    const costDetails = [];

    // Sand
    costDetails.push({
      name: 'Cát',
      quantity: quantities.sand,
      unit: 'm3',
      unitPrice: prices['Cát'],
      totalPrice: quantities.sand * prices['Cát']
    });

    // Cement
    costDetails.push({
      name: 'Xi măng',
      quantity: quantities.cement,
      unit: 'kg',
      unitPrice: prices['Xi măng'],
      totalPrice: quantities.cement * prices['Xi măng']
    });

    // Steel
    costDetails.push({
      name: 'Sắt',
      quantity: quantities.steel,
      unit: 'kg',
      unitPrice: prices['Sắt'],
      totalPrice: quantities.steel * prices['Sắt']
    });

    // Stone
    costDetails.push({
      name: 'Đá',
      quantity: quantities.stone,
      unit: 'm3',
      unitPrice: prices['Đá'],
      totalPrice: quantities.stone * prices['Đá']
    });

    // Brick
    costDetails.push({
      name: 'Gạch',
      quantity: quantities.brick,
      unit: 'viên',
      unitPrice: prices['Gạch'],
      totalPrice: quantities.brick * prices['Gạch']
    });

    // Tiles (floor)
    costDetails.push({
      name: 'Gạch men',
      quantity: quantities.tiles,
      unit: 'm2',
      unitPrice: prices['Gạch men'],
      totalPrice: quantities.tiles * prices['Gạch men']
    });

    // Roof tiles if tile roof
    if (roofType === 'tile') {
      costDetails.push({
        name: 'Ngói',
        quantity: quantities.roofTiles,
        unit: 'viên',
        unitPrice: prices['Ngói'],
        totalPrice: quantities.roofTiles * prices['Ngói']
      });
    } else if (roofType === 'tin') {
      // For tin, approximate cost as fixed price per m2
      costDetails.push({
        name: 'Tôn (ước lượng)',
        quantity: floorArea,
        unit: 'm2',
        unitPrice: 200000,
        totalPrice: floorArea * 200000
      });
    } else if (roofType === 'concrete') {
      // For concrete roof, cost multiplier increase by 30%
      // We can apply multiplier to the total cost later
    }

    // Paint inside
    costDetails.push({
      name: 'Sơn trong nhà',
      quantity: quantities.paintInside,
      unit: 'kg',
      unitPrice: prices['Sơn trong nhà'],
      totalPrice: quantities.paintInside * prices['Sơn trong nhà']
    });

    // Putty inside
    costDetails.push({
      name: 'Bột trét trong nhà',
      quantity: quantities.puttyInside,
      unit: 'kg',
      unitPrice: prices['Bột trét trong nhà'],
      totalPrice: quantities.puttyInside * prices['Bột trét trong nhà']
    });

    // Paint outside
    costDetails.push({
      name: 'Sơn ngoài trời',
      quantity: quantities.paintOutside,
      unit: 'kg',
      unitPrice: prices['Sơn ngoài trời'],
      totalPrice: quantities.paintOutside * prices['Sơn ngoài trời']
    });

    // Putty outside
    costDetails.push({
      name: 'Bột trét ngoài trời',
      quantity: quantities.puttyOutside,
      unit: 'kg',
      unitPrice: prices['Bột trét ngoài trời'],
      totalPrice: quantities.puttyOutside * prices['Bột trét ngoài trời']
    });

    // Sum all costs
    let totalCost = costDetails.reduce((acc, item) => acc + item.totalPrice, 0);

    // Apply concrete roof multiplier if needed
    if (roofType === 'concrete') {
      totalCost *= 1.3; // 30% increase for concrete roof
    }

    return {
      totalCost,
      materials: costDetails
    };
  }

  const handleSubmit = async () => {

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      setResults(estimateCost(formData, matsPrice));
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi tính toán chi phí. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Thông Tin Ngôi Nhà</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Chiều dài
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="0.1"
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.length ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">m</span>
                  </div>
                  {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Chiều rộng
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="0.1"
                      value={formData.width}
                      onChange={(e) => handleInputChange('width', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.width ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">m</span>
                  </div>
                  {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
                </div>
              </div>

              {/* Floors and Height */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Số tầng
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.floors}
                      onChange={(e) => handleInputChange('floors', e.target.value)}
                      className={`w-full px-4 py-3 pr-16 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.floors ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">tầng</span>
                  </div>
                  {errors.floors && <p className="text-red-500 text-sm mt-1">{errors.floors}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Chiều cao tầng
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="2"
                      max="6"
                      step="0.1"
                      value={formData.floorHeight}
                      onChange={(e) => handleInputChange('floorHeight', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.floorHeight ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">m</span>
                  </div>
                  {errors.floorHeight && <p className="text-red-500 text-sm mt-1">{errors.floorHeight}</p>}
                </div>
              </div>

              {/* Roof Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  Loại mái nhà
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'concrete', label: 'Bê-tông' },
                    { value: 'tile', label: 'Ngói' },
                    { value: 'tin', label: 'Tôn' }
                  ].map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="roofType"
                        value={option.value}
                        checked={formData.roofType === option.value}
                        onChange={(e) => handleInputChange('roofType', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-xl text-center transition-all hover:shadow-md ${formData.roofType === option.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className="font-medium">{option.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-red-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    Đang tính toán...
                  </>
                ) : (
                  <>
                    Tính Chi Phí
                  </>
                )}
              </button>
            </div>

            {/* Quick Info */}
            {formData.length && formData.width && (
              <div className="mt-6 p-4 bg-red-50 rounded-xl">
                <h3 className="font-semibold text-red-800 mb-2">Thông tin nhanh</h3>
                <div className="text-sm text-red-700 space-y-1">
                  <p>Diện tích sàn mỗi tầng: {formatNumber(formData.length * formData.width)} m²</p>
                  {formData.floors && (
                    <p>Tổng diện tích sàn: {formatNumber(formData.length * formData.width * formData.floors)} m²</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Kết Quả Tính Toán</h2>

            {!results ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Điền thông tin và nhấn "Tính Chi Phí" để xem kết quả</p>
              </div>
            ) : (
              <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Chi phí dự kiến</h3>
                <p className="text-lg font-medium">Tổng chi phí: {formatCurrency(results.totalCost)}</p>

                <div className="mt-4 space-y-2">
                  {results.materials.map((mat, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{mat.name} ({formatNumber(mat.quantity)} {mat.unit})</span>
                      <span>{formatCurrency(mat.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <p className='text-xs text-gray-500 mt-5 px-2'>Chi phí dựa trên bảng giá gần nhất (Chưa bao gồm phí nhân công, điện, nước, nội thất,...)</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionCostForm;