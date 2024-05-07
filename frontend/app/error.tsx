'use client'; // This is a client component

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function CustomError({ error, reset }: Readonly<ErrorProps>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg mb-8">An error occurred while rendering the page.</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}