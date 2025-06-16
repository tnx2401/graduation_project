import {
  GlobeAltIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-700 py-10 max-w-7xl mx-auto mt-20">
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <img src="https://staticfile.batdongsan.com.vn/images/logo/standard/black/logo_gray-5.svg" alt="Batdongsan logo" className="mb-2" />
          <p className="font-semibold">CÔNG TY CỔ PHẦN PROPERTYGURU VIỆT NAM</p>
          <p>
            Tầng 31, Keangnam Hanoi Landmark, Phạm Hùng, Nam Từ Liêm, Hà Nội
          </p>
          <p>(024) 3562 5939 - (024) 3562 5940</p>
          <div className="flex items-center gap-2 mt-2">
            <img src="https://staticfile.batdongsan.com.vn/images/app/qr-app-adjust.png" alt="QR code" className="w-20" />
            <div className="flex flex-col gap-1">
              <img src="https://staticfile.batdongsan.com.vn/images/mobile/footer/google-play.png" alt="Google Play" className="w-24" />
              <img src="https://staticfile.batdongsan.com.vn/images/mobile/footer/app_store.png" alt="App Store" className="w-24" />
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold">HƯỚNG DẪN</p>
          <p className="font-semibold mt-2">QUY ĐỊNH</p>
        </div>

        <div>
          <p className="font-semibold mb-2">ĐĂNG KÝ NHẬN TIN</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="px-3 py-2 rounded-l border border-gray-300 focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600">
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <p className="font-semibold mb-1">QUỐC GIA & NGÔN NGỮ</p>
            <div className="flex items-center border p-2 rounded-md">
              <GlobeAltIcon className="w-4 h-4 mr-2" />
              <span>Việt Nam</span>
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">HỖ TRỢ</p>
          <div className="space-y-1">
            <p>
              <PhoneIcon className="inline w-4 h-4 mr-1" /> Hotline: 1900 1881
            </p>
            <p>
              Khách hàng:{" "}
              <a href="mailto:trogiup.batdongsan.com.vn">
                trogiup.batdongsan.com.vn
              </a>
            </p>
            <p>
              Chăm sóc:{" "}
              <a href="mailto:hotro@batdongsan.com.vn">
                hotro@batdongsan.com.vn
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 text-xs grid md:grid-cols-3 gap-4">
        <div>
          <p className="font-semibold">Chi nhánh TP. Hồ Chí Minh</p>
          <p>Tầng 3, Tháp B toà nhà Viettel Complex...</p>
          <p>Hotline: 1900 1881</p>
        </div>
        <div>
          <p className="font-semibold">Chi nhánh Hải Phòng</p>
          <p>Phòng 502, Tứ Business Center...</p>
          <p>Hotline: 1900 1881</p>
        </div>
        <div>
          <p className="font-semibold">Chi nhánh Bình Dương</p>
          <p>Phòng 10, tầng 16, Becamex Tower...</p>
          <p>Hotline: 1900 1881</p>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>© 2007 - 2025 Batdongsan.com.vn</p>
        <p>Giấy ĐKKD số 0104630479 do Sở KHĐT TP Hà Nội...</p>
        <p className="mt-2">Chịu trách nhiệm nội dung: Ông Bạch Dương...</p>
      </div>
    </footer>
  );
}
