import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosThumbsUp } from "react-icons/io";
import { MdStar } from "react-icons/md";

export default function Card({ result }) {
  // check which media type is being used
  const mediaType = result.media_type || (result.title ? "movie" : "tv");

  return (
    <div className="group cursor-pointer sm:hover:shadow-slate-400 sm:shadow-md rounded-lg sm:border sm:border-slate-400 sm:m-2 transition-shadow duration-200">
      <Link href={`/media/${result.id}?type=${mediaType}`}>
        <Image
          src={`https://image.tmdb.org/t/p/original/${
            result.backdrop_path || result.poster_path
          }`}
          width={500}
          height={300}
          className="sm:rounded-t-lg group-hover:opacity-75 transition-opacity duration-200 ease-in-out"
          alt={result.title || result.original_name}
        />
        <div className="p-2">
          <h2 className="text-lg font-bold">
            {result.title || result.name}
            {mediaType === "tv" && (
              <span className="text-sm text-gray-400 ml-2">(TV)</span>
            )}
          </h2>
          <p className="flex items-center">
            {result.release_date || result.first_air_date}
            <span className="flex items-center ml-3">
              {result.vote_average ? result.vote_average.toFixed(1) : "N/A"}{" "}
              <MdStar className="text-amber-500 ml-1" />
            </span>
            <IoIosThumbsUp className="h-5 mr-1 ml-3" />
            {result.vote_count || 0}
          </p>
        </div>
      </Link>
    </div>
  );
}
