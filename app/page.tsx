import { SiteTemplate } from "@/components/templates/SiteTemplate";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { HomeHero } from "@/components/organisms/HomeHero";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
export default function Home() {
  return (
    <SiteTemplate header={<Header />} footer={<Footer />}>
      <HomeHero />
      <FeaturesSection />
    </SiteTemplate>
  );
}
