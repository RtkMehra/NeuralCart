import { FindOptionsWhere, ILike, In } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Category } from '../../entities/Category';
import { Product } from '../../entities/Product';
import { HttpError } from '../../utils/http-error';
import {
    CreateProductInput,
    ListProductsInput,
    UpdateProductInput
} from './product.schema';
import { searchService } from '../../lib/search';
import { logger } from '../../lib/logger';

const productRepository = () => AppDataSource.getRepository(Product);
const categoryRepository = () => AppDataSource.getRepository(Category);

export const listProducts = async ({
    page,
    limit,
    search
}: ListProductsInput) => {
    const repository = productRepository();
    const where: FindOptionsWhere<Product>[] = [];

    if (search) {
        where.push(
            {
                name: ILike(`%${search}%`)
            },
            {
                description: ILike(`%${search}%`)
            }
        );
    }

    const [items, total] = await repository.findAndCount({
        where: where.length ? where : undefined,
        skip: (page - 1) * limit,
        take: limit,
        order: {
            createdAt: 'DESC'
        },
        relations: { category: true }
    });

    return {
        items,
        total,
        page,
        limit
    };
};

export const getProductById = async (id: string) => {
    const product = await productRepository().findOne({
        where: { id },
        relations: { category: true }
    });

    if (!product) {
        throw new HttpError(404, 'Product not found');
    }

    return product;
};

export const createProduct = async (input: CreateProductInput) => {
    const category = await categoryRepository().findOne({
        where: { id: input.categoryId }
    });

    if (!category) {
        throw new HttpError(404, 'Category not found');
    }

    const product = productRepository().create({
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock,
        imageUrl: input.imageUrl ?? null,
        category
    });

    const saved = await productRepository().save(product);

    void searchService.indexProduct(saved).catch((error) => {
        logger.warn({ err: error, productId: saved.id }, 'Failed to index product');
    });

    return saved;
};

export const updateProduct = async (
    id: string,
    input: UpdateProductInput
) => {
    const repository = productRepository();
    const product = await repository.findOne({
        where: { id },
        relations: { category: true }
    });

    if (!product) {
        throw new HttpError(404, 'Product not found');
    }

    if (input.categoryId) {
        const category = await categoryRepository().findOne({
            where: { id: input.categoryId }
        });

        if (!category) {
            throw new HttpError(404, 'Category not found');
        }

        product.category = category;
    }

    if (input.name !== undefined) product.name = input.name;
    if (input.description !== undefined) product.description = input.description;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;
    if (input.imageUrl !== undefined) product.imageUrl = input.imageUrl ?? null;

    const saved = await repository.save(product);

    void searchService.indexProduct(saved).catch((error) => {
        logger.warn({ err: error, productId: saved.id }, 'Failed to re-index product');
    });

    return saved;
};

export const deleteProduct = async (id: string) => {
    const repository = productRepository();
    const product = await repository.findOne({ where: { id } });

    if (!product) {
        throw new HttpError(404, 'Product not found');
    }

    await repository.remove(product);
    void searchService.removeProduct(id).catch((error) => {
        logger.warn({ err: error, productId: id }, 'Failed to remove product from search index');
    });
};

export const getProductsByIds = async (ids: string[]) => {
    if (!ids.length) {
        return [];
    }

    return productRepository().find({
        where: {
            id: In(ids)
        },
        relations: { category: true }
    });
};

