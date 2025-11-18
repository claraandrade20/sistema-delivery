import pool from "../config/database";
import { ResultSetHeader } from "mysql2/promise";

async function initDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log("🔧 Inicializando banco de dados...");

    // Criar tabelas
    console.log("📋 Criando tabelas...");

    // Tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('client', 'employee', 'admin') DEFAULT 'client',
        restaurantId VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        isActive BOOLEAN DEFAULT TRUE,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabela de restaurantes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS restaurantes (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        endereco VARCHAR(255),
        telefone VARCHAR(20),
        horarioAbertura VARCHAR(5),
        horarioFechamento VARCHAR(5),
        imagemUrl VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        isActive BOOLEAN DEFAULT TRUE,
        INDEX idx_nome (nome)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabela de produtos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id VARCHAR(50) PRIMARY KEY,
        restaurantId VARCHAR(50) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        categoria VARCHAR(100),
        imagemUrl VARCHAR(255),
        disponivel BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurantId) REFERENCES restaurantes(id) ON DELETE CASCADE,
        INDEX idx_restaurantId (restaurantId),
        INDEX idx_categoria (categoria),
        INDEX idx_disponivel (disponivel)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabela de pedidos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id VARCHAR(50) PRIMARY KEY,
        usuarioId VARCHAR(50) NOT NULL,
        restaurantId VARCHAR(50) NOT NULL,
        endereco VARCHAR(255) NOT NULL,
        status ENUM('pendente', 'aceito', 'preparando', 'saiu_para_entrega', 'entregue', 'cancelado') DEFAULT 'pendente',
        total DECIMAL(10, 2) NOT NULL,
        observacoes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE RESTRICT,
        FOREIGN KEY (restaurantId) REFERENCES restaurantes(id) ON DELETE RESTRICT,
        INDEX idx_usuarioId (usuarioId),
        INDEX idx_restaurantId (restaurantId),
        INDEX idx_status (status),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabela de itens do pedido
    await connection.query(`
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id VARCHAR(50) PRIMARY KEY,
        pedidoId VARCHAR(50) NOT NULL,
        produtoId VARCHAR(50) NOT NULL,
        quantidade INT NOT NULL,
        preco DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (produtoId) REFERENCES produtos(id) ON DELETE RESTRICT,
        INDEX idx_pedidoId (pedidoId),
        INDEX idx_produtoId (produtoId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("Tabelas criadas/verificadas com sucesso!");

    // Inserir dados de teste
    console.log("Inserindo usuários de teste...");

    const usuarios = [
      {
        id: "client-1",
        name: "João Silva",
        email: "joao@email.com",
        password: "$2a$10$5Iw4iIA8h1f.PP1vE7h4B.JsP0VDZBF70KAa6UPgeDycg43KRcSCm",
        phone: "(85) 98765-4321",
        role: "client",
      },
      {
        id: "client-2",
        name: "Maria Santos",
        email: "maria@email.com",
        password: "$2a$10$qMv2dd/d0UAwAfwLdQQnGOILGdi2wvu7KbR6BPgp6EwvuLzvcYRxG",
        phone: "(85) 91234-5678",
        role: "client",
      },
      {
        id: "employee-1",
        name: "Carlos Souza",
        email: "carlos@restaurant.com",
        password: "$2a$10$BGQFZMMhTFXi0hNxaBx05OEawiLWEBZbauFnWTe/sfBpWDw5JW//K",
        phone: "(85) 99999-8888",
        role: "employee",
      },
      {
        id: "admin-1",
        name: "Roberto Admin",
        email: "admin@deliverysystem.com",
        password: "$2a$10$8z/7ltE8u2FPaDmJno2g9eJkB6.Ht2bKEEaLVug9ELawI/l.7Ad.S",
        phone: "(85) 77777-6666",
        role: "admin",
      },
    ];

    for (const user of usuarios) {
      try {
        await connection.query(
          `INSERT IGNORE INTO usuarios (id, name, email, password, phone, role, createdAt, isActive) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), TRUE)`,
          [user.id, user.name, user.email, user.password, user.phone, user.role]
        );
      } catch (error) {
        console.log(`Usuário ${user.email} já existe`);
      }
    }

    console.log("Banco de dados inicializado com sucesso!");
    console.log("\nStatus:");
    console.log("  • Host:", process.env.DB_HOST);
    console.log("  • Database:", process.env.DB_NAME);
    console.log("  • Usuários de teste inseridos: 4");
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

initDatabase();
