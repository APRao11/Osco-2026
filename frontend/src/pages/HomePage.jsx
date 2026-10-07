import Hero from '../components/Hero';
import CraftGrid from '../components/CraftGrid';
import SectionHeading from '../components/SectionHeading';
import { crafts } from '../data/crafts';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CraftGrid crafts={crafts} />

      <section className="container section-block discovery-panel">
        <SectionHeading
          eyebrow="Why explore"
          title="Stories shaped by the coast"
          description="Every piece reflects a craft tradition, a family practice, and a way of life rooted in coastal Karnataka."
        />

        <div className="feature-grid">
          <article>
            <span>01</span>
            <h3>Curated collections</h3>
            <p>Discover thoughtfully selected crafts and keep the browsing experience rooted in inspiration.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Handmade with heritage</h3>
            <p>Each product brings a warm sense of place, process, and continuity from artisan to home.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Simple discovery</h3>
            <p>Explore by craft, follow your curiosity, and move from category to product without friction.</p>
          </article>
        </div>
      </section>
    </>
  );
}
