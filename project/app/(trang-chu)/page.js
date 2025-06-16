import ImageSlider from "@/components/general_page/home_page/ImageSlider";
import ForYou from "@/components/general_page/home_page/ForYou";
import News from "@/components/general_page/home_page/News";
import StrikingProjects from "@/components/general_page/home_page/StrikingProjects";
import RealEstateByLocation from "@/components/general_page/home_page/RealEstateByLocation";
import Utilities from "@/components/general_page/home_page/Utilities";

export default function Home() {
  const imageList = [
    "https://tpc.googlesyndication.com/simgad/5839458670066532432",
    "https://tpc.googlesyndication.com/simgad/14360077145346410119",
  ];
  return (
    <div>
      <ImageSlider images={imageList} width={1920} height={360} gap={50} haveSearchBox={true} />
      <div className="max-w-full">
        <div className="mt-5">
          <News />
        </div>
        <div className="bg-neutral-50">
          <ForYou />
        </div>
        <div>
          <StrikingProjects />
        </div>
        <div>
          <RealEstateByLocation />
        </div>
        <div>
          <Utilities />
        </div>

        <div className="max-w-7xl mx-auto my-20 text-gray-500 flex flex-col gap-5 px-2 xl:px-0">
          <p className="">Batdongsan.com.vn là nền tảng bất động sản uy tín tại Việt Nam dành cho những người đang tìm kiếm bất động sản để ở hoặc đầu tư. Chúng tôi cung cấp dữ liệu tin rao lớn với đa dạng loại hình bất động sản giúp bạn có những lựa chọn phù hợp với nhu cầu của mình.</p>
          <p>Ở phân khúc nhà đất bán, các loại hình nổi bật gồm bán căn hộ chung cư, bán nhà riêng, nhà mặt tiền, biệt thự và liền kề, bán đất, đất nền dự án và một số loại hình đang được nhà đầu tư quan tâm như bán condotel, shophouse và khu nghỉ dưỡng. Ngoài ra, người dùng quan tâm đến bất động sản cho thuê có nhiều cơ hội để tìm thấy nhà đất ưng ý với danh sách tin rao được cập nhật liên tục tại các danh mục cho thuê nhà nguyên căn, thuê phòng trọ giá rẻ, thuê văn phòng, mặt bằng kinh doanh.</p>
          <p>Với bộ lọc chi tiết dựa theo khoảng giá, vị trí, diện tích,... bạn có thể dễ dàng chọn lọc bất động sản phù hợp trong hàng ngàn tin rao bán và cho thuê được cập nhật liên tục mỗi ngày. Lượng tin rao chính chủ lớn đáp ứng nhu cầu của những người tìm nhà không qua môi giới. </p>
          <p>Batdongsan.com.vn cũng cung cấp thông tin toàn diện nhất về các dự án căn hộ chung cư, những đánh giá dự án từ góc nhìn chuyên gia giúp bạn ra quyết định đúng đắn. Ở chuyên mục Wiki BĐS có thể tìm thấy các thông tin đánh giá thị trường, những kiến thức, kinh nghiệm mua bán, cho thuê bất động sản để đồng hành cùng bạn trong hành trình tìm nhà.</p>
          <p>Truy cập Batdongsan.com.vn để được cung cấp giải pháp hiệu quả trong lĩnh vực mua bán bất động sản cũng như cho thuê nhà đất tại Việt Nam.</p>
        </div>
      </div>
    </div>
  );
}
