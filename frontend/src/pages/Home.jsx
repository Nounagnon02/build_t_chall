import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/sections/hero/HeroSection';
import AboutSection from '../components/sections/about/AboutSection';
import ServicesSection from '../components/sections/services/ServicesSection';
import ProcessSection from '../components/sections/process/ProcessSection';
import GallerySection from '../components/sections/gallery/GallerySection';
import TestimonialsSection from '../components/sections/testimonials/TestimonialsSection';
import StatsSection from '../components/sections/stats/StatsSection';
import PartnersSection from '../components/sections/partners/PartnersSection';
import TeamSection from '../components/sections/team/TeamSection';
import FAQSection from '../components/sections/faq/FAQSection';
import ContactSection from '../components/sections/contact/ContactSection';
import SectionDivider from '../components/common/SectionDivider';
import ScrollAnimationWrapper from '../components/common/ScrollAnimationWrapper';
import { SITE_NAME, SITE_DESCRIPTION } from '../utils/constants';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} — {SITE_DESCRIPTION}</title>
        <meta name="description" content="Ever After Events — Agence de Mariages & Événements Premium. Transformons vos rêves en réalité. Découvrez nos services, galerie et outils interactifs." />
        <meta property="og:title" content={`${SITE_NAME} — ${SITE_DESCRIPTION}`} />
      </Helmet>

      <HeroSection />
      <SectionDivider variant="curveUp" color="fill-ivory" />

      <ScrollAnimationWrapper>
        <AboutSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="wave" color="fill-white" />

      <ScrollAnimationWrapper>
        <ServicesSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="angle" color="fill-ivory" />

      <ScrollAnimationWrapper>
        <ProcessSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="curveDown" color="fill-white" />

      <ScrollAnimationWrapper>
        <GallerySection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="wave" color="fill-ivory" />

      <ScrollAnimationWrapper>
        <TestimonialsSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="curveUp" color="fill-charbon" />

      <ScrollAnimationWrapper>
        <StatsSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="angle" color="fill-white" />

      <ScrollAnimationWrapper>
        <PartnersSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="curveDown" color="fill-ivory" />

      <ScrollAnimationWrapper>
        <TeamSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="wave" color="fill-white" />

      <ScrollAnimationWrapper>
        <FAQSection />
      </ScrollAnimationWrapper>
      <SectionDivider variant="curveUp" color="fill-ivory" />

      <ScrollAnimationWrapper>
        <ContactSection />
      </ScrollAnimationWrapper>
    </>
  );
}
