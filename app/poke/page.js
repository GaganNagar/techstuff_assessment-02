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

  const limit = 10;

  // Fetch Pokemon List
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data.results);
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
    <div style={{ padding: "20px", display: "flex", gap: "40px" }}>
      
      {/* LEFT SIDE - TABLE */}
      <div>
        <h1>Pokemon List</h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {pokemon.map((p, index) => (
              <tr key={index}>
                <td>{offset + index + 1}</td>
                <td
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => setSelected(p)}
                >
                  {p.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />

        <button
          onClick={() => setOffset(offset - limit)}
          disabled={offset === 0}
        >
          Prev
        </button>

        <button onClick={() => setOffset(offset + limit)}>
          Next
        </button>
      </div>

      {/* RIGHT SIDE - DETAILS */}
      <div>
        {details && (
          <div>
            <h2>{details.name.toUpperCase()}</h2>

            {/* Tabs */}
            <div>
              <button onClick={() => setTab("types")}>Types</button>
              <button onClick={() => setTab("moves")}>Moves</button>
              <button onClick={() => setTab("game")}>Game Indices</button>
            </div>

            <br />

            {/* Tab Content */}
            {tab === "types" && (
              <div>
                <p>Total Types: {details.types.length}</p>
                <ul>
                  {details.types.map((t, i) => (
                    <li key={i}>{t.type.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "moves" && (
              <div>
                <p>Total Moves: {details.moves.length}</p>
              </div>
            )}

            {tab === "game" && (
              <div>
                <p>Total Game Indices: {details.game_indices.length}</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}