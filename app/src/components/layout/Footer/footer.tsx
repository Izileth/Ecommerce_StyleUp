

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react"
import { Button } from "~/src/components/ui/Button/button"
import { Input } from "~/src/components/ui/Input/input"
import Bandeiras from "~/src/assets/Banderias_de_Cartões.png"
export default function Footer() {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter signup
        console.log("Newsletter signup:", email)
        setEmail("")
        // You would typically call your API here
    }

    const year = new Date().getFullYear()

    return (
        <footer className="bg-white border-t text-zinc-950 py-6">
        <div className="container mx-auto ">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 px-6 py-6">
            {/* Brand Column */}
            <div className="space-y-6">
                <Link to="/" className="font-serif text-xl font-medium tracking-wider">
                ECLIPTICA
                </Link>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Projetando um Novo Futuro - Hoje
                </p>
                <div className="flex items-center space-x-4">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="Instagram"
                >
                    <Instagram className="h-5 w-5" />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="Facebook"
                >
                    <Facebook className="h-5 w-5" />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="Twitter"
                >
                    <Twitter className="h-5 w-5" />
                </a>
                <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-black transition-colors"
                    aria-label="YouTube"
                >
                    <Youtube className="h-5 w-5" />
                </a>
                </div>
            </div>

            {/* Shop Column */}
            <div className="space-y-6">
                <h3 className="font-medium text-sm uppercase tracking-wider">Categorias</h3>
                <nav className="flex flex-col space-y-3">
                <Link to="categorys/shirts" className="text-sm text-muted-foreground hover:text-black transition-colors">    
                    Camisetas
                </Link>
                <Link to="categorys/pants" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Calças
                </Link>
                <Link to="categorys/dress" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Vestidos
                </Link>
                <Link to="categorys/accessories" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Accessórios
                </Link>
                <Link to="releases" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Promoções
                </Link>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Coleções
                </Link>
                </nav>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
                <h3 className="font-medium text-sm uppercase tracking-wider">Empresa</h3>
                <nav className="flex flex-col space-y-3">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Sobre Nós
                </Link>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Produtos
                </Link>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Carreiras
                </Link>
                <Link to="/stores" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Lojas
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-black transition-colors">
                    Contato
                </Link>
                </nav>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-6">
                <h3 className="font-medium text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                    Nunca Pare de Evoluir
                </h3>
                <p className="text-sm text-muted-foreground">
                    Toda jornada de transformação começa com um único passo. No nosso blog, você encontra reflexões profundas, estratégias práticas e histórias reais de superação. 
                </p>
                <a 
                    href="/products" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-medium text-zinc-950 hover:text-zinc-800 transition duration-200"
                >
                    Ver Produtos →
                </a>
            </div>

            </div>

            {/* Payment Methods */}
            <div className="p-6 border-t">
                <div className="flex flex-wrap gap-4 justify-center">
                    <div className="flex gap-2">
                    <div className="w-auto h-6 border border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-xs text-black font-light p-2">VISA</span>
                    </div>
                    <div className="w-auto h-6   border border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-xs text-black font-light p-2">MASTERCARD</span>
                    </div>
                    <div className="w-auto h-6 border border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-xs text-black font-light p-2">PAYPAL</span>
                    </div>
                    <div className="w-auto h-6 border border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-xs text-black font-light p-2">PIX</span>
                    </div>
                    <div className="w-auto   h-6 border border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-xs text-black font-light p-2">BOLETO</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-6 border-t text-center md:flex md:justify-between md:text-left">
            <p className="text-xs text-muted-foreground">&copy; {year} ECLIPTICA | Todos os Direitos Reservados.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
                <Link to="/terms" className="text-xs text-muted-foreground hover:text-black transition-colors">
                    Termos de Serviço
                </Link>
                <Link to="/privacy" className="text-xs text-muted-foreground hover:text-black transition-colors">
                    Política de Privacidade
                </Link>
                <Link to="/shipping" className="text-xs text-muted-foreground hover:text-black transition-colors">
                    Segurança de Dados
                </Link>
                <Link to="/returns" className="text-xs text-muted-foreground hover:text-black transition-colors">
                    Dúvidas & Repostas
                </Link>
            </div>
            </div>
        </div>
        </footer>
    )
}

