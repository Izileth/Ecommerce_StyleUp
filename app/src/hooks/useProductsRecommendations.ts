import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { Product } from '~/src/types/type';
import type { RootState } from '../store/globalStore';

export interface RecommendationParams {
  baseProduct: Product;
  maxRecommendations?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  excludeOutOfStock?: boolean;
  categoryWeight?: number;
  collectionWeight?: number;
  priceWeight?: number;
  colorWeight?: number;
  sizeWeight?: number;
}

export interface ProductRecommendation {
  product: Product;
  score: number;
  matchReasons: string[];
}

export interface UseProductRecommendationsResult {
  recommendations: ProductRecommendation[];
  loading: boolean;
  error: string | null;
  refreshRecommendations: () => void;
}

export const useProductRecommendations = (
  params: RecommendationParams
): UseProductRecommendationsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar produtos do Redux store
  const { products, userProducts } = useSelector((state: RootState) => state.products);

  // Configurações padrão dos pesos
  const defaultWeights = {
    categoryWeight: params.categoryWeight || 0.3,
    collectionWeight: params.collectionWeight || 0.25,
    priceWeight: params.priceWeight || 0.2,
    colorWeight: params.colorWeight || 0.15,
    sizeWeight: params.sizeWeight || 0.1,
  };

  const {
    baseProduct,
    maxRecommendations = 8,
    priceRange,
    excludeOutOfStock = true,
  } = params;

  // Função para calcular similaridade de cor
  const calculateColorSimilarity = (colors1: any[], colors2: any[]): number => {
    if (!colors1?.length || !colors2?.length) return 0;

    let maxSimilarity = 0;
    colors1.forEach(color1 => {
      colors2.forEach(color2 => {
        if (color1.colorName === color2.colorName || 
            color1.colorCode === color2.colorCode) {
          maxSimilarity = Math.max(maxSimilarity, 1);
        }
      });
    });

    return maxSimilarity;
  };

  // Função para calcular similaridade de tamanho
  const calculateSizeSimilarity = (sizes1: any[], sizes2: any[]): number => {
    if (!sizes1?.length || !sizes2?.length) return 0;

    const availableSizes1 = sizes1.filter(s => s.stock > 0).map(s => s.size);
    const availableSizes2 = sizes2.filter(s => s.stock > 0).map(s => s.size);

    if (!availableSizes1.length || !availableSizes2.length) return 0;

    const commonSizes = availableSizes1.filter(size => 
      availableSizes2.includes(size)
    );

    return commonSizes.length / Math.max(availableSizes1.length, availableSizes2.length);
  };

  // Função para calcular similaridade de preço
  const calculatePriceSimilarity = (price1: number, price2: number): number => {
    const priceDiff = Math.abs(price1 - price2);
    const avgPrice = (price1 + price2) / 2;
    
    // Normaliza a diferença de preço (quanto menor a diferença, maior a similaridade)
    return Math.max(0, 1 - (priceDiff / avgPrice));
  };

  // Função principal para calcular o score de recomendação
  const calculateRecommendationScore = (
    product: Product,
    baseProduct: Product
  ): { score: number; reasons: string[] } => {
    const reasons: string[] = [];
    let totalScore = 0;

    // 1. Similaridade de categoria (peso: 30%)
    if (product.category === baseProduct.category) {
      totalScore += defaultWeights.categoryWeight;
      reasons.push(`Mesma categoria: ${product.category}`);
    }

    // 2. Similaridade de coleção (peso: 25%)
    if (product.collection && baseProduct.collection && 
        product.collection === baseProduct.collection) {
      totalScore += defaultWeights.collectionWeight;
      reasons.push(`Mesma coleção: ${product.collection}`);
    }

    // 3. Similaridade de preço (peso: 20%)
    const currentPrice = product.salePrice || product.price;
    const basePrice = baseProduct.salePrice || baseProduct.price;
    const priceSimilarity = calculatePriceSimilarity(currentPrice, basePrice);
    
    if (priceSimilarity > 0.7) {
      totalScore += defaultWeights.priceWeight * priceSimilarity;
      reasons.push(`Faixa de preço similar (R$ ${currentPrice.toFixed(2)})`);
    }

    // 4. Similaridade de cor (peso: 15%)
    const colorSimilarity = calculateColorSimilarity(product.colors, baseProduct.colors);
    if (colorSimilarity > 0) {
      totalScore += defaultWeights.colorWeight * colorSimilarity;
      reasons.push('Cores em comum');
    }

    // 5. Similaridade de tamanho (peso: 10%)
    const sizeSimilarity = calculateSizeSimilarity(product.sizes, baseProduct.sizes);
    if (sizeSimilarity > 0) {
      totalScore += defaultWeights.sizeWeight * sizeSimilarity;
      reasons.push('Tamanhos disponíveis em comum');
    }

    // Bônus por características especiais
    if (product.salePrice && product.salePrice < product.price) {
      totalScore += 0.05; // 5% de bônus para produtos em promoção
      reasons.push('Em promoção');
    }

    if (product.likes && product.likes > 10) {
      totalScore += 0.03; // 3% de bônus para produtos populares
      reasons.push('Produto popular');
    }

    return { score: totalScore, reasons };
  };

  // Função para filtrar produtos elegíveis
  const getEligibleProducts = (allProducts: Product[]): Product[] => {
    return allProducts.filter(product => {
      // Excluir o próprio produto
      if (product.id === baseProduct.id) return false;

      // Filtrar por estoque se necessário
      if (excludeOutOfStock && product.countInStock <= 0) return false;

      // Filtrar por faixa de preço se especificada
      if (priceRange) {
        const currentPrice = product.salePrice || product.price;
        if (priceRange.min && currentPrice < priceRange.min) return false;
        if (priceRange.max && currentPrice > priceRange.max) return false;
      }

      return true;
    });
  };

  // Calcular recomendações usando useMemo para otimização
  const recommendations = useMemo(() => {
    try {
      // Combinar produtos gerais e produtos do usuário
      const allProducts = [...products, ...userProducts];
      
      if (!allProducts.length || !baseProduct) {
        return [];
      }

      const eligibleProducts = getEligibleProducts(allProducts);

      // Calcular scores para cada produto elegível
      const scoredProducts: ProductRecommendation[] = eligibleProducts
        .map(product => {
          const { score, reasons } = calculateRecommendationScore(product, baseProduct);
          return {
            product,
            score,
            matchReasons: reasons,
          };
        })
        .filter(item => item.score > 0.1) // Filtrar produtos com score muito baixo
        .sort((a, b) => b.score - a.score) // Ordenar por score decrescente
        .slice(0, maxRecommendations); // Limitar ao número máximo de recomendações

      return scoredProducts;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular recomendações');
      return [];
    }
  }, [
    products,
    userProducts,
    baseProduct?.id, // Usar apenas o ID para evitar dependências profundas
    maxRecommendations,
    priceRange?.min,
    priceRange?.max,
    excludeOutOfStock,
    defaultWeights.categoryWeight,
    defaultWeights.collectionWeight,
    defaultWeights.priceWeight,
    defaultWeights.colorWeight,
    defaultWeights.sizeWeight,
  ]);

  // useEffect separado para controlar loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [baseProduct?.id]);

  // Função para forçar recálculo das recomendações
  const refreshRecommendations = useCallback(() => {
    setError(null);
    // Força re-render através de uma key aleatória ou timestamp
    setLoading(true);
    setTimeout(() => setLoading(false), 200);
  }, []);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations,
  };
};

// Hook auxiliar para recomendações baseadas em histórico de visualizações
export const useViewHistoryRecommendations = (
  viewHistory: Product[],
  maxRecommendations: number = 6
) => {
  const { products } = useSelector((state: RootState) => state.products);

  const recommendations = useMemo(() => {
    if (!viewHistory.length || !products.length) return [];

    // Analisar padrões do histórico
    const categoryCount: Record<string, number> = {};
    const collectionCount: Record<string, number> = {};
    
    viewHistory.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      if (product.collection) {
        collectionCount[product.collection] = (collectionCount[product.collection] || 0) + 1;
      }
    });

    // Encontrar categorias e coleções mais visualizadas
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const topCollections = Object.entries(collectionCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([collection]) => collection);

    // Filtrar produtos baseado nos padrões
    const recommendedProducts = products
      .filter(product => {
        // Excluir produtos já visualizados
        if (viewHistory.some(viewed => viewed.id === product.id)) return false;
        
        // Incluir produtos das categorias/coleções mais visualizadas
        return topCategories.includes(product.category) || 
               (product.collection && topCollections.includes(product.collection));
      })
      .sort((a, b) => {
        // Priorizar por popularidade (likes) e promoções
        const aScore = (a.likes || 0) + (a.salePrice ? 10 : 0);
        const bScore = (b.likes || 0) + (b.salePrice ? 10 : 0);
        return bScore - aScore;
      })
      .slice(0, maxRecommendations);

    return recommendedProducts.map(product => ({
      product,
      score: 0.8, // Score fixo para este tipo de recomendação
      matchReasons: ['Baseado no seu histórico de navegação'],
    }));

  }, [viewHistory, products, maxRecommendations]);

  return recommendations;
};