import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "~/src/components/categories/Grid/grid";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import BlogBanner from "~/src/components/common/Banner/banner";
import { Button } from "~/src/components/imported/button";

import { ArrowDown } from "lucide-react";
const VestidosGrid = () => {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CategoryBanner
        category="Vestidos"
        title="Fluidez Que Encanta"
        description="Vestidos que dançam com o corpo, exalam elegância e destacam sua beleza natural."
        textPosition="left"
        textColor="light"
        videoUrl="https://v1.pinimg.com/videos/mc/720p/0a/50/a9/0a50a9873039ce7d0174fa066f699ff7.mp4"
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
          category="Vestidos"
          title="Vestidos Que Encantam"
          description="Leveza e elegância para todos os momentos"
        />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default VestidosGrid;
