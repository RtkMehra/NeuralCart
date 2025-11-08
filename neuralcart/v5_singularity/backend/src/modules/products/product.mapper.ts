import { Product } from '../../entities/Product';

export type ProductResponse = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    createdAt: string;
    updatedAt: string;
};

export const mapProductToResponse = (product: Product): ProductResponse => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl ?? null,
    category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
});

