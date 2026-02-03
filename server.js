import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Conexão com MySQL
const db = await mysql.createPool({
  host: "192.168.10.14",
  user: "Ihm",
  password: "andre",
  database: "salgadinhos_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// ==================== Produtos ====================
app.get("/api/produtos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos WHERE ativo = 1");
    const produtos = rows.map(p => ({ ...p, preco: parseFloat(p.preco) }));
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// ==================== Pedidos ====================
app.post("/api/pedidos", async (req, res) => {
  const { cliente, observacao, data_agendada, hora_agendada, itens } = req.body;

  if (!cliente || !itens || itens.length === 0) {
    return res.status(400).json({ error: "Dados do pedido inválidos" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Inserir pedido
    const [result] = await conn.query(
      `INSERT INTO pedidos (nome_cliente, observacoes, data_agendada, hora_agendada, total) VALUES (?, ?, ?, ?, ?)`,
      [
        cliente,
        observacao,
        data_agendada || new Date().toISOString().split("T")[0],
        hora_agendada || new Date().toLocaleTimeString("pt-BR", { hour12: false }),
        itens.reduce((acc, i) => acc + i.qtd * i.preco, 0)
      ]
    );
    const pedidoId = result.insertId;

    // Inserir itens do pedido
    for (const item of itens) {
      const subtotal = item.qtd * item.preco;
      await conn.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, nome_produto, quantidade, preco_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pedidoId, item.id, item.nome, item.qtd, item.preco, subtotal]
      );
    }

    await conn.commit();
    res.json({ message: "Pedido salvo com sucesso!" });
  } catch (error) {
    await conn.rollback();
    console.error("❌ Erro ao salvar pedido:", error);
    res.status(500).json({ error: "Erro ao salvar pedido" });
  } finally {
    conn.release();
  }
});

// ==================== Fritagem / Ordem de Preparo ====================
app.get("/api/fritagem", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
  p.nome_cliente,
  p.data_agendada,
  p.hora_agendada,
  ip.produto_id,
  pr.nome AS produto,
  ip.quantidade AS qtd
FROM itens_pedido ip
JOIN pedidos p ON ip.pedido_id = p.id
JOIN produtos pr ON ip.produto_id = pr.id
ORDER BY p.data_agendada, p.hora_agendada
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar fritagem:", error);
    res.status(500).json({ error: "Erro ao buscar fritagem" });
  }
});

app.listen(5000, () => console.log("✅ Servidor rodando em http://192.168.10.14:5000"));
