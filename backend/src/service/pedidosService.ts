import { lerJSON, salvarJSON } from "../utils/fileUtils";

export interface PedidoItem {
  productId: string;
  productName: string;
  variationId: string;
  variationName: string;
  quantity: number;
  subtotal: number;
  addons?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface Pedido {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: PedidoItem[];
  deliveryAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}

const caminho = "./src/data/pedidos.json";

export function listarPedidos(): Pedido[] {
  return lerJSON(caminho);
}

export function buscarPedido(id: string): Pedido | undefined {
  const pedidos: Pedido[] = lerJSON(caminho);
  return pedidos.find((p) => p.id === id);
}

export function listarPedidosPorCliente(customerId: string): Pedido[] {
  const pedidos: Pedido[] = lerJSON(caminho);
  return pedidos.filter((p) => p.customerId === customerId);
}

export function listarPedidosPorRestaurante(restaurantId: string): Pedido[] {
  const pedidos: Pedido[] = lerJSON(caminho);
  return pedidos.filter((p) => p.restaurantId === restaurantId);
}

export function adicionarPedido(dados: Omit<Pedido, "id" | "createdAt" | "updatedAt">): Pedido {
  const pedidos: Pedido[] = lerJSON(caminho);

  const novoPedido: Pedido = {
    id: `order-${Date.now()}`,
    ...dados,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  pedidos.push(novoPedido);
  salvarJSON(caminho, pedidos);

  return novoPedido;
}

export function atualizarStatusPedido(
  id: string,
  status: Pedido["status"]
): Pedido | null {
  const pedidos: Pedido[] = lerJSON(caminho);
  const index = pedidos.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  pedidos[index].status = status;
  pedidos[index].updatedAt = new Date().toISOString();
  salvarJSON(caminho, pedidos);

  return pedidos[index];
}

export function atualizarPedido(id: string, dados: Partial<Pedido>): Pedido | null {
  const pedidos: Pedido[] = lerJSON(caminho);
  const index = pedidos.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  pedidos[index] = {
    ...pedidos[index],
    ...dados,
    updatedAt: new Date().toISOString(),
  };
  salvarJSON(caminho, pedidos);

  return pedidos[index];
}
