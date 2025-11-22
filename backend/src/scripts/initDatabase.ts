import pool from "../config/database";
import fs from "fs";
import path from "path";

async function runMigration() {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("🔄 Iniciando migração do banco de dados...\n");

    // ============= TABELA USUARIOS =============
    console.log("📋 Criando tabela USUARIOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('client', 'employee', 'admin') NOT NULL,
        restaurantId VARCHAR(50),
        isActive BOOLEAN DEFAULT true,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela USUARIOS criada com sucesso!\n");

    // ============= TABELA RESTAURANTES =============
    console.log("📋 Criando tabela RESTAURANTES...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS restaurantes (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        email VARCHAR(255),
        phone VARCHAR(20),
        isActive BOOLEAN DEFAULT true,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela RESTAURANTES criada com sucesso!\n");

    // ============= TABELA CATEGORIAS =============
    console.log("📋 Criando tabela CATEGORIAS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        restaurantId VARCHAR(50) NOT NULL,
        isActive BOOLEAN DEFAULT true,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurantId) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_restaurantId (restaurantId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela CATEGORIAS criada com sucesso!\n");

    // ============= TABELA PRODUTOS =============
    console.log("📋 Criando tabela PRODUTOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS produtos (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        categoryId VARCHAR(50) NOT NULL,
        restaurantId VARCHAR(50) NOT NULL,
        stockQuantity INT DEFAULT 0,
        isActive BOOLEAN DEFAULT true,
        isFeatured BOOLEAN DEFAULT false,
        rating DECIMAL(3,1) DEFAULT 0,
        reviewsCount INT DEFAULT 0,
        preparationTime INT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categorias(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurantId) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_categoryId (categoryId),
        INDEX idx_restaurantId (restaurantId),
        INDEX idx_isActive (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela PRODUTOS criada com sucesso!\n");

    // ============= TABELA VARIACOES =============
    console.log("📋 Criando tabela VARIACOES...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS variacoes (
        id VARCHAR(50) PRIMARY KEY,
        productId VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES produtos(id) ON DELETE CASCADE,
        INDEX idx_productId (productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela VARIACOES criada com sucesso!\n");

    // ============= TABELA ADICIONAIS =============
    console.log("📋 Criando tabela ADICIONAIS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adicionais (
        id VARCHAR(50) PRIMARY KEY,
        productId VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES produtos(id) ON DELETE CASCADE,
        INDEX idx_productId (productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela ADICIONAIS criada com sucesso!\n");

    // ============= TABELA PEDIDOS =============
    console.log("📋 Criando tabela PEDIDOS...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id VARCHAR(50) PRIMARY KEY,
        customerId VARCHAR(50) NOT NULL,
        customerName VARCHAR(255),
        customerPhone VARCHAR(20),
        restaurantId VARCHAR(50) NOT NULL,
        restaurantName VARCHAR(255),
        paymentMethod VARCHAR(50),
        subtotal DECIMAL(10,2) NOT NULL,
        deliveryFee DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled') DEFAULT 'pending',
        deliveryAddress TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurantId) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_customerId (customerId),
        INDEX idx_restaurantId (restaurantId),
        INDEX idx_status (status),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabela PEDIDOS criada com sucesso!\n");

    // ============= TABELA ITENS_PEDIDO =============
    console.log("📋 Criando tabela ITENS_PEDIDO...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId VARCHAR(50) NOT NULL,
        productId VARCHAR(50) NOT NULL,
        productName VARCHAR(255),
        variationId VARCHAR(50),
        variationName VARCHAR(255),
        quantity INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES produtos(id),
        INDEX idx_orderId (orderId),
        INDEX idx_productId (productId)
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
      console.log(`📤 Inserindo ${usuarios.length} usuários...`);

      for (const usuario of usuarios) {
        await connection.execute(
          `INSERT INTO usuarios (id, name, email, password, phone, role, restaurantId, isActive, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            usuario.id,
            usuario.name,
            usuario.email,
            usuario.password,
            usuario.phone || null,
            usuario.role,
            usuario.restaurantId || null,
            usuario.isActive !== false,
            usuario.createdAt || new Date().toISOString(),
          ]
        );
      }
      console.log("✅ Usuários inseridos com sucesso!\n");
    }

    // Inserir restaurantes padrão
    console.log("📤 Inserindo restaurantes...");
    await connection.execute(
      `INSERT IGNORE INTO restaurantes (id, name, description, email, phone, isActive)
       VALUES ('rest-1', 'Pizzaria Bella Napoli', 'Melhor pizzaria da cidade', 'pizza@email.com', '8533333333', true)`
    );
    console.log("✅ Restaurantes inseridos com sucesso!\n");

    // Inserir categorias padrão
    console.log("📤 Inserindo categorias...");
    await connection.execute(
      `INSERT IGNORE INTO categorias (id, name, description, restaurantId, isActive)
       VALUES 
       ('cat-1', 'Pizzas', 'Pizzas deliciosas', 'rest-1', true),
       ('cat-2', 'Bebidas', 'Bebidas variadas', 'rest-1', true)`
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
          `INSERT INTO produtos (id, name, description, image, categoryId, restaurantId, stockQuantity, isActive, isFeatured, rating, reviewsCount, preparationTime)
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
              `INSERT INTO variacoes (id, productId, name, price)
               VALUES (?, ?, ?, ?)`,
              [variation.id, produto.id, variation.name, variation.price]
            );
          }
        }

        // Inserir adicionais
        if (produto.addons && Array.isArray(produto.addons)) {
          for (const addon of produto.addons) {
            await connection.execute(
              `INSERT INTO adicionais (id, productId, name, price)
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

      for (const pedido of pedidos) {
        // Validar dados obrigatórios
        if (!pedido.id || !pedido.customerId || !pedido.restaurantId || !pedido.total) {
          console.warn(`⚠️ Pedido ${pedido.id} ignorado por dados inválidos`);
          continue;
        }

        const deliveryAddressStr = pedido.deliveryAddress
          ? typeof pedido.deliveryAddress === "string"
            ? pedido.deliveryAddress
            : JSON.stringify(pedido.deliveryAddress)
          : null;

        try {
          await connection.execute(
            `INSERT INTO pedidos (id, customerId, customerName, customerPhone, restaurantId, restaurantName, paymentMethod, subtotal, deliveryFee, discount, total, status, deliveryAddress, createdAt, updatedAt)
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
              pedido.createdAt || new Date().toISOString(),
              pedido.updatedAt || new Date().toISOString(),
            ]
          );

          // Inserir itens do pedido
          if (pedido.items && Array.isArray(pedido.items)) {
            for (const item of pedido.items) {
              await connection.execute(
                `INSERT INTO itens_pedido (orderId, productId, productName, variationId, variationName, quantity, subtotal)
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
    console.log("  - restaurantes");
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
