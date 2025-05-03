import React from "react";
import NavbarItem from "./NavbarItem";

export default function () {
  return (
    <div className="flex dark:bg-gray-800 bg-red-500 p-4 lg:text-lg justify-center gap-6">
      <NavbarItem title="Trending" param="fetchTrending" />
      <NavbarItem title="Top Rated" param="fetchTopRated" />
    </div>
  );
}
