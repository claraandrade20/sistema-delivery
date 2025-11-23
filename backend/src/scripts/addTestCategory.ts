import pool from "../config/database";

async function addTestCategory() {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("🔄 Adicionando categoria de teste para demonstração...\n");

    // Inserir categoria de teste
    const [result] = await connection.query<any>(
      `INSERT INTO categorias (nome, descricao, imagem, id_restaurantes, ativo)
       VALUES (?, ?, ?, ?, ?)`,
      [
        "🗑️ Categoria Para Exclusão Teste",
        "Esta categoria é apenas para demonstração ao professor. Pode ser excluída para mostrar a funcionalidade de exclusão no banco de dados.",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
        1, // id_restaurantes (Pizzaria Bella Napoli)
        true, // ativo
      ]
    );

    const categoriaId = (result as any).insertId;

    console.log(`✅ Categoria de teste adicionada com ID: ${categoriaId}`);
    console.log("📝 Nome: 🗑️ Categoria Para Exclusão Teste");
    console.log("✨ Esta categoria está visível na listagem e pode ser excluída!");
    console.log("\n🎯 Para demonstrar ao professor:");
    console.log("1. Veja a categoria na tela de Gerenciar Categorias");
    console.log("2. Clique no botão de excluir (lixeira)");
    console.log("3. A categoria será removida do banco de dados MySQL");
    console.log("4. A exclusão será permanente e contabilizada no banco!\n");
  } catch (error) {
    console.error("❌ Erro ao adicionar categoria de teste:", error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Executar
addTestCategory().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
