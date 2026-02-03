import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Fritagem() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchFritagem = async () => {
      try {
        //const res = await axios.get("http://192.168.10.12:5000/api/fritagem");
        const res = await axios.get("${process.env.REACT_APP_API_URL}/api/fritagem");
        setPedidos(res.data);
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao buscar fritagem:", err);
      }
    };
    fetchFritagem();
  }, []);

  if (carregando) return <p>Carregando pedidos para fritagem...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">🍴 Ordem de Preparo</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido agendado.</p>
      ) : pedidos.map(pedido => (
        <div key={pedido.id} className="bg-white rounded shadow p-4 mb-4">
          <h3 className="font-bold">{pedido.cliente}</h3>
          <p>Data: {pedido.data_agendada} | Hora: {pedido.hora_agendada}</p>
          <ul className="mt-2">
            {pedido.itens.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{item.nome}</span>
                <span>{item.quantidade}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
