import React, { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector} from "react-redux";
import type { RootState } from "~/src/store/globalStore";
import { useFeaturedProducts } from "~/src/hooks/useSortBy";
import ProductCard from "../Card/card";
import { Button } from "~/src/components/imported/button";
import { RefreshCw } from "lucide-react";
import { Title } from "../../hero/Titles/titles";
import RelatedProducts from "../Recommendations/recommentations";
import type { Product } from "../../common/Lists/list";
import { useProducts } from "~/src/hooks/useProducts";
interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title = "Produtos Em Destaque",
  subtitle = "Os produtos mais vendidos em um só lugar",
}) => {
  const { products, currentProduct } = useProducts();
  const { featuredProducts, loading, error, refreshFeaturedProducts } = useFeaturedProducts();

 

  // Verificar IDs vazios ou duplicados (para debug)
  useEffect(() => {
    if (featuredProducts.length > 0) {
      // Verificar IDs vazios
      const emptyIds = featuredProducts.filter((p) => !p.id);
      if (emptyIds.length > 0) {
        console.error("ALERTA: Produtos com IDs vazios encontrados!", emptyIds);
      }

      // Verificar IDs duplicados
      const ids = featuredProducts.map((p) => p.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.error(
          "ALERTA: IDs duplicados encontrados!",
          ids.filter((id, index) => ids.indexOf(id) !== index)
        );
      }
    }
  }, [featuredProducts]);

  // Ensure products have the 'image' property and valid ID defined
  const safeProducts = useMemo(() => {
    return featuredProducts
      .filter((product) => !!product.id) // Filtra produtos sem ID
      .map((product) => {
        return {
          ...product,
          image: product.image || "/placeholder-image.jpg",
          id: product.id || `temp-${Math.random().toString(36).substr(2, 9)}`, // Garante um ID temporário se necessário
        };
      });
  }, [featuredProducts]);

  if (loading) {
    return (
      <section className="bg-transparent py-10 sm:py-16">
        <div className="mx-auto max-w-full px-2 sm:px-2 lg:px-4">
          <div className="text-center w-full max-w-full flex flex-col justify-center items-center">
            <Title title={title} subtitle={subtitle} color="dark" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex flex-col space-y-3 bg-transparent"
              >
                <div className="aspect-[3/4] w-full animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="h-4 w-2/3 animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="h-3 w-1/2 animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="h-4 w-1/4 animate-pulse rounded-sm bg-neutral-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-neutral-50 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center w-full">
            <Title title={title} subtitle={subtitle} color="dark" />
            <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-red-400 sm:mt-4">
              Não foi possível carregar os produtos em destaque
            </p>
            <Button
              onClick={refreshFeaturedProducts}
              variant="outline"
              className="mt-8 border-neutral-200 px-6 text-xs font-light text-neutral-800 hover:bg-neutral-900 hover:text-white"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-full  sm:px-6 lg">
        <div className="text-center w-full flex flex-col justify-center items-center">
          <Title title={title} subtitle={subtitle} color="dark" align="center" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {safeProducts.map((product) => (
            <ProductCard key={`featured-${product.id}`} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button
            onClick={refreshFeaturedProducts}
            variant="outline"
            size="sm"
            className="group border-neutral-200 px-6 text-xs font-light text-neutral-800 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
          >
            <RefreshCw className="mr-2 h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
            Atualizar seleção
          </Button>
        </div>
      </div>
    </section>
  );
};
