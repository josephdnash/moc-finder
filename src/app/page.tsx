'use client'; // Required for components that use React Hooks (useState, useEffect)

import { useState, FormEvent } from 'react';

// Define a type for the MOC data we expect (can be expanded later)
interface MocResult {
  set_num: string;
  name: string;
  num_parts: number;
  moc_img_url: string | null;
  moc_url: string;
  designer_name: string;
  designer_url: string;
}

interface RebrickableResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MocResult[];
}

export default function HomePage() {
  const [setNumInput, setSetNumInput] = useState<string>('');
  const [mocData, setMocData] = useState<RebrickableResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    if (!setNumInput.trim()) {
      setError('Please enter a LEGO set number.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMocData(null);

    try {
      const response = await fetch(`/api/rebrickable-proxy?set_num=${encodeURIComponent(setNumInput.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data: RebrickableResponse = await response.json();
      setMocData(data);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24 bg-gray-50 text-gray-800">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          MOC Finder
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <label htmlFor="setNum" className="block text-sm font-medium text-gray-700 mb-1">
            Enter LEGO Set Number:
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              name="setNum"
              id="setNum"
              className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
              placeholder="e.g., 75192 or 10305"
              value={setNumInput}
              onChange={(e) => setSetNumInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-r-md border border-l-0 border-blue-500 bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="my-4 rounded-md bg-red-100 p-4 text-sm text-red-700 border border-red-300">
            <p role="alert">Error: {error}</p>
          </div>
        )}

        {isLoading && (
          <div className="my-4 text-center">
            <p className="text-lg text-blue-600">Loading MOCs...</p>
            {/* You can add a spinner here later */}
          </div>
        )}

        {mocData && !isLoading && !error && (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="text-2xl font-semibold mb-4 text-gray-700">
              Results for Set: <span className="font-bold text-blue-600">{mocData.results[0]?.set_num || setNumInput}</span>
              {/* Fallback to setNumInput if results are empty but count is 0 for a valid search for a set with no MOCs */}
            </h2>
            
            <p className="mb-4 text-lg">
              Found <span className="font-bold">{mocData.count}</span> alternate build(s).
            </p>

            {mocData.count > 0 && (
              <ul className="space-y-4">
                {mocData.results.map((moc) => (
                  <li key={moc.set_num} className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      {moc.moc_img_url && (
                        <img 
                          src={moc.moc_img_url} 
                          alt={`Image of ${moc.name}`} 
                          className="w-full sm:w-32 h-auto object-cover rounded-md mb-3 sm:mb-0 sm:mr-4 border border-gray-200" 
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-blue-700 hover:underline">
                          <a href={moc.moc_url} target="_blank" rel="noopener noreferrer">
                            {moc.name}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-600">
                          By: <a href={moc.designer_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{moc.designer_name}</a>
                        </p>
                        <p className="text-sm text-gray-500">Parts: {moc.num_parts}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
