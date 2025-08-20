import React from 'react';
import { useRelatedProducts } from '~/src/hooks/useRelatedProducts'; // Ajuste o caminho conforme sua estrutura
import ProductCard from '../../products/Card/card';

import { Badge } from '../../imported/badge';

import { Separator } from '../../imported/separator';
import { Package, Sparkles } from 'lucide-react';

export interface RelatedProductsProps {
    productId: string;
    title?: string;
    limit?: number;
    includeFromSameUser?: boolean;
    prioritizeSameCollection?: boolean;
    priceVariance?: number;
    showMatchBadges?: boolean;
    className?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
    productId,
    title = "Produtos Relacionados",
    limit = 6,
    includeFromSameUser = false,
    prioritizeSameCollection = true,
    priceVariance = 0.3,
    showMatchBadges = true,
    className = "",
    }) => {
    const relatedProducts = useRelatedProducts({
        productId,
        limit,
        includeFromSameUser,
        prioritizeSameCollection,
        priceVariance,
    });

    // Se não há produtos relacionados, não renderizar nada
    if (!relatedProducts.length) {
        return null;
    }

    // Função para obter o ícone e cor baseado no tipo de match
    const getMatchBadgeProps = (matchType: string) => {
        switch (matchType) {
        case 'same-collection':
            return {
            variant: 'secondary' as const,
            className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
            icon: <Sparkles className="w-3 h-3 mr-1" />,
            label: 'Mesma Coleção'
            };
        case 'same-category':
            return {
            variant: 'secondary' as const,
            className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
            icon: <Package className="w-3 h-3 mr-1" />,
            label: 'Mesma Categoria'
            };
        case 'similar-price':
            return {
            variant: 'secondary' as const,
            className: 'bg-green-100 text-green-800 hover:bg-green-200',
            icon: null,
            label: 'Preço Similar'
            };
        case 'same-user':
            return {
            variant: 'secondary' as const,
            className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
            icon: null,
            label: 'Mesmo Vendedor'
            };
        default:
            return {
            variant: 'outline' as const,
            className: 'bg-gray-50 text-gray-700',
            icon: null,
            label: 'Relacionado'
            };
        }
    };

    return (
        <div className={`related-products-section ${className}`}>
        {/* Header da seção */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {relatedProducts.length} {relatedProducts.length === 1 ? 'produto' : 'produtos'}
            </Badge>
            </div>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {relatedProducts.map(({ product, relevanceScore, matchType }) => {
            const badgeProps = getMatchBadgeProps(matchType);
            
            return (
                <div key={product.id} className="relative group">
                {/* Badge de tipo de match */}
                {showMatchBadges && (
                    <div className="absolute top-2 left-2 z-10">
                    <Badge 
                        variant={badgeProps.variant}
                        className={`text-xs flex items-center ${badgeProps.className}`}
                    >
                        {badgeProps.icon}
                        {badgeProps.label}
                    </Badge>
                    </div>
                )}

                {/* Score de relevância (visível apenas no hover para debug - remova em produção) */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs">
                    {Math.round(relevanceScore)}%
                    </Badge>
                </div>

                {/* Seu componente de ProductCard */}
                <ProductCard 
                    product={product}
                />
                </div>
            );
            })}
        </div>

        {/* Separador opcional */}
        <Separator className="mt-8" />
        </div>
    );
};