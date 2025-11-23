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
      'cupons',
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
        id_restaurantes INT NOT NULL,
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
        cidade VARCHAR(255),
        estado VARCHAR(2),
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
        id_restaurantes INT NOT NULL,
        dia_semana TINYINT NOT NULL,
        nome_dia VARCHAR(20) NOT NULL,
        hora_inicio TIME DEFAULT NULL,
        hora_fim TIME DEFAULT NULL,
        fechado BOOLEAN DEFAULT FALSE,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_restaurantes) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_restaurantes (id_restaurantes),
        INDEX idx_dia_semana (dia_semana)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela HORARIO_FUNCIONAMENTO criada com sucesso!\n");

    // ============= TABELA CUPONS =============
    console.log("📋 Criando tabela CUPONS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        descricao VARCHAR(255),
        tipo_desconto ENUM('percentual', 'fixo') NOT NULL DEFAULT 'percentual',
        valor_desconto DECIMAL(10,2) NOT NULL,
        uso_minimo DECIMAL(10,2) DEFAULT 0,
        quantidade_total INT NOT NULL,
        quantidade_usada INT DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        data_inicio DATE NOT NULL,
        data_fim DATE NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_codigo (codigo),
        INDEX idx_ativo (ativo),
        INDEX idx_data_inicio (data_inicio),
        INDEX idx_data_fim (data_fim)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela CUPONS criada com sucesso!\n");

    // ============= TABELA CATEGORIAS =============
    console.log("📋 Criando tabela CATEGORIAS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        id_restaurantes INT NOT NULL,
        ativo BOOLEAN DEFAULT true,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_restaurantes) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_restaurantes (id_restaurantes)
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
        id_restaurantes INT NOT NULL,
        quantidade_estoque INT DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        destaque BOOLEAN DEFAULT false,
        avaliacao DECIMAL(3,1) DEFAULT 0,
        total_avaliacoes INT DEFAULT 0,
        tempo_preparo INT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE,
        FOREIGN KEY (id_restaurantes) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_categoria (id_categoria),
        INDEX idx_id_restaurantes (id_restaurantes),
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
        id_restaurantes INT NOT NULL,
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
        FOREIGN KEY (id_restaurantes) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_id_cliente (id_cliente),
        INDEX idx_id_restaurantes (id_restaurantes),
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
    const cuponsPath = path.join(__dirname, "../data/cupons.json");

    // Migrate Usuários
    if (fs.existsSync(usuariosPath)) {
      const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
      console.log(`📤 Inserindo usuários (admin e funcionários)...`);

      let usuarioId = 1;
      let clienteId = 1;

      for (const usuario of usuarios) {
        // Validar dados
        if (!usuario.name || !usuario.email) {
          console.warn(`⚠️ Usuário ignorado - dados obrigatórios inválidos`);
          continue;
        }

        // Validar e limpar phone (deve conter apenas números e caracteres de telefone válidos)
        let phone = usuario.phone || null;
        if (phone && phone.includes('@')) {
          phone = null; // Se contém @, é email, não telefone
        }

        // Apenas inserir admin e employee na tabela usuarios
        if (usuario.role === "employee" || usuario.role === "admin") {
          // Converter restaurantId para número ou usar 1 como padrão
          let restaurantId = 1;
          if (usuario.restaurantId) {
            const parsed = parseInt(usuario.restaurantId);
            if (!isNaN(parsed)) {
              restaurantId = parsed;
            }
          }

          try {
            await connection.execute(
              `INSERT INTO usuarios (nome, email, senha, telefone, funcao, id_restaurantes, ativo)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                usuario.name,
                usuario.email,
                usuario.password,
                phone,
                usuario.role === "admin" ? "administrador" : "funcionario",
                restaurantId,
                usuario.isActive !== false,
              ]
            );
            usuarioId++;
          } catch (error) {
            console.warn(`⚠️ Erro ao inserir usuário:`, (error as any).message);
          }
        }
        // Inserir clientes na tabela clientes
        else if (usuario.role === "client") {
          try {
            await connection.execute(
              `INSERT INTO clientes (nome, email, senha, telefone, ativo)
               VALUES (?, ?, ?, ?, ?)`,
              [
                usuario.name,
                usuario.email,
                usuario.password,
                phone,
                usuario.isActive !== false,
              ]
            );
            clienteId++;
          } catch (error) {
            console.warn(`⚠️ Erro ao inserir cliente:`, (error as any).message);
          }
        }
      }
      console.log("✅ Usuários e clientes inseridos com sucesso!\n");
    }

    // Inserir restaurantes padrão
    console.log("📤 Inserindo restaurantes...");
    await connection.execute(
      `INSERT INTO restaurantes (nome, descricao, email, telefone, ativo)
       VALUES ('Pizzaria Bella Napoli', 'Melhor pizzaria da cidade', 'pizza@email.com', '8533333333', true)`
    );
    await connection.execute(
      `INSERT INTO restaurantes (nome, descricao, email, telefone, ativo)
       VALUES ('Burger House Premium', 'Hambúrgueres gourmet irresistíveis', 'burger@email.com', '8534444444', true)`
    );
    console.log("✅ Restaurantes inseridos com sucesso!\n");

    // Inserir categorias padrão
    console.log("📤 Inserindo categorias...");
    await connection.execute(
      `INSERT INTO categorias (nome, descricao, id_restaurantes, ativo)
       VALUES 
       ('Pizzas', 'Pizzas deliciosas', 1, true),
       ('Bebidas', 'Bebidas variadas', 1, true),
       ('Sobremesas', 'Doces e sobremesas deliciosas', 1, true),
       ('Massas', 'Massas frescas e tradicionais', 1, true),
       ('Saladas', 'Saladas frescas e saudáveis', 1, true),
       ('Hambúrgueres', 'Burgers artesanais e gourmet', 2, true)`
    );
    console.log("✅ Categorias inseridas com sucesso!\n");

    // Inserir horários de funcionamento padrão
    console.log("📤 Inserindo horários de funcionamento...");
    const diasSemana = [
      { dia_semana: 0, nome_dia: 'Domingo', hora_inicio: '11:00', hora_fim: '23:00' },
      { dia_semana: 1, nome_dia: 'Segunda', hora_inicio: '11:00', hora_fim: '23:00' },
      { dia_semana: 2, nome_dia: 'Terça', hora_inicio: '11:00', hora_fim: '23:00' },
      { dia_semana: 3, nome_dia: 'Quarta', hora_inicio: '11:00', hora_fim: '23:00' },
      { dia_semana: 4, nome_dia: 'Quinta', hora_inicio: '11:00', hora_fim: '23:00' },
      { dia_semana: 5, nome_dia: 'Sexta', hora_inicio: '11:00', hora_fim: '00:00' },
      { dia_semana: 6, nome_dia: 'Sábado', hora_inicio: '11:00', hora_fim: '00:00' },
    ];

    for (const dia of diasSemana) {
      await connection.execute(
        `INSERT INTO horario_funcionamento (id_restaurantes, dia_semana, nome_dia, hora_inicio, hora_fim, fechado)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [1, dia.dia_semana, dia.nome_dia, dia.hora_inicio, dia.hora_fim, false]
      );
    }
    console.log("✅ Horários de funcionamento inseridos com sucesso!\n");

    // Migrate Cupons
    if (fs.existsSync(cuponsPath)) {
      const cupons = JSON.parse(fs.readFileSync(cuponsPath, "utf-8"));
      console.log(`📤 Inserindo ${cupons.length} cupons...`);

      for (const cupom of cupons) {
        try {
          await connection.execute(
            `INSERT INTO cupons (codigo, descricao, tipo_desconto, valor_desconto, uso_minimo, quantidade_total, ativo, data_inicio, data_fim)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              cupom.codigo,
              cupom.descricao || null,
              cupom.tipoDesconto || "percentual",
              cupom.valorDesconto,
              cupom.usoMinimo || 0,
              cupom.quantidadeTotal,
              true,
              cupom.dataInicio,
              cupom.dataFim,
            ]
          );
        } catch (error) {
          console.warn(`⚠️ Erro ao inserir cupom ${cupom.codigo}:`, (error as any).message);
        }
      }
      console.log("✅ Cupons inseridos com sucesso!\n");
    }

    // Migrate Produtos com Variações e Adicionais
    if (fs.existsSync(produtosPath)) {
      const produtos = JSON.parse(fs.readFileSync(produtosPath, "utf-8"));
      console.log(`📤 Inserindo ${produtos.length} produtos...`);

      let produtoId = 1;
      
      for (const produto of produtos) {
        // Converter categoryId e restaurantId para números
        let categoryId = 1; // padrão
        if (produto.categoryId) {
          const parsed = parseInt(produto.categoryId);
          categoryId = isNaN(parsed) ? 1 : parsed;
        }
        
        let restaurantId = 1; // padrão
        if (produto.restaurantId) {
          const parsed = parseInt(produto.restaurantId);
          restaurantId = isNaN(parsed) ? 1 : parsed;
        }

        try {
          // Inserir produto deixando MySQL gerar ID automaticamente
          const [result] = await connection.query<any>(
            `INSERT INTO produtos (nome, descricao, imagem, id_categoria, id_restaurantes, quantidade_estoque, ativo, destaque, avaliacao, total_avaliacoes, tempo_preparo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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

          const insertedProdutoId = (result as any).insertId;

          // Inserir variações
          if (produto.variations && Array.isArray(produto.variations)) {
            for (const variation of produto.variations) {
              await connection.execute(
                `INSERT INTO variacoes (id_produto, nome, preco)
                 VALUES (?, ?, ?)`,
                [insertedProdutoId, variation.name, variation.price]
              );
            }
          }

          // Inserir adicionais
          if (produto.addons && Array.isArray(produto.addons)) {
            for (const addon of produto.addons) {
              await connection.execute(
                `INSERT INTO adicionais (id_produto, nome, preco)
                 VALUES (?, ?, ?)`,
                [insertedProdutoId, addon.name, addon.price]
              );
            }
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao inserir produto ${produto.name}:`, (error as any).message);
        }
      }
      console.log("✅ Produtos, variações e adicionais inseridos com sucesso!\n");
    }

    // Migrate Pedidos
    if (fs.existsSync(pedidosPath)) {
      const pedidos = JSON.parse(fs.readFileSync(pedidosPath, "utf-8"));
      console.log(`📤 Inserindo ${pedidos.length} pedidos...`);

      const insertedPedidoIds = new Set<number>();

      for (const pedido of pedidos) {
        // Validar dados obrigatórios
        if (!pedido.customerId || !pedido.restaurantId || pedido.total === undefined) {
          console.warn(`⚠️ Pedido ignorado por dados inválidos`);
          continue;
        }

        // Converter restaurantId e customerId para números
        let customerId = parseInt(pedido.customerId);
        let restaurantId = parseInt(pedido.restaurantId);
        
        if (isNaN(customerId) || isNaN(restaurantId)) {
          console.warn(`⚠️ Pedido ignorado - IDs inválidos`);
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
          const [result] = await connection.query<any>(
            `INSERT INTO pedidos (id_cliente, nome_cliente, telefone_cliente, id_restaurantes, nome_restaurante, metodo_pagamento, subtotal, taxa_entrega, desconto, total, status, endereco_entrega, criado_em, atualizado_em)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              customerId,
              pedido.customerName || null,
              pedido.customerPhone || null,
              restaurantId,
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

          const insertedPedidoId = (result as any).insertId;
          insertedPedidoIds.add(insertedPedidoId);

          // Inserir itens do pedido - usar IDs reais dos produtos inseridos
          if (pedido.items && Array.isArray(pedido.items)) {
            for (const item of pedido.items) {
              // Converter productId para número
              let produtoId = parseInt(item.productId);
              if (isNaN(produtoId) || produtoId < 1) {
                continue; // Pular item com ID inválido
              }
              
              let variacaoId: number | null = null;
              if (item.variationId) {
                const parsed = parseInt(item.variationId);
                if (!isNaN(parsed) && parsed > 0) {
                  variacaoId = parsed;
                }
              }

              await connection.execute(
                `INSERT INTO itens_pedido (id_pedido, id_produto, nome_produto, id_variacao, nome_variacao, quantidade, subtotal)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  insertedPedidoId,
                  produtoId,
                  item.productName || null,
                  variacaoId,
                  item.variationName || null,
                  item.quantity || 1,
                  item.subtotal || item.price * (item.quantity || 1) || 0,
                ]
              );
            }
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao inserir pedido:`, (error as any).message);
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
    console.log("  - cupons");
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
