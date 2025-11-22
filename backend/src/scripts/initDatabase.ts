import pool from "../config/database";
import fs from "fs";
import path from "path";

async function runMigration() {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("🔄 Iniciando migração do banco de dados...\n");

    // ============= DROPAR TABELAS EXISTENTES =============
    console.log("🗑️ Limpando tabelas existentes...");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    
    const tablesToDrop = [
      'horario_funcionamento',
      'itens_pedido',
      'pedidos',
      'adicionais',
      'variacoes',
      'produtos',
      'categorias',
      'restaurantes',
      'enderecos',
      'clientes',
      'usuarios'
    ];

    for (const table of tablesToDrop) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS ${table}`);
      } catch (error) {
        // Ignorar erro se tabela não existir
      }
    }
    
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Tabelas antigas removidas!\n");

    // ============= TABELA USUARIOS =============
    console.log("📋 Criando tabela USUARIOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(100),
        funcao ENUM('funcionario', 'administrador') NOT NULL,
        id_restaurante INT NOT NULL,
        ativo BOOLEAN DEFAULT true,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_funcao (funcao)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela USUARIOS criada com sucesso!\n");

    // ============= TABELA CLIENTES =============
    console.log("📋 Criando tabela CLIENTES...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(100),
        ativo BOOLEAN DEFAULT true,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela CLIENTES criada com sucesso!\n");

    // ============= TABELA ENDERECOS =============
    console.log("📋 Criando tabela ENDERECOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enderecos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT NOT NULL,
        rua VARCHAR(255) NOT NULL,
        numero VARCHAR(20) NOT NULL,
        complemento VARCHAR(255),
        bairro VARCHAR(255) NOT NULL,
        endereco TEXT NOT NULL,
        status ENUM('principal', 'secundario') DEFAULT 'secundario',
        FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
        INDEX idx_id_cliente (id_cliente),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela ENDERECOS criada com sucesso!\n");

    // ============= TABELA RESTAURANTES =============
    console.log("📋 Criando tabela RESTAURANTES...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS restaurantes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        imagem VARCHAR(500),
        email VARCHAR(255),
        telefone VARCHAR(20),
        ativo BOOLEAN DEFAULT true,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_nome (nome)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela RESTAURANTES criada com sucesso!\n");

    // ============= TABELA HORARIO_FUNCIONAMENTO =============
    console.log("📋 Criando tabela HORARIO_FUNCIONAMENTO...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS horario_funcionamento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_restaurante INT NOT NULL,
        dia_semana TINYINT NOT NULL,
        nome_dia VARCHAR(20) NOT NULL,
        hora_inicio TIME DEFAULT NULL,
        hora_fim TIME DEFAULT NULL,
        fechado BOOLEAN DEFAULT FALSE,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_restaurante (id_restaurante),
        INDEX idx_dia_semana (dia_semana)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela HORARIO_FUNCIONAMENTO criada com sucesso!\n");

    // ============= TABELA CATEGORIAS =============
    console.log("📋 Criando tabela CATEGORIAS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        id_restaurante INT NOT NULL,
        ativo BOOLEAN DEFAULT true,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_restaurante (id_restaurante)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela CATEGORIAS criada com sucesso!\n");

    // ============= TABELA PRODUTOS =============
    console.log("📋 Criando tabela PRODUTOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        imagem VARCHAR(500),
        id_categoria INT NOT NULL,
        id_restaurante INT NOT NULL,
        quantidade_estoque INT DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        destaque BOOLEAN DEFAULT false,
        avaliacao DECIMAL(3,1) DEFAULT 0,
        total_avaliacoes INT DEFAULT 0,
        tempo_preparo INT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE,
        FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_categoria (id_categoria),
        INDEX idx_id_restaurante (id_restaurante),
        INDEX idx_ativo (ativo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela PRODUTOS criada com sucesso!\n");

    // ============= TABELA VARIACOES =============
    console.log("📋 Criando tabela VARIACOES...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS variacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_produto INT NOT NULL,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
        INDEX idx_id_produto (id_produto)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela VARIACOES criada com sucesso!\n");

    // ============= TABELA ADICIONAIS =============
    console.log("📋 Criando tabela ADICIONAIS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adicionais (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_produto INT NOT NULL,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
        INDEX idx_id_produto (id_produto)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela ADICIONAIS criada com sucesso!\n");

    // ============= TABELA PEDIDOS =============
    console.log("📋 Criando tabela PEDIDOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT NOT NULL,
        nome_cliente VARCHAR(255),
        telefone_cliente VARCHAR(20),
        id_restaurante INT NOT NULL,
        nome_restaurante VARCHAR(255),
        metodo_pagamento VARCHAR(50),
        subtotal DECIMAL(10,2) NOT NULL,
        taxa_entrega DECIMAL(10,2) DEFAULT 0,
        desconto DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled', 'pendente', 'confirmado', 'preparando', 'pronto', 'a_caminho', 'entregue', 'cancelado') DEFAULT 'pending',
        endereco_entrega TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_cliente (id_cliente),
        INDEX idx_id_restaurante (id_restaurante),
        INDEX idx_status (status),
        INDEX idx_criado_em (criado_em)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela PEDIDOS criada com sucesso!\n");

    // ============= TABELA ITENS_PEDIDO =============
    console.log("📋 Criando tabela ITENS_PEDIDO...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_pedido INT NOT NULL,
        id_produto INT NOT NULL,
        nome_produto VARCHAR(255),
        id_variacao INT,
        nome_variacao VARCHAR(255),
        quantidade INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (id_produto) REFERENCES produtos(id),
        INDEX idx_id_pedido (id_pedido),
        INDEX idx_id_produto (id_produto)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela ITENS_PEDIDO criada com sucesso!\n");

    // ============= MIGRANDO DADOS =============
    console.log("🔄 Migrando dados dos JSONs...\n");

    // Ler dados dos arquivos JSON
    const usuariosPath = path.join(__dirname, "../data/usuarios.json");
    const produtosPath = path.join(__dirname, "../data/produtos.json");
    const pedidosPath = path.join(__dirname, "../data/pedidos.json");

    // Migrate Usuários
    if (fs.existsSync(usuariosPath)) {
      const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
      console.log(`📤 Inserindo usuários (admin e funcionários)...`);

      for (const usuario of usuarios) {
        // Converter data ISO para formato MySQL
        const createdAt = usuario.createdAt 
          ? new Date(usuario.createdAt).toISOString().replace('T', ' ').substring(0, 19)
          : new Date().toISOString().replace('T', ' ').substring(0, 19);

        // Validar e limpar phone (deve conter apenas números e caracteres de telefone válidos)
        let phone = usuario.phone || null;
        if (phone && phone.includes('@')) {
          phone = null; // Se contém @, é email, não telefone
        }

        // Apenas inserir admin e employee na tabela usuarios
        if (usuario.role === "employee" || usuario.role === "admin") {
          await connection.execute(
            `INSERT INTO usuarios (id, nome, email, senha, telefone, funcao, id_restaurante, ativo, criado_em)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              usuario.id,
              usuario.name,
              usuario.email,
              usuario.password,
              phone,
              usuario.role === "admin" ? "administrador" : "funcionario",
              usuario.restaurantId || null,
              usuario.isActive !== false,
              createdAt,
            ]
          );
        }
        // Inserir clientes na tabela clientes
        else if (usuario.role === "client") {
          await connection.execute(
            `INSERT INTO clientes (id, nome, email, senha, telefone, ativo, criado_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              usuario.id,
              usuario.name,
              usuario.email,
              usuario.password,
              phone,
              usuario.isActive !== false,
              createdAt,
            ]
          );
        }
      }
      console.log("✅ Usuários e clientes inseridos com sucesso!\n");
    }

    // Inserir restaurantes padrão
    console.log("📤 Inserindo restaurantes...");
    await connection.execute(
      `INSERT IGNORE INTO restaurantes (id, nome, descricao, email, telefone, ativo)
       VALUES ('1', 'Pizzaria Bella Napoli', 'Melhor pizzaria da cidade', 'pizza@email.com', '8533333333', true)`
    );
    console.log("✅ Restaurantes inseridos com sucesso!\n");

    // Inserir categorias padrão
    console.log("📤 Inserindo categorias...");
    await connection.execute(
      `INSERT IGNORE INTO categorias (id, nome, descricao, id_restaurante, ativo)
       VALUES 
       ('1', 'Pizzas', 'Pizzas deliciosas', '1', true),
       ('2', 'Bebidas', 'Bebidas variadas', '1', true)`
    );
    console.log("✅ Categorias inseridas com sucesso!\n");

    // Migrate Produtos com Variações e Adicionais
    if (fs.existsSync(produtosPath)) {
      const produtos = JSON.parse(fs.readFileSync(produtosPath, "utf-8"));
      console.log(`📤 Inserindo ${produtos.length} produtos...`);

      for (const produto of produtos) {
        const categoryId = produto.categoryId || "cat-1";
        const restaurantId = produto.restaurantId || "rest-1";

        // Inserir produto
        await connection.execute(
          `INSERT INTO produtos (id, nome, descricao, imagem, id_categoria, id_restaurante, quantidade_estoque, ativo, destaque, avaliacao, total_avaliacoes, tempo_preparo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            produto.id,
            produto.name,
            produto.description || null,
            produto.image || null,
            categoryId,
            restaurantId,
            produto.stockQuantity || 0,
            produto.available !== false && produto.isActive !== false,
            produto.isFeatured || false,
            produto.rating || 0,
            produto.reviewsCount || 0,
            produto.preparationTime || null,
          ]
        );

        // Inserir variações
        if (produto.variations && Array.isArray(produto.variations)) {
          for (const variation of produto.variations) {
            await connection.execute(
              `INSERT INTO variacoes (id, id_produto, nome, preco)
               VALUES (?, ?, ?, ?)`,
              [variation.id, produto.id, variation.name, variation.price]
            );
          }
        }

        // Inserir adicionais
        if (produto.addons && Array.isArray(produto.addons)) {
          for (const addon of produto.addons) {
            await connection.execute(
              `INSERT INTO adicionais (id, id_produto, nome, preco)
               VALUES (?, ?, ?, ?)`,
              [addon.id, produto.id, addon.name, addon.price]
            );
          }
        }
      }
      console.log("✅ Produtos, variações e adicionais inseridos com sucesso!\n");
    }

    // Migrate Pedidos
    if (fs.existsSync(pedidosPath)) {
      const pedidos = JSON.parse(fs.readFileSync(pedidosPath, "utf-8"));
      console.log(`📤 Inserindo ${pedidos.length} pedidos...`);

      const insertedPedidoIds = new Set<string>();

      for (const pedido of pedidos) {
        // Validar dados obrigatórios
        if (!pedido.id || !pedido.customerId || !pedido.restaurantId || !pedido.total) {
          console.warn(`⚠️ Pedido ${pedido.id} ignorado por dados inválidos`);
          continue;
        }

        // Evitar duplicatas
        if (insertedPedidoIds.has(pedido.id)) {
          console.warn(`⚠️ Pedido ${pedido.id} já foi inserido, pulando...`);
          continue;
        }

        // Converter datas ISO para formato MySQL
        const createdAtPedido = pedido.createdAt
          ? new Date(pedido.createdAt).toISOString().replace('T', ' ').substring(0, 19)
          : new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const updatedAtPedido = pedido.updatedAt
          ? new Date(pedido.updatedAt).toISOString().replace('T', ' ').substring(0, 19)
          : new Date().toISOString().replace('T', ' ').substring(0, 19);

        const deliveryAddressStr = pedido.deliveryAddress
          ? typeof pedido.deliveryAddress === "string"
            ? pedido.deliveryAddress
            : JSON.stringify(pedido.deliveryAddress)
          : null;

        try {
          await connection.execute(
            `INSERT INTO pedidos (id, id_cliente, nome_cliente, telefone_cliente, id_restaurante, nome_restaurante, metodo_pagamento, subtotal, taxa_entrega, desconto, total, status, endereco_entrega, criado_em, atualizado_em)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pedido.id,
              pedido.customerId,
              pedido.customerName || null,
              pedido.customerPhone || null,
              pedido.restaurantId,
              pedido.restaurantName || null,
              pedido.paymentMethod || null,
              pedido.subtotal || 0,
              pedido.deliveryFee || 0,
              pedido.discount || 0,
              pedido.total,
              pedido.status || "pending",
              deliveryAddressStr,
              createdAtPedido,
              updatedAtPedido,
            ]
          );

          insertedPedidoIds.add(pedido.id);

          // Inserir itens do pedido
          if (pedido.items && Array.isArray(pedido.items)) {
            for (const item of pedido.items) {
              await connection.execute(
                `INSERT INTO itens_pedido (id_pedido, id_produto, nome_produto, id_variacao, nome_variacao, quantidade, subtotal)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  pedido.id,
                  item.productId,
                  item.productName || null,
                  item.variationId || null,
                  item.variationName || null,
                  item.quantity || 1,
                  item.subtotal || item.price * (item.quantity || 1) || 0,
                ]
              );
            }
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao inserir pedido ${pedido.id}:`, error);
        }
      }
      console.log("✅ Pedidos e itens inseridos com sucesso!\n");
    }

    console.log("✨ Migração concluída com sucesso!");
    console.log("\n📊 Resumo das tabelas criadas:");
    console.log("  - usuarios");
    console.log("  - clientes");
    console.log("  - enderecos");
    console.log("  - restaurantes");
    console.log("  - horario_funcionamento");
    console.log("  - categorias");
    console.log("  - produtos");
    console.log("  - variacoes");
    console.log("  - adicionais");
    console.log("  - pedidos");
    console.log("  - itens_pedido");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Executar migração
runMigration().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
