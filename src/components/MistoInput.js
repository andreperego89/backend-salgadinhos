import React, { useState } from "react";

export default function MistoInput({ produtos, onDistribuirMisto }) {
  const [mistoQtd, setMistoQtd] = useState(0);

  const handleDistribuir = () => {
    onDistribuirMisto(Number(mistoQtd));
    setMistoQtd(0);
  };

  return (
    <div className="my-4 p-3 border rounded-lg bg-yellow-50">
      <label className="font-semibold">Misto (quantidade total de salgados):</label>
      <div className="flex space-x-2 mt-2">
        <input
          type="number"
          value={mistoQtd}
          onChange={(e) => setMistoQtd(e.target.value)}
          className="border px-2 py-1 rounded w-24"
        />
        <button
          onClick={handleDistribuir}
          className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
        >
          Distribuir
        </button>
      </div>
    </div>
  );
}
