"use client";

import { use, useEffect } from "react";
export default function error({ error, reset }) {
  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl">Error loading the results</h1>
      <p>Please try again later</p>
      <button>
        <h1 className="hover:text-red-500" onClick={() => reset()}>
          Try Again
        </h1>
      </button>
    </div>
  );
}
