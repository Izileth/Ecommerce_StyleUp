import React, { useState } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '~/src/components/imported/button';
import { Card, CardContent } from '~/src/components/imported/card';
import { Badge } from '~/src/components/imported/badge';
import { Skeleton } from '~/src/components/imported/skeleton';
import { useProductRecommendations } from '~/src/hooks/useProductsRecommendations';
import ProductCard from '../Card/card';
import type { Product } from '~/src/types/type';

interface RelatedProductsProps {
  currentProduct: Product;
  className?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProduct, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; 

  const { 
    recommendations, 
    loading, 
    error, 
    refreshRecommendations 
  } = useProductRecommendations({
    baseProduct: currentProduct,
    maxRecommendations: 12,
    priceRange: {
      min: currentProduct.price * 0.3,
      max: currentProduct.price * 3,
    },
    excludeOutOfStock: true,
    categoryWeight: 0.4,
    collectionWeight: 0.35,
    priceWeight: 0.15,
    colorWeight: 0.07,
    sizeWeight: 0.03,
  });

  // Função para navegar pelos produtos
  const handleNext = () => {
    const maxIndex = Math.max(0, recommendations.length - itemsPerPage);
    setCurrentIndex(prev => Math.min(prev + itemsPerPage, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - itemsPerPage, 0));
  };

  // Produtos visíveis na tela atual
  const visibleProducts = recommendations.slice(currentIndex, currentIndex + itemsPerPage);
  const canGoNext = currentIndex + itemsPerPage < recommendations.length;
  const canGoPrev = currentIndex > 0;

  // Função para obter a cor do badge baseado no tipo de match
  const getBadgeVariant = (reasons: string[]) => {
    if (reasons.some(reason => reason.includes('coleção'))) return 'default';
    if (reasons.some(reason => reason.includes('categoria'))) return 'secondary';
    if (reasons.some(reason => reason.includes('promoção'))) return 'destructive';
    if (reasons.some(reason => reason.includes('popular'))) return 'outline'; // Update this line
    if (reasons.some(reason => reason.includes('preço'))) return 'default';
  };

  // Função para obter o texto do badge
  const getBadgeText = (reasons: string[]) => {
    if (reasons.some(reason => reason.includes('coleção'))) return 'Mesma Coleção';
    if (reasons.some(reason => reason.includes('categoria'))) return 'Categoria Similar';
    if (reasons.some(reason => reason.includes('promoção'))) return 'Em Promoção';
    if (reasons.some(reason => reason.includes('popular'))) return 'Popular';
    if (reasons.some(reason => reason.includes('preço'))) return 'Faixa de Preço';
    return 'Recomendado';
  };

  if (loading) {
    return (
      <section className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Produtos Relacionados
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`space-y-4 ${className}`}>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Erro ao carregar produtos relacionados: {error}
          </p>
          <Button 
            onClick={refreshRecommendations}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </Card>
      </section>
    );
  }

  if (!recommendations.length) {
    return (
      <section className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Produtos Relacionados
        </h2>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Nenhum produto relacionado encontrado no momento.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Produtos Relacionados
          <Badge variant="outline" className="ml-2">
            {recommendations.length}
          </Badge>
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={refreshRecommendations}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Atualizar recomendações"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          {/* Navegação */}
          {recommendations.length > itemsPerPage && (
            <div className="flex items-center gap-1">
              <Button
                onClick={handlePrev}
                disabled={!canGoPrev}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground px-2">
                {Math.floor(currentIndex / itemsPerPage) + 1} / {Math.ceil(recommendations.length / itemsPerPage)}
              </span>
              
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleProducts.map(({ product, score, matchReasons }) => (
          <div key={product.id} className="relative group">
            {/* Badge de Relevância */}
            <div className="absolute top-16 pt-2 pl-1 left-2 z-10">
              <Badge 
                variant={getBadgeVariant(matchReasons)}
                className="text-xs shadow-sm"
              >
                {getBadgeText(matchReasons)}
              </Badge>
            </div>

            {/* Score de relevância (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute bottom-80 pb-2 right-2 z-10">
                <Badge variant="outline" className="text-xs bg-white/90">
                  {Math.round(score * 100)}%
                </Badge>
              </div>
            )}

            {/* Card do Produto */}
            <ProductCard 
              product={product}
            />

            {/* Overlay com informações adicionais no hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Indicadores de paginação (pontos) */}
      {recommendations.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(recommendations.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerPage) === index
                  ? 'bg-primary'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            Debug: Algoritmo de Recomendação
          </summary>
          <Card className="mt-2 p-4">
            <div className="space-y-2 text-sm">
              <p><strong>Produto base:</strong> {currentProduct.name}</p>
              <p><strong>Categoria:</strong> {currentProduct.category}</p>
              <p><strong>Coleção:</strong> {currentProduct.collection || 'N/A'}</p>
              <p><strong>Preço:</strong> R$ {(currentProduct.salePrice || currentProduct.price).toFixed(2)}</p>
              <p><strong>Total de recomendações:</strong> {recommendations.length}</p>
              <p><strong>Faixa de preço considerada:</strong> R$ {(currentProduct.price * 0.3).toFixed(2)} - R$ {(currentProduct.price * 3).toFixed(2)}</p>
            </div>
          </Card>
        </details>
      )}
    </section>
  );
};

export default RelatedProducts;