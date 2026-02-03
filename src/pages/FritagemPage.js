// src/pages/FritagemPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FritagemPage() {
  const [fritagem, setFritagem] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFritagem = async () => {
      try {
        //const res = await axios.get("http://192.168.10.14:5000/api/fritagem");
        const res = await axios.get("${process.env.REACT_APP_API_URL}/api/fritagem");

        
        setFritagem(res.data);
      } catch (err) {
        console.error("Erro ao buscar fritagem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFritagem();
  }, []);

  if (loading) {
    return <p>Carregando dados da fritagem...</p>;
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        🍴 Ordem de Preparo - Fritagem
      </h1>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-orange-200">
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Data</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Produto</th>
              <th className="border px-4 py-2">Qtd</th>
            </tr>
          </thead>
          <tbody>
            {fritagem.map((item, index) => {
              const dataFormatada = new Date(item.data_agendada).toLocaleDateString("pt-BR");
              return (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{item.nome_cliente}</td>
                  <td className="border px-4 py-2">{dataFormatada}</td>
                  <td className="border px-4 py-2">{item.hora_agendada}</td>
                  <td className="border px-4 py-2">{item.produto}</td>
                  <td className="border px-4 py-2">{item.qtd}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
