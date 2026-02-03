import React, { useEffect, useState } from "react";
import axios from "axios";
import ProdutoItem from "./ProdutoItem";
import Misto from "./Misto";
import ResumoPedido from "./ResumoPedido";

export default function Pedido() {
  const [itens, setItens] = useState([]);
  const [cliente, setCliente] = useState("");
  const [observacao, setObservacao] = useState("");
  const [total, setTotal] = useState(0);
  const [mostrarResumo, setMostrarResumo] = useState(false);

  // Carregar produtos do backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        //const res = await axios.get("http://192.168.10.12:5000/api/produtos");
        const res = await axios.get("${process.env.REACT_APP_API_URL}/api/produtos");
        const produtosComQtd = res.data.map(p => ({ ...p, qtd: 0 }));
        setItens(produtosComQtd);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    fetchProdutos();
  }, []);

  // Atualiza total
  useEffect(() => {
    const soma = itens.reduce((acc, i) => acc + i.preco * i.qtd, 0);
    setTotal(soma);
  }, [itens]);

  const incrementar = (id) => setItens(itens.map(i => i.id === id ? { ...i, qtd: i.qtd + 1 } : i));
  const decrementar = (id) => setItens(itens.map(i => i.id === id && i.qtd > 0 ? { ...i, qtd: i.qtd - 1 } : i));

  const handleMisto = (valor) => {
    if (valor <= 0) return;
    // distribuição: 30% a mais pastel, 10% a mais coxinha
    const pastel = Math.round(valor * 0.3);
    const coxinha = Math.round(valor * 0.1);
    const restante = valor - pastel - coxinha;
    const outrosIds = itens.filter(i => !["Pastel de Carne", "Coxinha de Frango"].includes(i.nome)).map(i => i.id);
    const distribuicao = {};
    outrosIds.forEach((id, idx) => {
      distribuicao[id] = Math.floor(restante / outrosIds.length) + (idx < restante % outrosIds.length ? 1 : 0);
    });
    setItens(itens.map(i => {
      if (i.nome === "Pastel de Carne") return { ...i, qtd: pastel };
      if (i.nome === "Coxinha de Frango") return { ...i, qtd: coxinha };
      if (distribuicao[i.id] !== undefined) return { ...i, qtd: distribuicao[i.id] };
      return i;
    }));
  };

  const handleFinalizarPedido = async () => {
    try {
      //await axios.post("http://192.168.10.12:5000/api/pedidos", {
      await axios.post("${process.env.REACT_APP_API_URL}/api/pedidos",{
        cliente,
        observacao,
        itens: itens.filter(i => i.qtd > 0)
      });
      setItens(itens.map(i => ({ ...i, qtd: 0 })));
      setCliente("");
      setObservacao("");
      setMostrarResumo(false);
      alert("Pedido enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      alert("Erro ao enviar pedido");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">🥟 Sistema de Pedidos de Salgadinhos byPerego</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 mb-4">
        <label className="block mb-2 font-semibold">Nome do Cliente:</label>
        <input value={cliente} onChange={e => setCliente(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
        <label className="block mb-2 font-semibold">Observações:</label>
        <input value={observacao} onChange={e => setObservacao(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
      </div>

      <Misto onChange={handleMisto} />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 mb-4">
        {itens.map(item => (
          <ProdutoItem key={item.id} item={item} incrementar={incrementar} decrementar={decrementar} />
        ))}
        <div className="text-right mt-4">
          <p className="text-xl font-bold text-gray-700">Total: R$ {total.toFixed(2)}</p>
        </div>
        <button
          onClick={() => setMostrarResumo(true)}
          disabled={total === 0}
          className={`w-full mt-6 py-2 rounded-lg text-lg font-semibold ${total === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white shadow"}`}
        >
          Finalizar Pedido
        </button>
      </div>

      {mostrarResumo && (
        <ResumoPedido
          itens={itens}
          total={total}
          onClose={() => setMostrarResumo(false)}
          onConfirm={handleFinalizarPedido}
        />
      )}
    </div>
  );
}
