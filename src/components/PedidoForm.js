export default function PedidoForm({ formData, onChange }) {
  return (
    <div className="bg-white p-5 mt-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-orange-700 mb-4">
        📋 Dados do Pedido
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="cliente"
          placeholder="Nome do Cliente"
          value={formData.cliente}
          onChange={onChange}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="observacao"
          placeholder="Observações (opcional)"
          value={formData.observacao}
          onChange={onChange}
          className="border rounded-lg p-2"
        />
        <input
          type="date"
          name="data_agendada"
          value={formData.data_agendada}
          onChange={onChange}
          className="border rounded-lg p-2"
        />
        <input
          type="time"
          name="hora_agendada"
          value={formData.hora_agendada}
          onChange={onChange}
          className="border rounded-lg p-2"
        />
      </div>
    </div>
  );
}
