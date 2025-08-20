import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProducts } from "~/src/hooks/useProducts"
import { useCart } from "~/src/hooks/useCart"
import { useProductRatings } from "~/src/hooks/useProductsRating"

import toast from "react-hot-toast"


import { formatPriceBRL } from "~/src/utils/format"

import { Button } from "~/src/components/imported/button"
import { ArrowLeft, Minus, Plus, Check, ShoppingBag, Tag, Star, Heart, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/imported/tabs"
import { Badge } from "~/src/components/imported/badge"
import { Skeleton } from "~/src/components/imported/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/src/components/imported/accordion"

import RelatedProducts from "~/src/components/products/Recommendations/recommentations"

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentProduct: product, getProductById, loading, error, clearProduct } = useProducts()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("description")
  const mainImageRef = useRef<HTMLDivElement>(null)

  const {
    rating,
    ratingCount,
    likes,
    hasLiked,
    toggleLike
  } = useProductRatings(id || '')

  useEffect(() => {
    if (id) {
      getProductById(id)
    }

    return () => {
      clearProduct()
    }
  }, [id, getProductById, clearProduct])

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image)
      setSelectedImageIndex(0)
    }
    // Seleciona primeira cor e tamanho disponíveis por padrão
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].colorName);
    }
    
    if (product?.sizes) {
      const availableSizes = product.sizes.filter(size => size.stock > 0);
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0].size);
      }
    }
  }, [product])

  if (error) {
    console.error("Erro ao carregar detalhes do produto:", error)
    navigate("/404")
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && product && newQuantity <= availableStock()) {
      setQuantity(newQuantity)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString("pt-BR", options)
    } catch (error) {
      return dateString
    }
  }

  const handleAddToCart = async () => {
    if (!product?.id) return

    setAddingToCart(true)
    try {
      await addItem(product.id, quantity)
      setAddedToCart(true)

      setTimeout(() => {
        setAddedToCart(false)
      }, 2000)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  const toggleFavorite = () => {
    toggleLike()
    // Adicione qualquer lógica adicional de favoritos aqui
  }

   const handleShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      const productUrl = `${window.location.origin}/products/${product?.id}`;
  
      if (navigator.share) {
        navigator
          .share({
            title: product?.name,
            text: `Confira este produto incrível: ${product?.name}`,
            url: productUrl,
          })
          .catch((err) => {
            console.log("Erro ao compartilhar:", err);
            copyToClipboard(productUrl);
          });
      } else {
        copyToClipboard(productUrl);
      }
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Link copiado para a área de transferência!");
        })
        .catch((err) => {
          console.error("Erro ao copiar:", err);
          // Fallback para navegadores mais antigos
          const textarea = document.createElement("textarea");
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          toast.success("Link copiado para a área de transferência!");
        });
    };
  

  const scrollToImage = (index: number) => {
    setSelectedImageIndex(index)

    const image = allImages[index];
    if (typeof image === 'string' || image === null) {
        setSelectedImage(image);
      } else {
        setSelectedImage(image); // Ou qualquer outra propriedade que seja a URL
    }

    if (mainImageRef.current) {
      mainImageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <Skeleton className="w-full aspect-square rounded-xl" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-full h-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="h-px bg-gray-100 my-4" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 p-8 rounded-xl border border-gray-200"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-3">Produto não encontrado</h2>
          <p className="text-gray-500 mb-6">O produto que você está procurando não está disponível no momento.</p>
          <Button
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium text-sm px-6 h-10 transition-colors duration-300"
            onClick={() => navigate("/produtos")}
          >
            Explorar Produtos
          </Button>
        </motion.div>
      </div>
    )
  }

  // Verifica se o produto está em promoção
  const hasDiscount = product.salePrice !== null && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice! : product.price;
  const discountPercentage = hasDiscount ? Math.round((1 - product.salePrice! / product.price) * 100) : 0

  // Todas as imagens do produto (principal + adicionais)
  const allImages = product.image ? [product.image, ...(product.images || [])] : []

  // Estoque disponível considerando cor/tamanho selecionados
  const availableStock = () => {
    if (selectedSize) {
      const size = product.sizes?.find((s) => s.size === selectedSize)
      return size?.stock || product.countInStock
    }
    return product.countInStock
  }

  type ImageSource = string | { url: string };


  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 mt-12 h-auto">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="mb-10 flex items-center text-gray-500 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm">Voltar</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 h-auto ">
        {/* Coluna da Imagem */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="sticky top-8 space-y-4">
            <div ref={mainImageRef} className="relative overflow-hidden bg-gray-50 rounded-xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  className="w-full h-auto object-contain aspect-square mix-blend-multiply"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {hasDiscount && (
                  <Badge className="bg-zinc-950 hover:bg-zinc-600 text-zinc-50 border-none px-3 py-1.5 rounded-full">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {product.countInStock < 10 && product.countInStock > 0 && (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none px-3 py-1.5 rounded-full">
                    Últimas unidades
                  </Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFavorite}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-600 hover:text-rose-500 transition-colors"
              >
                <Heart className={`h-5 w-5 ${hasLiked ? "fill-rose-500 text-rose-500" : "fill-transparent"}`} />
              </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Compartilhar produto"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-rose-500 text-rose-500" : "text-gray-600"}`} />
                <span className="text-xs font-medium text-gray-700">{likes}</span>
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {allImages.map((img, index) => {
                  const imageUrl = typeof img === 'string' ? img : img;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => scrollToImage(index)}
                      className={`border overflow-hidden transition-all ${
                        selectedImageIndex === index
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={`${product.name} - vista ${index + 1}`}
                        className="w-full h-16 sm:h-20 object-cover mix-blend-multiply bg-gray-50"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Coluna de Detalhes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Cabeçalho com badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {product.collection && (
              <Badge variant="outline" className="text-xs font-normal rounded-full px-3 py-1 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {product.collection}
              </Badge>
            )}
            {product.category && (
              <Badge variant="outline" className="text-xs font-normal rounded-full px-3 py-1">
                {product.category}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight">{product.name}</h1>

          {/* Preços */}
          <div className="flex items-baseline gap-4">
            <span className={` text-4xl  md:text-6xl font-semibold ${hasDiscount ? "text-zinc-700" : "text-gray-900"}`}>
              {formatPriceBRL(displayPrice)}
            </span>
            {hasDiscount && <span className="text-gray-400 line-through text-2xl">{formatPriceBRL(product.price)}</span>}
          </div>

          {/* Avaliação (placeholder) */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(rating)
                      ? "fill-zinc-950 text-zinc-900"
                      : star - 0.5 <= rating
                        ? "fill-zinc-50/50 text-zinc-900"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>({ratingCount} avaliações)</span>
          </div>

          <div className="h-px bg-gray-100 my-4" />

          {/* Tabs para informações do produto */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="description" className="text-sm">
                Descrição
              </TabsTrigger>
              <TabsTrigger value="features" className="text-sm">
                Características
              </TabsTrigger>
              <TabsTrigger value="details" className="text-sm">
                Detalhes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600 leading-relaxed"
              >
                {product.description}
              </motion.div>
            </TabsContent>

            <TabsContent value="features" className="mt-0">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {product.features?.length > 0 ? (
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma característica especificada para este produto.</p>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 text-sm"
              >
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-mono text-gray-900">{product.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Categoria</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                {product.collection && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Coleção</span>
                    <span className="text-gray-900">{product.collection}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Disponibilidade</span>
                  <span className={availableStock() > 0 ? "text-emerald-600" : "text-rose-600"}>
                    {availableStock() > 0 ? `${availableStock()} em estoque` : "Esgotado"}
                  </span>
                </div>
                {product.createdAt && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Adicionado em</span>
                    <span className="text-gray-900">{formatDate(product.createdAt)}</span>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>

          <div className="h-px bg-gray-100 my-4" />

          {/* Cores */}
          {product.colors?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Cores</h3>
                <span className="text-xs text-gray-500">
                  {selectedColor ? `Selecionado: ${selectedColor}` : "Selecione uma cor"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <motion.button
                    key={color.id || index}
                    onClick={() => setSelectedColor(color.colorName)}
                    disabled={color.stock <= 0}
                    className={`group relative flex items-center gap-2 px-3 py-2 border rounded-full transition-all ${
                      selectedColor === color.colorName
                        ? "border-gray-900 bg-gray-50"
                        : color.stock > 0
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-gray-100 opacity-50 cursor-not-allowed"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color.colorCode }}
                    />
                    <span className="text-sm">{color.colorName}</span>
                    {color.stock > 0 && (
                      <span className="text-xs text-gray-500 group-hover:text-gray-700">({color.stock})</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tamanhos */}
          {product.sizes?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Tamanhos</h3>
                <span className="text-xs text-gray-500">
                  {selectedSize ? `Selecionado: ${selectedSize}` : "Selecione um tamanho"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <motion.button
                    key={size.id || index}
                    onClick={() => setSelectedSize(size.size)}
                    disabled={size.stock <= 0}
                    className={`relative px-4 py-2 border rounded-lg text-sm transition-all ${
                      selectedSize === size.size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : size.stock > 0
                          ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          : "border-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    title={size.stock <= 0 ? "Esgotado" : `${size.stock} disponíveis`}
                  >
                    {size.size}
                    {size.stock <= 0 && (
                      <span className="absolute inset-0 border border-gray-100 rounded-lg flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        Esgotado
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="h-px bg-gray-100 my-4" />

          {/* Adicionar ao carrinho */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900">Quantidade</span>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <motion.button
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="h-3 w-3" />
                </motion.button>
                <div className="w-12 h-10 flex items-center justify-center font-medium text-gray-900">{quantity}</div>
                <motion.button
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= availableStock()}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-3 w-3" />
                </motion.button>
              </div>
              <span className="text-sm text-gray-500">
                {availableStock() > 0 ? `${availableStock()} disponíveis` : "Esgotado"}
              </span>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                className={`w-full text-white rounded-full font-medium text-sm h-12 transition-colors duration-300 flex items-center justify-center ${
                  addingToCart
                    ? "bg-gray-400"
                    : addedToCart
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-900 hover:bg-gray-800"
                }`}
                onClick={handleAddToCart}
                disabled={addingToCart || availableStock() <= 0}
              >
                {addingToCart ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Adicionando...
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Adicionado ao Carrinho
                  </>
                ) : availableStock() <= 0 ? (
                  "Produto Esgotado"
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Adicionar ao Carrinho - {formatPriceBRL(displayPrice * quantity)}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Informações adicionais em acordeão */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-8"
          >
            <Accordion type="single" collapsible className="border rounded-xl overflow-hidden">
              <AccordionItem value="shipping" className="border-b">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-medium">
                  Informações de Envio
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1 text-sm text-gray-600">
                  <p>
                    Entrega em todo o Brasil. Frete grátis para compras acima de R$ 200,00. Prazo de entrega estimado
                    entre 3-7 dias úteis, dependendo da sua localização.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns" className="border-b">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-medium">
                  Política de Devolução
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1 text-sm text-gray-600">
                  <p>
                    Você tem até 30 dias para devolver o produto caso não esteja satisfeito. O produto deve estar em
                    perfeitas condições, na embalagem original e com todas as etiquetas.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="warranty" className="border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-sm font-medium">Garantia</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1 text-sm text-gray-600">
                  <p>
                    Este produto possui garantia de 90 dias contra defeitos de fabricação. Em caso de problemas, entre
                    em contato com nosso suporte ao cliente.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
      <div className="h-auto bg-transparent my-12">
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  )
}

export default ProductDetails
