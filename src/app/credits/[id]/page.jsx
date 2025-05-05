import React from "react";
import Image from "next/image";
import Link from "next/link";

export default async function ActorPage({ params }) {
  const id = params.id;

  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.API_KEY}&language=en-US`
  );

  const actor = await res.json();

  const creditsRes = await fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.API_KEY}&language=en-US`
  );

  const credits = await creditsRes.json();

  // filter out appearances in talk/late night shows and bts content
  const filteredCredits = credits?.cast?.filter((credit) => {
    if (
      credit.genre_ids?.includes(10767) || // talk Show genre ID
      credit.genre_ids?.includes(10763) || // news genre ID
      credit.genre_ids?.includes(99) // documentary genre ID usually bts content
    ) {
      return false;
    }

    return true;
  });

  // sort by rating and limit to 20
  const knownFor =
    filteredCredits
      ?.sort((a, b) => b.vote_average - a.vote_average)
      ?.slice(0, 20) || [];

  // calculate age from birthday and deathday
  const calculateAge = () => {
    if (!actor.birthday) return null;

    const birthDate = new Date(actor.birthday);
    let age = new Date().getFullYear() - birthDate.getFullYear();

    if (actor.deathday) {
      const deathDate = new Date(actor.deathday);
      age = deathDate.getFullYear() - birthDate.getFullYear();
      return `${age} (${actor.birthday} - ${actor.deathday})`;
    }

    return `${age} (Born ${actor.birthday})`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="sticky top-20">
            {actor.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                width={400}
                height={600}
                alt={actor.name}
                className="rounded-lg w-full h-auto"
                priority
              />
            ) : (
              <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}

            <h1 className="text-2xl font-bold mt-4">{actor.name}</h1>

            {calculateAge() && (
              <p className="text-gray-400 mt-1">Age: {calculateAge()}</p>
            )}

            {actor.place_of_birth && (
              <p className="text-gray-400">From: {actor.place_of_birth}</p>
            )}
          </div>
        </div>

        <div className="md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Biography</h2>
          {actor.biography ? (
            <p className="text-gray-200 mb-6 whitespace-pre-line">
              {actor.biography}
            </p>
          ) : (
            <p className="text-gray-400 mb-6">No biography available</p>
          )}

          <h2 className="text-xl font-bold mb-4">Known For</h2>
          {knownFor.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {knownFor.map((credit) => (
                <Link
                  href={`/media/${credit.id}?type=${credit.media_type}`}
                  key={`${credit.id}-${credit.media_type}-${credit.character}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                >
                  {credit.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                      width={200}
                      height={300}
                      alt={credit.title || credit.name}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="h-[150px] bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center px-2">
                        No image
                      </span>
                    </div>
                  )}
                  <div className="p-2">
                    <h3 className="font-medium text-sm">
                      {credit.title || credit.name}
                      {credit.media_type === "tv" && (
                        <span className="text-gray-400 ml-1">(TV)</span>
                      )}
                    </h3>
                    {credit.character && (
                      <p className="text-xs text-gray-400">
                        as {credit.character}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {credit.release_date || credit.first_air_date
                        ? new Date(
                            credit.release_date || credit.first_air_date
                          ).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No major acting roles found</p>
          )}
        </div>
      </div>
    </div>
  );
}
