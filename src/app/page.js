import Results from "@/components/Results";

const API_KEY = process.env.API_KEY;

export default async function Home({ searchParams }) {
  const genre = searchParams?.genre || "fetchTrending";
  const endpoint =
    genre === "fetchTopRated" ? "movie/top_rated" : "trending/all/week";
  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    const results = data.results;

    return (
      <div>
        <Results results={results} />
      </div>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Error loading the results</h1>
        <p>Please try again later</p>
      </div>
    );
  }
}
