import Results from "@/components/Results";

export default async function SearchPage({ params }) {
  const paramsObj = await params;
  const searchTerm = paramsObj.searchTerm;

  // fetch movies
  const movieRes = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${searchTerm}&page=1&include_adult=false&language=en-US`
  );
  const movieData = await movieRes.json();

  // fetch TV shows
  const tvRes = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&query=${searchTerm}&page=1&include_adult=false&language=en-US`
  );
  const tvData = await tvRes.json();

  // filter out results with less than 10 votes (no fan films and such)
  const movieResults = movieData.results
    .filter((item) => item.vote_count >= 10)
    .map((movie) => ({
      ...movie,
      media_type: "movie",
    }));

  const tvResults = tvData.results
    .filter((item) => item.vote_count >= 10)
    .map((show) => ({
      ...show,
      media_type: "tv",
    }));

  const combinedResults = [...movieResults, ...tvResults].sort(
    (a, b) => b.popularity - a.popularity
  );

  return (
    <div>
      {(!combinedResults || combinedResults.length === 0) && (
        <h1 className="text-center pt-6">Search provided no results</h1>
      )}
      {combinedResults && combinedResults.length > 0 && (
        <>
          <h2 className="text-center pt-4 text-xl">
            Found {combinedResults.length} results for:{" "}
            <span className="font-bold">{searchTerm}</span>
          </h2>
          <Results results={combinedResults} />
        </>
      )}
    </div>
  );
}
