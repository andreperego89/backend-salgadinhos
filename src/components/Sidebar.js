import React from "react";

export default function Sidebar({ setTela, telaAtiva }) {
  const itens = [
    { nome: "Pedidos", key: "pedidos" },
    { nome: "Fritagem", key: "fritagem" }
  ];

  return (
    <div className="w-48 bg-orange-100 h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">🥟 Salgadinhos</h1>
      {itens.map(item => (
        <button
          key={item.key}
          onClick={() => setTela(item.key)}
          className={`mb-2 p-2 rounded hover:bg-orange-300 text-left ${
            telaAtiva === item.key ? "bg-orange-300 font-bold" : ""
          }`}
        >
          {item.nome}
        </button>
      ))}
    </div>
  );
}
