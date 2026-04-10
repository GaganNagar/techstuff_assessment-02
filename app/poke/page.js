"use client";
import { useEffect, useState } from "react";

export default function PokePage() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [tab, setTab] = useState("types");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // ✅ page count fix

  const limit = 10;

  // Fetch Pokemon List
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data.results);
        setTotal(data.count); // ✅ total count
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load Pokémon list");
        setLoading(false);
      });
  }, [offset]);

  // Fetch Selected Pokemon Details
  useEffect(() => {
    if (selected) {
      setLoading(true);
      setError(null);

      fetch(selected.url)
        .then((res) => res.json())
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load Pokémon details");
          setLoading(false);
        });
    }
  }, [selected]);

  return (
    <div className="p-6 flex flex-col md:flex-row gap-10">
      
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">Pokémon List</h1>

        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full border border-gray-300 shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Sr No</th>
              <th className="p-2 border">Name</th>
            </tr>
          </thead>

          <tbody>
            {pokemon.map((p, index) => (
              <tr
                key={index}
                className={`text-center cursor-pointer hover:bg-gray-100 ${
                  selected?.name === p.name ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelected(p)}
              >
                <td className="p-2 border">{offset + index + 1}</td>
                <td className="p-2 border text-blue-600">{p.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ PAGE COUNT FIX */}
        <p className="text-center mt-3 text-gray-600">
          Page {offset / limit + 1} of {Math.ceil(total / limit)}
        </p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setOffset(offset - limit)}
            disabled={offset === 0}
            className="bg-blue-500 text-white px-4 py-2 mr-2 rounded disabled:bg-gray-400"
          >
            Prev
          </button>

          <button
            onClick={() => setOffset(offset + limit)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2">
        {details ? (
          <div className="p-4 border rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {details.name.toUpperCase()}
            </h2>

            {/* Tabs */}
            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={() => setTab("types")}
                className={`px-3 py-1 rounded ${
                  tab === "types" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Types
              </button>

              <button
                onClick={() => setTab("moves")}
                className={`px-3 py-1 rounded ${
                  tab === "moves" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Moves
              </button>

              <button
                onClick={() => setTab("game")}
                className={`px-3 py-1 rounded ${
                  tab === "game" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Game
              </button>
            </div>

            {/* Tab Content */}
            {tab === "types" && (
              <div>
                <p className="font-semibold">
                  Total Types: {details.types.length}
                </p>
                <ul className="list-disc ml-5 mt-2">
                  {details.types.map((t, i) => (
                    <li key={i}>{t.type.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "moves" && (
              <p className="font-semibold">
                Total Moves: {details.moves.length}
              </p>
            )}

            {tab === "game" && (
              <p className="font-semibold">
                Total Game Indices: {details.game_indices.length}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Select a Pokémon to see details
          </p>
        )}
      </div>

    </div>
  );
}