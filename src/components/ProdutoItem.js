import React from "react";

export default function ProdutoItem({ produto, onIncrement, onDecrement }) {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <h2 className="text-lg font-semibold">{produto.nome}</h2>
        <p className="text-sm text-gray-500">R$ {produto.preco.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onDecrement(produto.id)}
          className="bg-red-400 text-white px-3 py-1 rounded-lg text-lg hover:bg-red-500"
        >
          –
        </button>
        <span className="text-lg font-semibold w-6 text-center">{produto.qtd}</span>
        <button
          onClick={() => onIncrement(produto.id)}
          className="bg-green-500 text-white px-3 py-1 rounded-lg text-lg hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}
