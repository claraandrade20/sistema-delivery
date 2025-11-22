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
export declare function listarPedidos(): Pedido[];
export declare function buscarPedido(id: string): Pedido | undefined;
export declare function listarPedidosPorCliente(customerId: string): Pedido[];
export declare function listarPedidosPorRestaurante(restaurantId: string): Pedido[];
export declare function adicionarPedido(dados: Omit<Pedido, "id" | "createdAt" | "updatedAt">): Pedido;
export declare function atualizarStatusPedido(id: string, status: Pedido["status"]): Pedido | null;
export declare function atualizarPedido(id: string, dados: Partial<Pedido>): Pedido | null;
