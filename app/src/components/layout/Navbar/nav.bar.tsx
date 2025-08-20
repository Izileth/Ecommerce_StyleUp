import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { useAuthUser } from "~/src/hooks/useUser";
import { useCart } from "~/src/hooks/useCart";
import { cn } from "~/src/lib/utils";
import { Button } from "~/src/components/ui/Button/button";
import { Input } from "~/src/components/ui/Input/input";
import { motion, AnimatePresence } from "framer-motion";
import SearchComponent from "~/src/components/common/Search/search"; // Importando o componente de busca
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/src/components/imported/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "~/src/components/ui/Sheet/sheet"
import { UserAvatar } from "~/src/components/ui/Avatar/avatar";
import { toast } from "sonner";
import { LogoutButton } from "~/src/components/ui/User/logout";

import TopBanner from "../../common/Banner/banner.top";
export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuthUser()
  const { itemCount, getCart } = useCart();
  
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Carregar o carrinho quando o componente montar ou o usuário autenticar
  useEffect(() => {
    getCart();
  }, [getCart, isAuthenticated]);


  const navLinks = [
    { href: "/shop", label: "Coleções", hasSubmenu: true },
    { href: "/releases", label: "Lançamentos" },
    { href: "/products", label: "Produtos" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/contact", label: "Contato" },
  ]

  const shopCategories = [
    { href: "colections/womans", label: "Feminina" },
    { href: "colections/mens", label: "Masculina" },
    { href: "colections/summer", label: "Verão" },
    { href: "coletions/winter", label: "Inverno" },
  ]

  const handleLogin = () => navigate("/login")
  const handleRegister = () => navigate("/register")

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Você foi desconectado com sucesso")
      navigate("/")
    } catch (error) {
      toast.error("Erro ao fazer logout")
    }
  }


  return (
   <>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-white/95 backdrop-blur-sm border-b border-gray-100" : "bg-white",
      )}
    >
      <TopBanner />
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:text-black hover:bg-transparent"
                disabled={isLoading}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r border-gray-100">
              <div className="flex flex-col h-full">
                <div className="py-8 px-6 border-b border-gray-100">
                  <Link to="/" className="font-light text-2xl tracking-widest uppercase text-gray-900">
                    Ecliptica
                  </Link>
                </div>

                <div className="flex-1 overflow-auto py-6 px-6">
                  <nav className="space-y-6">
                    {navLinks.map((link) => (
                      <div key={link.href} className="space-y-4">
                        <Link
                          to={link.href}
                          className={cn(
                            "flex items-center justify-between text-sm font-light tracking-wide transition-colors",
                            location.pathname === link.href ? "text-black" : "text-gray-500 hover:text-black",
                          )}
                        >
                          <span>{link.label}</span>
                          {link.hasSubmenu && <ChevronRight className="h-4 w-4 opacity-50" />}
                        </Link>

                        {link.hasSubmenu && (
                          <div className="pl-4 space-y-3 border-l border-gray-100">
                            {shopCategories.map((category) => (
                              <Link
                                key={category.href}
                                to={category.href}
                                className={cn(
                                  "block py-1 text-xs font-light tracking-wide transition-colors",
                                  location.pathname === category.href ? "text-black" : "text-gray-500 hover:text-black",
                                )}
                              >
                                {category.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-gray-100 py-6 px-6">
                  {isAuthenticated ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <UserAvatar size="sm" />
                        <div className="flex flex-col">
                          <span className="text-sm font-light">{user?.name || "Usuário"}</span>
                          <span className="text-xs text-gray-500 font-light">{user?.email}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Link
                          to="/profile"
                          className="block text-xs font-light tracking-wide text-gray-500 hover:text-black transition-colors"
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          to="/orders"
                          className="block text-xs font-light tracking-wide text-gray-500 hover:text-black transition-colors"
                        >
                          Meus Pedidos
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block text-xs font-light tracking-wide text-gray-500 hover:text-black transition-colors"
                        >
                          Favoritos
                        </Link>
                        <SheetClose asChild>
                          <LogoutButton
                            variant="button"
                            className="w-full justify-start p-0 h-auto text-xs font-light tracking-wide text-gray-500 hover:text-red-500 hover:bg-transparent transition-colors"
                          />
                        </SheetClose>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Button
                          variant="default"
                          className="w-full bg-black hover:bg-black/90 text-white rounded-none font-light tracking-wide text-xs h-10 transition-colors duration-300"
                          onClick={handleLogin}
                          disabled={isLoading}
                        >
                          Entrar
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-none font-light tracking-wide text-xs h-10 transition-colors"
                          onClick={handleRegister}
                          disabled={isLoading}
                        >
                          Criar Conta
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link
              to="/"
              className="font-light text-2xl md:text-2xl tracking-widest uppercase text-gray-900 transition-colors hover:text-black relative group"
            >
              Ecliptica
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navLinks.map((link) =>
              link.hasSubmenu ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-xs font-light tracking-wide text-gray-700 hover:text-black transition-colors outline-none">
                    {link.label}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[180px] rounded-none border-gray-100 p-2">
                    {shopCategories.map((category) => (
                      <DropdownMenuItem
                        key={category.href}
                        asChild
                        className="text-xs font-light tracking-wide text-gray-700 hover:text-black focus:text-black rounded-none focus:bg-gray-50"
                      >
                        <Link to={category.href}>{category.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-xs font-light tracking-wide transition-colors relative group",
                    location.pathname === link.href ? "text-black" : "text-gray-700 hover:text-black",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-black transition-all duration-300",
                      location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  ></span>
                </Link>
              ),
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Substitua o bloco de busca pelo novo componente */}
            <div id="search-container" className="relative">
              {/* Novo componente de busca */}
              <SearchComponent />
            </div>

            {/* User Account */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    className="text-gray-700 hover:text-black hover:bg-transparent"
                  >
                    {isAuthenticated ? <UserAvatar size="sm" /> : <User className="h-4 w-4" />}
                    <span className="sr-only">Conta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px] rounded-none border-gray-100 p-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-2 text-xs font-light flex items-center gap-2 border-b border-gray-50 mb-1">
                        <UserAvatar size="sm" />
                        <div className="flex flex-col">
                          <span className="font-normal text-gray-900">{user?.name || "Usuário"}</span>
                          <span className="text-gray-500">{user?.email}</span>
                        </div>
                      </div>
                      <DropdownMenuItem
                        asChild
                        className="text-xs font-light tracking-wide text-gray-700 hover:text-black focus:text-black rounded-none focus:bg-gray-50"
                      >
                        <Link to="/profile">Meu Perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="text-xs font-light tracking-wide text-gray-700 hover:text-black focus:text-black rounded-none focus:bg-gray-50"
                      >
                        <Link to="/orders">Meus Pedidos</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="text-xs font-light tracking-wide text-gray-700 hover:text-black focus:text-black rounded-none focus:bg-gray-50"
                      >
                        <Link to="/wishlist">Favoritos</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem
                        onSelect={handleLogout}
                        className="text-xs font-light tracking-wide text-red-500 hover:text-red-600 focus:text-red-600 rounded-none focus:bg-red-50"
                      >
                        Sair
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onSelect={handleLogin}
                        className="text-xs font-light tracking-wide text-gray-700 hover:text-black focus:text-black rounded-none focus:bg-gray-50"
                      >
                        Entrar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleRegister}
                        className="text-xs font-light tracking-wide text-gray-700 hover:text-black focus:text-black rounded-none focus:bg-gray-50"
                      >
                        Criar Conta
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-700 hover:text-black hover:bg-transparent"
                disabled={isLoading}
              >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-light text-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="sr-only">Carrinho</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
   </>
  )
}