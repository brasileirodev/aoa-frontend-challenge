import { SiteTemplate } from "@aoa/marketing/components/templates/SiteTemplate";
import { Header } from "@aoa/marketing/components/organisms/Header";
import { Footer } from "@aoa/marketing/components/organisms/Footer";
import { HomeHero } from "@aoa/marketing/components/organisms/HomeHero";
import { FeaturesSection } from "@aoa/marketing/components/organisms/FeaturesSection";
export default function Home() {
  return (
    <SiteTemplate header={<Header />} footer={<Footer />}>
      <HomeHero />
      <FeaturesSection />
    </SiteTemplate>
  );
}
