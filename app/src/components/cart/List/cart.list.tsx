import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "~/src/components/imported/button"
import { Skeleton } from "~/src/components/imported/skeleton"
import { cn } from "~/src/lib/utils"
import { formatPriceBRL } from "~/src/utils/format"

// Types
interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
}

interface CartItem {
  id: string
  product?: Product
  quantity: number
}

interface CartItemListProps {
  items?: CartItem[]
  onUpdate: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  loading?: boolean
}

export default function CartItemList({ items = [], onUpdate, onRemove, loading = false }: CartItemListProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemove(itemId)
    } else {
      onUpdate(itemId, newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 rounded-lg">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border bg-card p-4">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center"
      >
        <div className="mb-3 rounded-full bg-muted p-3">
          <Trash2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-medium">Seu Carrinho Está Vazio</h3>
        <p className="text-sm text-muted-foreground">Os Items que foram adicionados aparecerão aqui...</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg border bg-card"
          >
            <div className="p-4">
              <div className="flex flex-row gap-4 sm:flex-row sm:items-start">
                {/* Product image */}
                <div className="relative h-auto w-28 overflow-hidden rounded-md sm:h-auto sm:w-24">
                  {item.product?.image ? (
                    <motion.img
                      src={item.product.image}
                      alt={item.product.name || "Product"}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-xs text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="flex flex-1 flex-col">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium">{item.product?.name || "Unavailable product"}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(item.id)}
                      className="h-8 w-8 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>

                  {item.product?.description && (
                    <motion.div
                      className={cn(
                        "text-sm text-muted-foreground",
                        expandedItem === item.id ? "line-clamp-none" : "line-clamp-2",
                      )}
                    >
                      {item.product.description}
                    </motion.div>
                  )}

                  {item.product?.description && item.product.description.length > 100 && (
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="mb-2 mt-1 text-left text-xs font-medium text-primary"
                    >
                      {expandedItem === item.id ? "Show less" : "Read more"}
                    </button>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{formatPriceBRL(item.product?.price || 0)}</div>
                    <div className="flex items-center rounded-md border bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none rounded-l-md"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Adcionar Item</span>
                      </Button>
                      <div className="flex h-8 w-10 items-center justify-center text-sm">{item.quantity}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none rounded-r-md"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Remover Item</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
