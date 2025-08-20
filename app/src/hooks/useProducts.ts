import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/globalStore";
import type { AppDispatch } from "../store/globalStore";
import {
  clearCurrentProduct,
  resetProductError,
  setFilters,
} from "../store/product/productSlice";
import {
  fetchProducts,
  fetchUserProducts,
  fetchProductsByCollection,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/product/productThunks";
import type { ProductFilterApiParams, Pagination } from "../types/type";
import type { ProductFormValues, Product } from "../types/type";
import { ProductService } from "../services/produtcService";
import { useCallback, useMemo } from "react";

interface UseProductsReturn {
  // Estado
  products: Product[];
  userProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination; // Usando a interface Pagination unificada
  filters: ProductFilterApiParams;

  // Ações
  getProducts: (
    page?: number,
    filters?: ProductFilterApiParams
  ) => Promise<{ data: Product[]; pagination: Pagination }>;
  getFeaturedProducts: (count?: number) => Product[];
  getUserProducts: (page?: number) => void;
  getProductById: (id: string) => void;
  addProduct: (values: ProductFormValues) => Promise<Product>;
  editProduct: (id: string, values: ProductFormValues) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;
  clearProduct: () => void;
  clearError: () => void;
  updateFilters: (filters: Partial<ProductFilterApiParams>) => void;
  resetFilters: () => void;
  getCollectionProducts: (
    collection: string,
    page?: number,
    limit?: number
  ) => void;
  prefetchCollection: (collection: string) => void;
}

export const useProducts = (): UseProductsReturn => {
  // Verificação para SSR (Next.js/Gatsby)
  if (typeof window === "undefined") {
    const ssrFallback: UseProductsReturn = {
      products: [],
      userProducts: [],
      currentProduct: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        pages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      filters: { page: 1, limit: 10 },
      getProducts: () =>
        Promise.resolve({
          data: [],
          pagination: {
            page: 1,
            limit: 100,
            total: 0,
            pages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }),
      getUserProducts: () => Promise.resolve(),
      getProductById: () => Promise.resolve(),
      getFeaturedProducts: () => [],
      getCollectionProducts: () => Promise.resolve(), // Tipagem mais precisa
      prefetchCollection: () => {}, // Mantém void
      addProduct: async () => ({} as Product),
      editProduct: async () => ({} as Product),
      removeProduct: async () => Promise.resolve(),
      clearProduct: () => {},
      clearError: () => {},
      updateFilters: () => {},
      resetFilters: () => {},
    };
    return ssrFallback;
  }

  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.products);

  // Busca de produtos com memoização
  const getProducts = useCallback(
    async (
      page?: number,
      filters?: ProductFilterApiParams
    ): Promise<{
      data: Product[];
      pagination: Pagination;
    }> => {
      const params = {
        page: page || 1,
        filters: filters || {},
      };

      // 1. Opção com type assertion
      const result = await dispatch(fetchProducts(params));
      return result.payload as { data: Product[]; pagination: Pagination };

      // OU 2. Opção com unwrap() e type assertion
      // return await dispatch(fetchProducts(params)).unwrap() as { data: Product[]; pagination: Pagination };
    },
    [dispatch]
  );

  const getFeaturedProducts = useCallback(
    (count: number = 4): Product[] => {
      const productCount = Math.min(Math.max(count, 4), 8);

      if (!Array.isArray(state.products)) return [];
      if (state.products.length === 0) return [];

      const productsCopy = [...state.products];

      if (productsCopy.length <= productCount) return productsCopy;

      // Fisher-Yates shuffle
      for (let i = productsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
      }

      return productsCopy.slice(0, productCount);
    },
    [state.products]
  );

  const getCollectionProducts = useCallback(
    (collection: string, page?: number, limit?: number) => {
      dispatch(
        fetchProductsByCollection({
          collection,
          page: page || 1,
          limit: limit || state.filters.limit,
        })
      );
    },
    [dispatch, state.filters.limit]
  );

  // Método para pré-carregar (opcional)
  const prefetchCollection = useCallback(
    (collection: string) => {
      dispatch(fetchProductsByCollection({ collection, page: 1 }));
    },
    [dispatch]
  );

  // Produtos do usuário
  const getUserProducts = useCallback(
    (page?: number) => {
      return dispatch(fetchUserProducts({ page }));
    },
    [dispatch]
  );

  // Buscar produto por ID
  const getProductById = useCallback(
    (id: string) => {
      try {
        return dispatch(fetchProductById(id));
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // Adicionar produto
  const addProduct = useCallback(
    async (values: ProductFormValues) => {
      try {
        const formData = ProductService.toFormData(values);
        return await dispatch(createProduct(formData)).unwrap();
      } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // Editar produto
  const editProduct = useCallback(
    async (id: string, values: ProductFormValues) => {
      try {
        const formData = ProductService.toFormData(values);
        return await dispatch(updateProduct({ id, formData })).unwrap();
      } catch (error) {
        console.error("Erro ao editar produto:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // Remover produto
  const removeProduct = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (error) {
        console.error("Erro ao remover produto:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // Limpar produto atual
  const clearProduct = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  // Limpar erros
  const clearError = useCallback(() => {
    dispatch(resetProductError());
  }, [dispatch]);

  // Manipulação de filtros
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilterApiParams>) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      dispatch(setFilters(updatedFilters));
      dispatch(fetchProducts(updatedFilters)); // Chamada direta com os filtros
    },
    [dispatch, state.filters]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters = { page: 1, limit: 10 };
    dispatch(setFilters(defaultFilters));
    dispatch(fetchProducts(defaultFilters)); // Chamada direta com os filtros
  }, [dispatch]);

  // Memoiza valores computados
  const memoizedValues = useMemo(
    () => ({
      products: state.products,
      userProducts: state.userProducts,
      currentProduct: state.currentProduct,
      loading: state.loading,
      error: state.error,
      pagination: state.pagination,
      filters: state.filters,
    }),
    [
      state.products,
      state.userProducts,
      state.currentProduct,
      state.loading,
      state.error,
      state.pagination,
      state.filters,
    ]
  );

  return {
    ...memoizedValues,
    getCollectionProducts, 
    prefetchCollection,
    getProducts,
    getFeaturedProducts,
    getUserProducts,
    getProductById,
    addProduct,
    editProduct,
    removeProduct,
    clearProduct,
    clearError,
    updateFilters,
    resetFilters,
  };
};
