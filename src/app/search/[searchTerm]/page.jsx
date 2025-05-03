import Results from "@/components/Results";

export default async function SearchPage({ params }) {
  const paramsObj = await params;
  const searchTerm = paramsObj.searchTerm;
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${searchTerm}&page=1&include_adult=false&language=en-US`
  );
  const data = await res.json();

  // filter out results with less than 10 votes (no fan films and such)
  const results = data.results.filter((item) => item.vote_count >= 10);

  return (
    <div>
      {(!results || results.length === 0) && (
        <h1 className="text-center pt-6">Search provided no results</h1>
      )}
      {results && results.length > 0 && <Results results={results} />}
    </div>
  );
}
