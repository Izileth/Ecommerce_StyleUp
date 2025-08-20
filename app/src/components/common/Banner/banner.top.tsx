import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Truck, Tag, Shield } from 'lucide-react';

interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  link?: string;
}

const TopBanner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners: BannerItem[] = [
        {
        id: 1,
        title: "Frete Grátis",
        subtitle: "Em compras acima de R$ 199",
        icon: <Truck className="w-5 h-5" />
        },
        {
        id: 2,
        title: "Mega Promoção",
        subtitle: "Até 50% OFF em produtos selecionados",
        icon: <Tag className="w-5 h-5" />
        },
        {
        id: 3,
        title: "Compra Segura",
        subtitle: "Proteção total em todas as transações",
        icon: <Shield className="w-5 h-5" />
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play do carousel
    useEffect(() => {
        const interval = setInterval(() => {
        nextSlide();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="bg-black text-white py-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
            {/* Container do carousel */}
            <div className="relative flex items-center justify-center">
            
            {/* Botão anterior */}
            <button
                onClick={prevSlide}
                className="absolute left-0 z-10 p-1 hover:bg-gray-800 rounded-full transition-colors duration-200"
                aria-label="Banner anterior"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Conteúdo do banner */}
            <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2">
                {banners[currentIndex].icon}
                <div>
                    <span className="font-semibold text-sm">
                    {banners[currentIndex].title}
                    </span>
                    <span className="text-gray-300 text-sm ml-2">
                    {banners[currentIndex].subtitle}
                    </span>
                </div>
                </div>
            </div>

            {/* Botão próximo */}
            <button
                onClick={nextSlide}
                className="absolute right-0 z-10 p-1 hover:bg-gray-800 rounded-full transition-colors duration-200"
                aria-label="Próximo banner"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center mt-2  space-x-2">
            {banners.map((_, index) => (
                <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
                />
            ))}
            </div>
        </div>

        {/* Barra de progresso */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-4000 ease-linear"
            style={{ width: `${((currentIndex + 1) / banners.length) * 100}%` }}
        />
        </div>
    );
};

export default TopBanner;