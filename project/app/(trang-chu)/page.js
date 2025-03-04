import ImageSlider from "@/components/general_page/home_page/ImageSlider";
import ForYou from "@/components/general_page/home_page/ForYou";
import News from "@/components/general_page/home_page/News";

export default function Home() {
  const imageList = [
    "https://tpc.googlesyndication.com/simgad/5839458670066532432",
    "https://tpc.googlesyndication.com/simgad/14360077145346410119",
  ];
  return (
    <div>
      <ImageSlider images={imageList} width={1920} height={360} gap={50} haveSearchBox={true}/>
      <div className="max-w-full">
        <div className="mt-5">
          <News />
        </div>
        <div className="bg-neutral-50">
          <ForYou />
        </div>
      </div>
    </div>
  );
}
