import React, { useState } from "react";
import PedidoPage from "./pages/PedidoPage";
import FritagemPage from "./pages/FritagemPage";

export default function App() {
  const [tela, setTela] = useState("pedido");

  return (
    <div>
      <nav className="p-4 bg-orange-500 text-white flex space-x-4">
        <button onClick={() => setTela("pedido")} className="font-semibold hover:underline">Pedidos</button>
        <button onClick={() => setTela("fritagem")} className="font-semibold hover:underline">Fritagem</button>
      </nav>

      {tela === "pedido" ? <PedidoPage /> : <FritagemPage />}
    </div>
  );
}
