import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdStar } from "react-icons/md";

export default async function MediaPage({ params, searchParams }) {
  const id = params.id;

  // get media type from url query parameter
  const mediaType = searchParams?.type || "movie";
  const isTV = mediaType === "tv";

  // fetch from the correct endpoint directly using the media type
  const res = await fetch(
    `https://api.themoviedb.org/3/${isTV ? "tv" : "movie"}/${id}?api_key=${
      process.env.API_KEY
    }&language=en-US`
  );

  if (!res.ok) {
    // If specified type fails, try the other type as fallback
    const fallbackRes = await fetch(
      `https://api.themoviedb.org/3/${!isTV ? "tv" : "movie"}/${id}?api_key=${
        process.env.API_KEY
      }&language=en-US`
    );

    if (fallbackRes.ok) {
      // If fallback works, switch the media type
      const media = await fallbackRes.json();
      return (
        <div className="text-center p-10">
          <h2 className="text-lg mb-5">
            This content appears to be a {!isTV ? "TV show" : "movie"} instead.
          </h2>
          <a
            href={`/movie/${id}?type=${!isTV ? "tv" : "movie"}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View correct page
          </a>
        </div>
      );
    } else {
      return <div className="text-center p-10">Content not found</div>;
    }
  }

  const media = await res.json();

  // fetch trailer information (we only use this to get YouTube video IDs)
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/${
      isTV ? "tv" : "movie"
    }/${id}/videos?api_key=${process.env.API_KEY}&language=en-US`
  );
  const videos = await videoRes.json();

  // fetch cast information
  const creditsRes = await fetch(
    `https://api.themoviedb.org/3/${
      isTV ? "tv" : "movie"
    }/${id}/credits?api_key=${process.env.API_KEY}&language=en-US`
  );
  const credits = await creditsRes.json();

  // limit cast to 6 members
  const cast = credits?.cast?.slice(0, 6) || [];

  // fetch yt trailer
  const trailer =
    videos?.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    ) ||
    // if no trailer found, use any youtube video
    videos?.results?.find((video) => video.site === "YouTube");

  const getTitle = () => media.title || media.name;

  const getReleaseDate = () => media.release_date || media.first_air_date;

  return (
    <div className="w-full">
      <div className="p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6">
        <Image
          src={`https://image.tmdb.org/t/p/original/${
            media.backdrop_path || media.poster_path
          }`}
          width={500}
          height={300}
          className="rounded-lg"
          style={{ maxWidth: "100%", height: "100%" }}
          alt={getTitle()}
        />
        <div className="p-2">
          <h2 className="text-lg mb-3 font-bold">
            {getTitle()}{" "}
            {isTV && (
              <span className="text-sm text-gray-400 ml-2">(TV Series)</span>
            )}
          </h2>

          <span className="font-semibold mr-1">
            {isTV ? "First Air Date: " : "Release Date: "}
          </span>
          <p>{getReleaseDate()}</p>

          <span className="font-semibold mr-1">Rating: </span>
          <p className="flex items-center">
            {media.vote_average ? media.vote_average.toFixed(1) : "N/A"}
            <MdStar className="text-amber-500 ml-1" />
          </p>

          {media.runtime && !isTV && (
            <p className="">
              <span className="font-semibold">Runtime: </span>
              {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
            </p>
          )}

          {isTV && media.number_of_seasons && (
            <p className="">
              <span className="font-semibold">Seasons: </span>
              {media.number_of_seasons}
            </p>
          )}

          {isTV && media.number_of_episodes && (
            <p className="">
              <span className="font-semibold">Episodes: </span>
              {media.number_of_episodes}
            </p>
          )}

          <div className="">
            <span className="font-semibold">Genres: </span>
            <div className="flex flex-wrap gap-2 my-1">
              {media.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-lg mb-3">{media.overview}</p>

          {cast.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Top Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cast.map((actor) => (
                  <Link
                    href={`/credits/${actor.id}`}
                    key={actor.id}
                    className="flex items-center cursor-pointer hover:bg-gray-800 p-1 rounded"
                  >
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        width={50}
                        height={50}
                        className="rounded mr-2"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{actor.name}</p>
                      <p className="text-xs text-gray-300">{actor.character}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {trailer && (
            <div className="mt-4">
              <h3 className="font-bold text-lg mb-2">Trailer</h3>
              <div className="relative pt-[56.25%] w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${getTitle()} Trailer`}
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
