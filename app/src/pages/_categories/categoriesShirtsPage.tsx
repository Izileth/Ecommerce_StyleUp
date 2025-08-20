import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "~/src/components/categories/Grid/grid";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
import BlogBanner from "~/src/components/common/Banner/banner";

import { ArrowDown } from "lucide-react";
const CamisetasGrid = () => {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CategoryBanner
        category="Camisas"
        title="A Base do Seu Estilo"
        description="Camisetas versáteis que elevam o básico ao extraordinário. Para todos os momentos, todos os dias."
        videoUrl="https://v1.pinimg.com/videos/mc/720p/10/d7/02/10d7029d70efdad6c89a93aa4c22441b.mp4"
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
          category="Camisetas"
          title="Camisetas que Falam por Você"
          description="Do básico ao ousado, conforto com personalidade"
        />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default CamisetasGrid;
