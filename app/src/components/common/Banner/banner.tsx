import React from 'react';
import { ArrowRightIcon } from 'lucide-react';

const BlogBanner: React.FC = () => {
  return (
        <section className="py-8 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-light mb-3">
                Explore o Universo da Moda
                </h2>
                <p className="text-gray-300 mb-6 md:mb-0">
                Descubra as últimas novidades, análises e lançamentos no nosso blog exclusivo.
                </p>
            </div>
            
            <a 
                href="/products" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-2 text-zinc-50  hover:text-zinc-200 transition-colors rounded-xs"
            >
                <span className="font-medium">Ver Catálogo</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
            </a>
            </div>
        </div>
        </section>
    );
};

export default BlogBanner;