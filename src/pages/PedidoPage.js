import React, { useEffect, useState } from "react";
import axios from "axios";
import ProdutoItem from "../components/ProdutoItem";
import PedidoResumo from "../components/PedidoResumo";

export default function PedidoPage() {
  const [produtos, setProdutos] = useState([]);
  const [cliente, setCliente] = useState("");
  const [observacao, setObservacao] = useState("");
  const [dataAgendada, setDataAgendada] = useState("");
  const [horaAgendada, setHoraAgendada] = useState("");
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [total, setTotal] = useState(0);
  const [misto, setMisto] = useState(0);

  useEffect(() => {
    //axios.get("http://192.168.10.14:5000/api/produtos")
    axios.get("${process.env.REACT_APP_API_URL}/api/produtos")
      .then(res => {
        const produtosComQtd = res.data.map(p => ({ ...p, qtd: 0 }));
        setProdutos(produtosComQtd);
      })
      .catch(err => console.error("Erro ao buscar produtos:", err));
  }, []);

  useEffect(() => {
    const soma = produtos.reduce((acc, i) => acc + i.qtd * i.preco, 0);
    setTotal(soma);
  }, [produtos]);

  const incrementar = (id) => {
    setProdutos(produtos.map(p => p.id === id ? { ...p, qtd: p.qtd + 1 } : p));
  };

  const decrementar = (id) => {
    setProdutos(produtos.map(p => p.id === id && p.qtd > 0 ? { ...p, qtd: p.qtd - 1 } : p));
  };

  const distribuirMisto = (totalMisto) => {
    if (totalMisto <= 0) return;

    const newProdutos = produtos.map(p => ({ ...p, qtd: 0 }));

    const pastel = newProdutos.find(p => p.nome.toLowerCase().includes("pastel"));
    const coxinha = newProdutos.find(p => p.nome.toLowerCase().includes("coxinha"));
    const outros = newProdutos.filter(p => p !== pastel && p !== coxinha);

    const n = newProdutos.length;
    const base = Math.floor(totalMisto / n);

    // quantidade de pastel e coxinha
    const qtdPastel = pastel ? Math.round(base * 1.3) : 0;
    const qtdCoxinha = coxinha ? Math.round(base * 1.1) : 0;

    // restante para os outros produtos
    let restante = totalMisto - qtdPastel - qtdCoxinha;

    outros.forEach((p, i) => {
      p.qtd = i === outros.length - 1 ? restante : Math.floor(restante / outros.length);
    });

    if (pastel) pastel.qtd = qtdPastel;
    if (coxinha) coxinha.qtd = qtdCoxinha;

    setProdutos(newProdutos);
  };

  const handleMistoChange = (e) => {
    const valor = parseInt(e.target.value) || 0;
    setMisto(valor);
    distribuirMisto(valor);
  };

  const handleFinalizar = async () => {
    try {
      const itensEnviados = produtos.filter(p => p.qtd > 0);
      //await axios.post("http://192.168.10.14:5000/api/pedidos", {
      await axios.post("${process.env.REACT_APP_API_URL}/api/pedidos",{
        cliente,
        observacao,
        data_agendada: dataAgendada,
        hora_agendada: horaAgendada,
        itens: itensEnviados
      });
      alert("Pedido confirmado!");
      setProdutos(produtos.map(p => ({ ...p, qtd: 0 })));
      setCliente("");
      setObservacao("");
      setMisto(0);
      setMostrarResumo(false);
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      alert("Erro ao enviar pedido");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">🥟 Sistema de Pedidos de Salgadinhos</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4">
        <div className="mb-4">
          <label>Nome do Cliente:</label>
          <input value={cliente} onChange={e => setCliente(e.target.value)} className="border w-full px-2 py-1 rounded" />
        </div>

        <div className="mb-4">
          <label>Observações:</label>
          <input value={observacao} onChange={e => setObservacao(e.target.value)} className="border w-full px-2 py-1 rounded" />
        </div>

        <div className="mb-4 flex space-x-2">
          <div>
            <label>Data agendada:</label>
            <input type="date" value={dataAgendada} onChange={e => setDataAgendada(e.target.value)} className="border px-2 py-1 rounded" />
          </div>
          <div>
            <label>Hora agendada:</label>
            <input type="time" value={horaAgendada} onChange={e => setHoraAgendada(e.target.value)} className="border px-2 py-1 rounded" />
          </div>
        </div>

        <div className="mb-4">
          <label>Misto (quantidade total):</label>
          <input type="number" value={misto} onChange={handleMistoChange} className="border w-full px-2 py-1 rounded" />
        </div>

        <h2 className="font-semibold text-lg mb-2">Cardápio</h2>

        {produtos.length === 0 ? (
          <p>Carregando produtos...</p>
        ) : (
          produtos.map(p => (
            <ProdutoItem key={p.id} produto={p} onIncrement={incrementar} onDecrement={decrementar} />
          ))
        )}

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
        <PedidoResumo
          itens={produtos}
          total={total}
          onClose={() => setMostrarResumo(false)}
          onConfirm={handleFinalizar}
        />
      )}
    </div>
  );
}
