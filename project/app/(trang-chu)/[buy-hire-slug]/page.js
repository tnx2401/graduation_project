import { fetchData } from "@/components/general_page/buy_hire/fetchData";
import HouseSearchBox from "@/components/general_page/buy_hire/HouseSearchBox";
import React from "react";
import SideFilter from "@/components/general_page/buy_hire/SideFilter";
import ClientHouseListWrapper from "@/components/general_page/buy_hire/ClientHouseListWrapper";

export default async function Page({ params, data }) {
  const path = await params;
  // // const data = await fetchData(params);

  // // Normalize all posts with computed rank, push status, and date
  // const allPosts = data.map((post) => {
  //   const rank = rankMap[post.rank_name?.toLowerCase()] || "normal";
  //   const isPushed = post.order === 1 && post.pushed_at;
  //   const sortDate = isPushed
  //     ? new Date(post.pushed_at)
  //     : new Date(post.created_at || post.updated_at || 0);

  //   return {
  //     ...post,
  //     rank,
  //     isPushed,
  //     sortDate,
  //   };
  // });

  // allPosts.sort((a, b) => {
  //   const rankDiff = rankPriority[a.rank] - rankPriority[b.rank];
  //   if (rankDiff !== 0) return rankDiff;

  //   if (a.isPushed !== b.isPushed) return b.isPushed - a.isPushed;

  //   return b.sortDate - a.sortDate;
  // });

  // const PAGE_ONE_SIZE = 10;
  // const firstPage = allPosts.slice(0, PAGE_ONE_SIZE);
  // const remainingPosts = allPosts.slice(PAGE_ONE_SIZE);
  // const finalData = [...firstPage, ...remainingPosts];

  return (
    <div className="max-w-6xl mx-auto">
      <HouseSearchBox />
      <div className="w-full flex">
        <div className="lg:w-3/4 w-full">
          <ClientHouseListWrapper path={path['buy-hire-slug']} />
        </div>
        <div className="lg:w-1/4 lg:block hidden ml-5">
          <SideFilter />
        </div>
      </div>
    </div>
  );
}
