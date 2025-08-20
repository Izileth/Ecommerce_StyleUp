import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "~/src/components/categories/Grid/grid";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
import BlogBanner from "~/src/components/common/Banner/banner";

import { ArrowDown } from "lucide-react";
const AcessoriosGrid = () => {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CategoryBanner
        category="Acessórios"
        title="O Detalhe Que Transforma"
        description="Estilo está nos detalhes. Complete seu visual com atitude e bom gosto."
        videoUrl="https://v1.pinimg.com/videos/mc/720p/d0/57/91/d057913998539ded622170bc71c53e76.mp4"
        textPosition="center"
        textColor="light"
        overlayOpacity={0.5}
        videoOptions={{
          muted: true,
          controls: false,
        }}
      >
          <Button onClick={scrollToContent} variant="outline" className="mt-4 text-zinc-100 bg-transparent border-none rounded-none">
          Explorar Coleção
          <ArrowDown/>
        </Button>
      </CategoryBanner>
      <Container maxWidth="full" className="px-0 mx-0 p-0" padding={false} id="grid">
        <CategoryGrid
          category="Acessórios"
          title="Detalhes Que Se Destacam"
          description="Seu visual completo começa nos detalhes"
        />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default AcessoriosGrid;
