import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/sections/hero/HeroSection';
import ServicesSection from '../components/sections/services/ServicesSection';
import DigitalInvitationSection from '../components/sections/invitation/DigitalInvitationSection';
import GallerySection from '../components/sections/gallery/GallerySection';
import ProcessSection from '../components/sections/process/ProcessSection';
import TestimonialsSection from '../components/sections/testimonials/TestimonialsSection';
import PartnersSection from '../components/sections/partners/PartnersSection';
import TeamSection from '../components/sections/team/TeamSection';
import StatsSection from '../components/sections/stats/StatsSection';
import FAQSection from '../components/sections/faq/FAQSection';
import ContactSection from '../components/sections/contact/ContactSection';
import ScrollAnimationWrapper from '../components/common/ScrollAnimationWrapper';
import { SITE_NAME, SITE_DESCRIPTION } from '../utils/constants';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} — {SITE_DESCRIPTION}</title>
        <meta name="description" content="Ever After Events imagine et orchestre des mariages d’exception au Bénin, en Afrique de l’Ouest et à destination." />
        <meta property="og:title" content={`${SITE_NAME} — ${SITE_DESCRIPTION}`} />
      </Helmet>

      <HeroSection />
      <ServicesSection />
      <DigitalInvitationSection />
      <ScrollAnimationWrapper><GallerySection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><ProcessSection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><TestimonialsSection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><PartnersSection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><TeamSection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><StatsSection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><FAQSection /></ScrollAnimationWrapper>
      <ScrollAnimationWrapper><ContactSection /></ScrollAnimationWrapper>
    </>
  );
}
