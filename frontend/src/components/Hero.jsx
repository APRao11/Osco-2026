export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">Curated coastal heritage</p>
        <h1>Discover the crafts of coastal Karnataka.</h1>
        <p className="hero-text">
          Explore handcrafted heirlooms, woven textures, and timeless artistry from the
          shoreline communities that keep tradition alive.
        </p>
      </div>

      <div className="hero-visual">
        <svg
          className="heritage-art"
          viewBox="0 0 620 500"
          role="img"
          aria-labelledby="heritage-art-title"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="heritage-art-title">Illustrated coastal Karnataka shoreline and woven patterns</title>
          <defs>
            <pattern id="woven-ground" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M0 0h18M0 9h18M0 0v18M9 0v18" stroke="#8a6248" strokeOpacity=".12" />
            </pattern>
          </defs>
          <rect width="620" height="500" rx="28" fill="#f2e7d6" />
          <rect width="620" height="500" rx="28" fill="url(#woven-ground)" opacity=".52" />
          <circle cx="407" cy="165" r="91" fill="#d8bd98" opacity=".78" />
          <circle cx="407" cy="165" r="112" fill="none" stroke="#8a6248" strokeOpacity=".28" />
          <path d="M295 167a112 112 0 0 1 224 0" fill="none" stroke="#8a6248" strokeOpacity=".38" />
          <path d="M0 304c93-35 159 29 255 0s163-21 365 7v189H0z" fill="#b98e68" opacity=".45" />
          <path d="M0 341c99-35 164 28 264 0s212-20 356 7" fill="none" stroke="#6b4632" strokeOpacity=".72" strokeWidth="3" />
          <path d="M0 374c102-30 170 28 267 0s215-20 353 7M0 407c102-30 170 28 267 0s215-20 353 7" fill="none" stroke="#8a6248" strokeOpacity=".52" strokeWidth="2" />
          <path d="M151 313c22-58 25-112 3-163" fill="none" stroke="#6b4632" strokeWidth="8" strokeLinecap="round" />
          <path d="M155 155c-38-29-62-33-87-25 29 6 48 24 69 44M155 155c-20-38-19-62-5-83 2 30 14 51 27 74M155 155c4-42 19-62 42-73-12 27-14 52-13 79M155 155c27-31 51-39 77-34-26 12-43 30-60 50M155 155c-40-11-62-7-81 10 30-4 53 5 77 17" fill="none" stroke="#6b4632" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M73 280c24-18 43-18 66 0s42 18 65 0M85 293c19-13 34-13 52 0s34 13 52 0" fill="none" stroke="#6b4632" strokeOpacity=".7" strokeWidth="2" />
          <path d="M34 451h552M34 463h552" stroke="#6b4632" strokeOpacity=".35" />
          <path d="m42 451 7 12 7-12 7 12 7-12m470 0 7 12 7-12 7 12 7-12" fill="none" stroke="#6b4632" strokeOpacity=".45" strokeWidth="1.5" />
          <text x="42" y="431" fill="#6b4632" fontFamily="Source Sans 3, sans-serif" fontSize="13" fontWeight="700" letterSpacing="3">
            KARNATAKA · COAST &amp; CRAFT
          </text>
        </svg>
      </div>
    </section>
  );
}
