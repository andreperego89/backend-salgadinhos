import React from "react";

export default function PedidoResumo({ itens, total, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4 text-center text-orange-600">
          Resumo do Pedido
        </h2>
        {itens.filter(i => i.qtd > 0).map(i => (
          <div key={i.id} className="flex justify-between border-b py-2 text-gray-700">
            <span>{i.nome} x{i.qtd}</span>
            <span>R$ {(i.qtd * i.preco).toFixed(2)}</span>
          </div>
        ))}
        <p className="text-right font-bold text-lg mt-3">Total: R$ {total.toFixed(2)}</p>
        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
