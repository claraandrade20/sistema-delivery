import pool from "../config/database";

async function addTestProduct() {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("🔄 Adicionando produto de teste para demonstração...\n");

    // Inserir produto de teste
    const [result] = await connection.query<any>(
      `INSERT INTO produtos (nome, descricao, imagem, id_categoria, id_restaurantes, quantidade_estoque, ativo, destaque, avaliacao, total_avaliacoes, tempo_preparo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "🗑️ Produto Para Exclusão Teste",
        "Este produto é apenas para demonstração.",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        1, // id_categoria (Pizzas)
        1, // id_restaurantes (Pizzaria Bella Napoli)
        999, // quantidade_estoque
        true, // ativo
        true, // destaque
        5.0, // avaliacao
        100, // total_avaliacoes
        15, // tempo_preparo
      ]
    );

    const produtoId = (result as any).insertId;

    // Adicionar variações
    await connection.query(
      `INSERT INTO variacoes (id_produto, nome, preco) VALUES (?, ?, ?)`,
      [produtoId, "Tamanho Pequeno", 19.90]
    );
    await connection.query(
      `INSERT INTO variacoes (id_produto, nome, preco) VALUES (?, ?, ?)`,
      [produtoId, "Tamanho Médio", 29.90]
    );
    await connection.query(
      `INSERT INTO variacoes (id_produto, nome, preco) VALUES (?, ?, ?)`,
      [produtoId, "Tamanho Grande", 39.90]
    );

    // Adicionar adicionais
    await connection.query(
      `INSERT INTO adicionais (id_produto, nome, preco) VALUES (?, ?, ?)`,
      [produtoId, "Queijo Extra", 5.00]
    );
    await connection.query(
      `INSERT INTO adicionais (id_produto, nome, preco) VALUES (?, ?, ?)`,
      [produtoId, "Borda Recheada", 8.00]
    );

    console.log(`✅ Produto de teste adicionado com ID: ${produtoId}`);
    console.log("📝 Nome: 🗑️ Produto Para Exclusão Teste");
    console.log("✨ Este produto está visível na listagem e pode ser excluído!");
    console.log("\n🎯 Para demonstrar ao professor:");
    console.log("1. Veja o produto na tela de Gerenciar Produtos");
    console.log("2. Clique no botão de excluir (lixeira)");
    console.log("3. O produto será removido do banco de dados MySQL");
    console.log("4. A exclusão será permanente e contabilizada no banco!\n");
  } catch (error) {
    console.error("❌ Erro ao adicionar produto de teste:", error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Executar
addTestProduct().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
