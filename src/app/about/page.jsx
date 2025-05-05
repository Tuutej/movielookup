import React from "react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto p-3 space-y-4">
      <h1 className="text-2xl font-medium text-red-800">About</h1>
      <p className="text-gray-100 text-lg">
        Bootleg IMDb is a simple web application that allows users to search for
        movies and TV shows. It provides information such as release dates,
        ratings, genres, and actor information, making it easy for users to find
        what they're looking for.
        <br />
        <br />
        Or just use the real IMDb..
      </p>
    </div>
  );
}
