import Results from "@/components/Results";
import Link from "next/link";

const API_KEY = process.env.API_KEY;

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const genre = params?.genre || "fetchTrending";
  const currentPage = parseInt(params?.page) || 1;
  const endpoint =
    genre === "fetchTopRated" ? "movie/top_rated" : "trending/all/week";

  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&language=en-US&page=${currentPage}`;

  const res = await fetch(url, { next: { revalidate: 10000 } });

  const data = await res.json();

  // filter out results with less than 10 votes so no fan films and such appear
  const results = data.results.filter((item) => item.vote_count >= 10);

  // calculate total pages (from API response)
  const totalPages = Math.min(data.total_pages || 5, 10); // Limit to 10 pages max

  return (
    <div>
      <h2 className="text-center text-xl py-4">
        {genre === "fetchTopRated" ? "Top Rated Movies" : "Trending This Week"}
      </h2>

      <Results results={results} />

      <div className="flex justify-center items-center gap-4 my-8">
        {currentPage > 1 && (
          <Link
            href={`/?genre=${genre}&page=${currentPage - 1}`}
            className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700"
          >
            Previous
          </Link>
        )}

        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <Link
            href={`/?genre=${genre}&page=${currentPage + 1}`}
            className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
