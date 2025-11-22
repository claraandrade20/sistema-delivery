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
export declare function listarProdutos(): Produto[];
export declare function buscarProdutoPorId(id: string): Produto | undefined;
export declare function listarProdutosPorRestaurante(restaurantId: string): Produto[];
export declare function listarProdutosPorCategoria(categoryId: string): Produto[];
export declare function adicionarProduto(produto: Omit<Produto, "id">): Produto;
export declare function atualizarProduto(id: string, dados: Partial<Produto>): Produto | null;
export declare function deletarProduto(id: string): boolean;
