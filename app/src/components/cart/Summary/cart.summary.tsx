import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ShoppingBag, Truck, Check } from "lucide-react"
import { Button } from "~/src/components/imported/button"
import { Progress } from "~/src/components/imported/progress"
import { Separator } from "~/src/components/imported/separator"
import { cn } from "~/src/lib/utils"
import { formatPriceBRL } from "~/src/utils/format"
// Types
interface Product {
  id: string
  name: string
  price: number
  image?: string
}

interface CartItem {
  id: string
  product?: Product
  quantity: number
}

interface Cart {
  items: CartItem[]
}

interface CartSummaryProps {
  cart?: Cart | null
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure animations only run after component is mounted (for SSR compatibility)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate cart totals
  const items = cart?.items || []
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0
    const quantity = item.quantity || 0
    return sum + price * quantity
  }, 0)

  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

  // Calculate progress toward free shipping
  const freeShippingThreshold = 100
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const amountToFreeShipping = Math.max(freeShippingThreshold - subtotal, 0)

  if (itemCount === 0) {
    return (
      <motion.div
        initial={mounted ? { opacity: 0, y: 10 } : false}
        animate={mounted ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-lg border bg-card shadow-sm"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-medium">Seu Carrinho Está Vazio</h2>
          <p className="mb-6 text-sm text-muted-foreground">Os Items que foram adicionados aparecerão aqui..</p>
          <Link to="/products">
            <Button className="w-full">Pesquisar mais Produtos</Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 10 } : false}
      animate={mounted ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg border bg-card shadow-sm"
    >
      <div className="p-6">
        <h2 className="mb-4 text-xl font-medium">Sumário de Compra</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span>{formatPriceBRL(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Entrega</span>
            <AnimatePresence mode="wait">
              {shipping === 0 ? (
                <motion.span
                  key="free"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center text-green-600 dark:text-green-500"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Grátis
                </motion.span>
              ) : (
                <motion.span
                  key="paid"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {formatPriceBRL(shipping)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <motion.span
              className="text-lg font-bold"
              key={total}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              {formatPriceBRL(total)}
            </motion.span>
          </div>
        </div>

        {/* Free shipping progress */}
        <div className={cn("mt-6 space-y-2", shipping === 0 ? "opacity-50" : "")}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Truck className="mr-1.5 h-4 w-4" />
              {shipping === 0 ? (
                <span>Entrega Grátis Aplicada</span>
              ) : (
                <span>{formatPriceBRL(amountToFreeShipping)} Preço Restante Para Ganhar Frente Grátis</span>
              )}
            </div>
          </div>
          <Progress value={freeShippingProgress} className="h-1.5" />
        </div>

        {shipping === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Voce Desbloqueou o Frete Grátis!
            </div>
          </motion.div>
        )}

        <div className="mt-6 space-y-3">
          <Link to={itemCount > 0 ? "/checkout" : "#"}>
            <Button className="w-full" size="lg" disabled={itemCount === 0}>
              Checkout Final
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link to="/products">
            <Button variant="outline" className="w-full mt-2">
              Continue Comprando
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
