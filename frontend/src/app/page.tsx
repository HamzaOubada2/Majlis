import { Hero } from '@/components/home/hero';
import { Stats } from '@/components/home/stats';
import { FeaturedSeminars } from '@/components/home/featured-seminars';
import { HowItWorks } from '@/components/home/how-it-works';
import { CtaBand } from '@/components/home/cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedSeminars />
      <HowItWorks />
      <CtaBand />
    </>
  );
}