export default function Carrinho({ carrinho, onRemove }) {
  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div className="bg-white p-5 mt-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-orange-700 mb-4">🛒 Carrinho</h2>
      {carrinho.length === 0 ? (
        <p className="text-gray-500">Nenhum produto adicionado.</p>
      ) : (
        <ul>
          {carrinho.map((item) => (
            <li key={item.id} className="flex justify-between items-center py-2 border-b">
              <span>
                {item.nome} x{item.quantidade}
              </span>
              <div>
                <span className="text-gray-700 mr-2">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xl font-semibold text-right mt-4">
        Total: R$ {total.toFixed(2)}
      </p>
    </div>
  );
}
