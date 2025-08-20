import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { Product } from '~/src/types/type';
import type { RootState } from '../store/globalStore';

export interface RelatedProductsOptions {
    productId: string;
    limit?: number;
    includeFromSameUser?: boolean;
    prioritizeSameCollection?: boolean;
    priceVariance?: number; // Percentual de variação de preço aceita (0.2 = 20%)
}

export interface RelatedProduct {
    product: Product;
    relevanceScore: number;
    matchType: 'same-collection' | 'same-category' | 'similar-price' | 'same-user' | 'similar-features';
}

export const useRelatedProducts = (options: RelatedProductsOptions) => {
    const {
        productId,
        limit = 6,
        includeFromSameUser = false,
        prioritizeSameCollection = true,
        priceVariance = 0.3
    } = options;

    const { products, userProducts } = useSelector((state: RootState) => state.products);

    const relatedProducts = useMemo(() => {
        // Combinar todos os produtos disponíveis
        const allProducts = [...products, ...userProducts];
        
        // Encontrar o produto base
        const baseProduct = allProducts.find(p => p.id === productId);
        if (!baseProduct) return [];

        // Filtrar produtos elegíveis (excluir o próprio produto e produtos sem estoque)
        const eligibleProducts = allProducts.filter(product => {
        if (product.id === productId) return false;
        if (product.countInStock <= 0) return false;
        if (!includeFromSameUser && product.userId === baseProduct.userId) return false;
        return true;
        });

        // Calcular relevância para cada produto
        const scoredProducts: RelatedProduct[] = eligibleProducts.map(product => {
        let score = 0;
        let matchType: RelatedProduct['matchType'] = 'similar-features';

        // 1. Mesma coleção (maior prioridade)
        if (product.collection && baseProduct.collection && 
            product.collection === baseProduct.collection) {
            score += prioritizeSameCollection ? 100 : 80;
            matchType = 'same-collection';
        }
        
        // 2. Mesma categoria
        else if (product.category === baseProduct.category) {
            score += 70;
            matchType = 'same-category';
        }

        // 3. Mesmo usuário (se habilitado)
        if (includeFromSameUser && product.userId === baseProduct.userId) {
            score += 60;
            matchType = 'same-user';
        }

        // 4. Faixa de preço similar
        const basePrice = baseProduct.salePrice || baseProduct.price;
        const productPrice = product.salePrice || product.price;
        const priceDifference = Math.abs(productPrice - basePrice) / basePrice;
        
        if (priceDifference <= priceVariance) {
            score += 50 * (1 - priceDifference); // Quanto menor a diferença, maior o score
            if (matchType === 'similar-features') matchType = 'similar-price';
        }

        // 5. Características em comum
        if (baseProduct.features && product.features) {
            const commonFeatures = baseProduct.features.filter(feature =>
            product.features.includes(feature)
            );
            score += commonFeatures.length * 10;
        }

        // 6. Cores em comum
        if (baseProduct.colors && product.colors && baseProduct.colors.length > 0 && product.colors.length > 0) {
            const hasCommonColor = baseProduct.colors.some(baseColor =>
            product.colors.some(productColor =>
                productColor.colorName === baseColor.colorName ||
                productColor.colorCode === baseColor.colorCode
            )
            );
            if (hasCommonColor) score += 20;
        }

        // 7. Tamanhos em comum
        if (baseProduct.sizes && product.sizes && baseProduct.sizes.length > 0 && product.sizes.length > 0) {
            const commonSizes = baseProduct.sizes.filter(baseSize =>
            product.sizes.some(productSize => productSize.size === baseSize.size && productSize.stock > 0)
            );
            score += commonSizes.length * 5;
        }

        // 8. Bônus para produtos em promoção
        if (product.salePrice && product.salePrice < product.price) {
            score += 15;
        }

        // 9. Bônus para produtos populares
        if (product.likes && product.likes > 5) {
            score += Math.min(product.likes, 25); // Máximo de 25 pontos por popularidade
        }

        return {
            product,
            relevanceScore: score,
            matchType
        };
        });

        // Ordenar por score e limitar resultados
        return scoredProducts
        .filter(item => item.relevanceScore > 20) // Filtrar produtos com score muito baixo
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

    }, [products, userProducts, productId, limit, includeFromSameUser, prioritizeSameCollection, priceVariance]);

    return relatedProducts;
    };

    // Hook para sugestões baseadas em carrinho
    export const useCartBasedRecommendations = (cartItems: Product[], limit: number = 4) => {
    const { products } = useSelector((state: RootState) => state.products);

    const recommendations = useMemo(() => {
        if (!cartItems.length || !products.length) return [];

        // Analisar padrões do carrinho
        const cartCategories = [...new Set(cartItems.map(item => item.category))];
        const cartCollections = [...new Set(cartItems.map(item => item.collection).filter(Boolean))];
        const avgCartPrice = cartItems.reduce((sum, item) => sum + (item.salePrice || item.price), 0) / cartItems.length;

        // Encontrar produtos complementares
        const complementaryProducts = products
        .filter(product => {
            // Excluir produtos que já estão no carrinho
            if (cartItems.some(cartItem => cartItem.id === product.id)) return false;
            // Incluir apenas produtos com estoque
            if (product.countInStock <= 0) return false;
            return true;
        })
        .map(product => {
            let score = 0;
            
            // Produtos da mesma categoria
            if (cartCategories.includes(product.category)) {
            score += 40;
            }
            
            // Produtos da mesma coleção
            if (product.collection && cartCollections.includes(product.collection)) {
            score += 60;
            }
            
            // Faixa de preço similar
            const productPrice = product.salePrice || product.price;
            const priceDifference = Math.abs(productPrice - avgCartPrice) / avgCartPrice;
            if (priceDifference <= 0.5) { // 50% de variação
            score += 30 * (1 - priceDifference);
            }
            
            // Produtos em promoção
            if (product.salePrice) {
            score += 20;
            }

            return { product, score };
        })
        .filter(item => item.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

        return complementaryProducts.map(item => ({
        product: item.product,
        relevanceScore: item.score,
        matchType: 'cart-based' as const
        }));

    }, [cartItems, products, limit]);

    return recommendations;
};

// Hook para produtos em alta/tendência
export const useTrendingProducts = (limit: number = 8) => {
  const { products } = useSelector((state: RootState) => state.products);

  const trendingProducts = useMemo(() => {
    if (!products.length) return [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return products
      .filter(product => {
        // Apenas produtos com estoque
        if (product.countInStock <= 0) return false;
        // Produtos criados nos últimos 30 dias ou com muitos likes
        const createdAt = new Date(product.createdAt);
        return createdAt >= thirtyDaysAgo || (product.likes && product.likes > 10);
      })
      .sort((a, b) => {
        // Ordenar por likes e data de criação
        const aScore = (a.likes || 0) * 2 + (a.salePrice ? 5 : 0);
        const bScore = (b.likes || 0) * 2 + (b.salePrice ? 5 : 0);
        return bScore - aScore;
      })
      .slice(0, limit)
      .map(product => ({
        product,
        relevanceScore: (product.likes || 0) * 2 + (product.salePrice ? 5 : 0),
        matchType: 'trending' as const
      }));

  }, [products, limit]);

  return trendingProducts;
};