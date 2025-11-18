import { lerJSON, salvarJSON } from "../utils/fileUtils";

export interface Produto {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  restaurantId: string;
  variations: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  addons?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  stockQuantity: number;
  isActive: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewsCount?: number;
  preparationTime?: number;
}

const caminho = "./src/data/produtos.json";

export function listarProdutos(): Produto[] {
  return lerJSON(caminho);
}

export function buscarProdutoPorId(id: string): Produto | undefined {
  const produtos: Produto[] = lerJSON(caminho);
  return produtos.find((p) => p.id === id);
}

export function listarProdutosPorRestaurante(restaurantId: string): Produto[] {
  const produtos: Produto[] = lerJSON(caminho);
  return produtos.filter((p) => p.restaurantId === restaurantId && p.isActive);
}

export function listarProdutosPorCategoria(categoryId: string): Produto[] {
  const produtos: Produto[] = lerJSON(caminho);
  return produtos.filter((p) => p.categoryId === categoryId && p.isActive);
}

export function adicionarProduto(produto: Omit<Produto, "id">): Produto {
  const produtos: Produto[] = lerJSON(caminho);

  const novo: Produto = {
    id: `prod-${Date.now()}`,
    ...produto,
  };

  produtos.push(novo);
  salvarJSON(caminho, produtos);

  return novo;
}

export function atualizarProduto(id: string, dados: Partial<Produto>): Produto | null {
  const produtos: Produto[] = lerJSON(caminho);
  const index = produtos.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  produtos[index] = { ...produtos[index], ...dados };
  salvarJSON(caminho, produtos);

  return produtos[index];
}

export function deletarProduto(id: string): boolean {
  const produtos: Produto[] = lerJSON(caminho);
  const index = produtos.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  produtos.splice(index, 1);
  salvarJSON(caminho, produtos);

  return true;
}
