export const formatPrice = (price?: number) => {
    return (price ?? 0).toFixed(2);
}

export const formatPriceBRL = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(price);
};