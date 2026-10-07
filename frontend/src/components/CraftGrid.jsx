import SectionHeading from './SectionHeading';
import CraftCard from './CraftCard';

export default function CraftGrid({ crafts }) {
  return (
    <section className="container section-block" id="explore">
      <SectionHeading
        eyebrow="Explore"
        title="Explore Coastal Crafts"
        description="Thoughtfully selected collections rooted in coastal Karnataka traditions, craftsmanship, and heritage."
      />

      <div className="craft-grid">
        {crafts.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </div>
    </section>
  );
}
