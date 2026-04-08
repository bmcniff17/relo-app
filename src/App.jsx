import { useState, useEffect, useRef } from "react";

// ── Fonts loaded via index.html ──────────────────────────────────────────────

// ── SVG Skylines ──────────────────────────────────────────────────────────────
import SKYLINES from "./Skylines.jsx";

// ── Constants ───────────────────────────────────────────────────────────────
const _RELO_VERSION = "1.0.0";


const NeighborhoodMap = (props) => {
  var {city, scored, selectedNeighborhood, onSelectNeighborhood} = props;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(false);

  const maxScore = scored.length ? Math.max(...scored.map(n => n.score)) : 0;
  const minScore = scored.length ? Math.min(...scored.map(n => n.score)) : 0;

  // Init map when city changes
  useEffect(() => {
    if (!scored.length) return;
    let cancelled = false;
    // Clean up previous markers
    markersRef.current.forEach(m => m.marker.setMap(null));
    markersRef.current = [];

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapRef.current) return;
        const center = city.mapCenter
          ? { lat: city.mapCenter[0], lng: city.mapCenter[1] }
          : { lat: scored[0].lat, lng: scored[0].lng };

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          styles: [
            { elementType:"geometry", stylers:[{ color:"#0d1117" }] },
            { elementType:"labels.text.fill", stylers:[{ color:"#9e9e9e" }] },
            { elementType:"labels.text.stroke", stylers:[{ color:"#1a1a2e" }] },
            { featureType:"road", elementType:"geometry", stylers:[{ color:"#1c1c2e" }] },
            { featureType:"road", elementType:"geometry.stroke", stylers:[{ color:"#212121" }] },
            { featureType:"road.highway", elementType:"geometry", stylers:[{ color:"#2c2c3e" }] },
            { featureType:"water", elementType:"geometry", stylers:[{ color:"#050810" }] },
            { featureType:"poi", elementType:"labels", stylers:[{ visibility:"off" }] },
            { featureType:"transit", stylers:[{ visibility:"off" }] },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
        });

        // Fit bounds to all neighborhoods
        const bounds = new window.google.maps.LatLngBounds();
        scored.forEach(n => bounds.extend({ lat: n.lat, lng: n.lng }));
        mapInstance.current.fitBounds(bounds, 60);

        // Place markers
        markersRef.current = scored.map((n, i) => {
          const isTop = n.score === maxScore;
          const isLeast = n.score === minScore && minScore < maxScore;
          const color = isTop ? city.accent : isLeast ? "#4a4a6a" : city.accentLight;
          const scale = isTop ? 22 : isLeast ? 14 : 18;

          const marker = new window.google.maps.Marker({
            position: { lat: n.lat, lng: n.lng },
            map: mapInstance.current,
            title: n.name,
            label: { text: String(i + 1), color: "#fff", fontSize: isTop ? "11px" : "9px", fontWeight: "700" },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale,
              fillColor: color,
              fillOpacity: isLeast ? 0.45 : isTop ? 0.9 : 0.75,
              strokeColor: "#fff",
              strokeWeight: isTop ? 2 : 1,
              strokeOpacity: isTop ? 0.5 : 0.2,
            },
            zIndex: isTop ? 10 : isLeast ? 1 : 5,
          });

          marker.addListener("click", () => {
            onSelectNeighborhood(selectedNeighborhood === n.name ? null : n.name);
          });

          return { marker, name: n.name };
        });
      })
      .catch(() => setMapError(true));

    return () => { cancelled = true; };
  }, [city.id]);

  // Update marker appearance on selection change
  useEffect(() => {
    if (!window.google?.maps || !markersRef.current.length) return;
    markersRef.current.forEach(({ marker, name }, i) => {
      const n = scored[i];
      if (!n) return;
      const isTop = n.score === maxScore;
      const isLeast = n.score === minScore && minScore < maxScore;
      const isSelected = selectedNeighborhood === name;
      const color = isTop ? city.accent : isLeast ? "#4a4a6a" : city.accentLight;
      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? (isTop ? 26 : 22) : isTop ? 22 : isLeast ? 14 : 18,
        fillColor: isSelected ? "#fff" : color,
        fillOpacity: isLeast ? 0.45 : isTop ? 0.9 : 0.75,
        strokeColor: isSelected ? color : "#fff",
        strokeWeight: isSelected ? 3 : isTop ? 2 : 1,
        strokeOpacity: isSelected ? 1 : isTop ? 0.5 : 0.2,
      });
      if (isSelected && mapInstance.current) {
        mapInstance.current.panTo({ lat: n.lat, lng: n.lng });
      }
    });
  }, [selectedNeighborhood]);

  if (mapError) {
    return (
      <div style={{ position:"relative", border:`1px solid ${city.cardBorder}`, background:city.bg, height:"360px", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:"12px", color:city.textMuted, textAlign:"center" }}>Map unavailable</div>
      </div>
    );
  }

  return (
    <div style={{ position:"relative", border:`1px solid ${city.cardBorder}`, overflow:"hidden" }}>
      {/* Map label */}
      <div style={{ position:"absolute", top:"10px", left:"12px", fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:city.accentLight, opacity:0.6, fontFamily:city.bodyFont, zIndex:2, pointerEvents:"none" }}>
        {city.name} · Neighborhood Map
      </div>
      {/* Google Map */}
      <div ref={mapRef} style={{ width:"100%", height:"360px" }} />
      {/* Legend */}
      <div style={{ position:"absolute", bottom:"10px", right:"12px", background:`${city.bg}dd`, border:`1px solid ${city.cardBorder}`, padding:"8px 12px", backdropFilter:"blur(4px)", zIndex:2 }}>
        <div style={{ fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"6px", fontFamily:city.bodyFont }}>Match Rank</div>
        {[
          { color: city.accent, label: "#1 Best match", opacity: 0.9 },
          { color: city.accentLight, label: "Mid matches", opacity: 0.75 },
          { color: "#4a4a6a", label: "Least match", opacity: 0.5 },
        ].map(item => (
          <div key={item.label} style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"3px" }}>
            <div style={{ width:"9px", height:"9px", borderRadius:"50%", background:item.color, opacity:item.opacity, flexShrink:0 }} />
            <span style={{ fontSize:"10px", color:city.textMuted, fontFamily:city.bodyFont }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CITIES = [
  {
    id: "austin", name: "Austin", state: "TX", emoji: "🎸",
    accent: "#D95F2B", accentLight: "#F4A16A", bg: "#1C0F08", card: "#2B1810", cardBorder: "#4a2a1a",
    textPrimary: "#F7EDE2", textMuted: "rgba(247,237,226,0.55)",
    displayFont: "'Playfair Display', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Keep it weird. Keep it real.", vibe: "Creative & Electric",
    costIndex: "$$", climate: "Hot & Sunny", population: "978K",
    tags: ["music","tech","outdoors","food"],
    mapCenter: [30.2672, -97.7431],
    neighborhoods: [
      { name: "East Austin", vibe: "Artsy & social", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 2, remote: 3, transit: 3,
        desc: "East Austin is the creative soul of the city — a dense, walkable stretch where muralists and tech founders share the…",
        tags: ["nightlife","arts","walkable"], lat: 30.2627, lng: -97.7205 },
      { name: "South Congress", vibe: "Eclectic & walkable", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 3, remote: 4, transit: 3,
        desc: "South Congress (SoCo) is Austin's most iconic stretch — a mile-long boulevard of vintage shops, taco joints,…",
        tags: ["walkable","food","arts"], lat: 30.2426, lng: -97.7527 },
      { name: "Mueller", vibe: "Community & green", cost: "$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 4, transit: 3,
        desc: "Built on the former Austin airport, Mueller is a rare thing: a master-planned community that actually feels like a…",
        tags: ["family","outdoors","quiet"], lat: 30.2985, lng: -97.7085 },
      { name: "Hyde Park", vibe: "Historic & calm", cost: "$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "Austin's oldest suburb-turned-neighborhood, Hyde Park is all wide porches, century-old oaks, and the kind of quiet…",
        tags: ["quiet","historic","walkable"], lat: 30.3069, lng: -97.7361 },
      { name: "The Domain", vibe: "Upscale & convenient", cost: "$$$", pace: "Medium", outdoors: 2, nightlife: 3, family: 3, remote: 4, transit: 2,
        desc: "North Austin's answer to a walkable urban core. The Domain is a polished mixed-use district anchored by Apple,…",
        tags: ["upscale","tech","modern"], lat: 30.4025, lng: -97.7260 },
      { name: "Bouldin Creek", vibe: "Laid-back & artsy", cost: "$$", pace: "Slow", outdoors: 4, nightlife: 3, family: 4, remote: 5, transit: 3,
        desc: "South Austin's soul — a creek-cut neighborhood of bungalows, murals, and front-porch culture that defines everything people mean when they say 'old Austin.'…",
        tags: ["arts","outdoors","community"], lat: 30.2427, lng: -97.7567 },
      { name: "Rainey Street", vibe: "Social & walkable", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 1, remote: 3, transit: 3,
        desc: "A strip of converted bungalows turned craft cocktail bars — Rainey Street is Austin's most concentrated nightlife corridor, walkable from downtown and perpetually alive on weekends.…",
        tags: ["nightlife","walkable","upscale"], lat: 30.2582, lng: -97.7403 },
      { name: "Travis Heights", vibe: "Eclectic & residential", cost: "$$", pace: "Medium", outdoors: 4, nightlife: 2, family: 4, remote: 5, transit: 2,
        desc: "Perched above Barton Creek, Travis Heights is a hillside neighborhood of eccentric architecture, mature oaks, and a tight-knit community that genuinely knows its neighbors.…",
        tags: ["quiet","community","outdoors"], lat: 30.2434, lng: -97.7452 },
      { name: "Clarksville", vibe: "Historic & intimate", cost: "$$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "One of Austin's oldest neighborhoods — a tiny, deeply cherished enclave of Victorian cottages and massive live oaks just steps from downtown, with a community that fiercely protects its character.…",
        tags: ["historic","quiet","walkable"], lat: 30.2821, lng: -97.7537 },
    ],
    tips: [
      { category: "Food", icon: "🌮", tip: "Tacos are a breakfast religion. Franklin BBQ is worth the 2-hr wait — go on a weekday." },
      { category: "Culture", icon: "🎶", tip: "6th Street is tourist territory. Red River Cultural District is where locals go for live music." },
      { category: "Getting Around", icon: "🚗", tip: "You need a car. Capital Metro is improving but Austin is sprawling." },
    ],
    questions: [{ q: "Best neighborhoods for young professionals?", a: "East Austin and South Congress are buzzing — walkable, vibrant, pricey. Mueller is great for a quieter feel.", author: "Marco R.", time: "2 days ago" }],
  },
  {
    id: "boston", name: "Boston", state: "MA", emoji: "🦞",
    accent: "#9B1C2E", accentLight: "#D4687A", bg: "#0D0A0B", card: "#1A1114", cardBorder: "#3a1a22",
    textPrimary: "#F0EAE4", textMuted: "rgba(240,234,228,0.52)",
    displayFont: "'EB Garamond', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "History lives on every block.", vibe: "Stoic & Academic",
    costIndex: "$$$", climate: "Cold winters, brilliant fall", population: "675K",
    tags: ["history","academia","sports","food"],
    mapCenter: [42.3601, -71.0589],
    neighborhoods: [
      { name: "Beacon Hill", vibe: "Historic & refined", cost: "$$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 3, remote: 5, transit: 5,
        desc: "Beacon Hill is Boston frozen in amber — gas-lit cobblestone streets, brick Federal rowhouses, and window boxes…",
        tags: ["historic","quiet","walkable"], lat: 42.3588, lng: -71.0707 },
      { name: "South End", vibe: "Vibrant & diverse", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 3, remote: 4, transit: 5,
        desc: "Boston's most culinarily celebrated neighborhood — the South End is a Victorian brownstone grid packed with James…",
        tags: ["arts","food","walkable"], lat: 42.3434, lng: -71.0726 },
      { name: "Jamaica Plain", vibe: "Artsy & affordable", cost: "$$", pace: "Medium", outdoors: 5, nightlife: 3, family: 4, remote: 4, transit: 4,
        desc: "JP is Boston's best kept secret — a genuinely diverse, politically engaged neighborhood with a proud arts community,…",
        tags: ["outdoors","arts","community"], lat: 42.3100, lng: -71.1133 },
      { name: "Cambridge", vibe: "Academic & eclectic", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 5, transit: 5,
        desc: "Cambridge isn't really a neighborhood — it's a city unto itself, and one of the most intellectually charged zip…",
        tags: ["academia","walkable","tech"], lat: 42.3736, lng: -71.1097 },
      { name: "Fenway", vibe: "Lively & central", cost: "$$", pace: "Fast", outdoors: 2, nightlife: 4, family: 2, remote: 3, transit: 5,
        desc: "Fenway is young, loud, and wonderfully chaotic — anchored by the oldest ballpark in Major League Baseball and a…",
        tags: ["sports","nightlife","central"], lat: 42.3467, lng: -71.0972 },
      { name: "Somerville", vibe: "Young & scrappy", cost: "$$", pace: "Fast", outdoors: 3, nightlife: 4, family: 3, remote: 5, transit: 4,
        desc: "Once called 'Slummerville,' Somerville is now one of the most creative and energetic places in the Boston metro — dense, diverse, and home to Davis Square's excellent bar and restaurant scene.…",
        tags: ["arts","community","food"], lat: 42.3876, lng: -71.0995 },
      { name: "Charlestown", vibe: "Historic & polished", cost: "$$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 4, remote: 5, transit: 4,
        desc: "The Freedom Trail ends here, and history is genuinely underfoot — Charlestown is a neighborhood of cobblestones, the Bunker Hill Monument, and beautifully renovated brick townhomes.…",
        tags: ["historic","upscale","walkable"], lat: 42.3782, lng: -71.0602 },
      { name: "Back Bay", vibe: "Grand & walkable", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 3, remote: 4, transit: 5,
        desc: "Boston's most iconic residential address — Newbury Street boutiques, the Esplanade along the Charles, and a grid of Victorian brownstones that feels like a European city at its best.…",
        tags: ["upscale","walkable","food"], lat: 42.3503, lng: -71.0810 },
      { name: "Brookline", vibe: "Suburban & refined", cost: "$$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 5, remote: 5, transit: 4,
        desc: "A leafy, self-governing town inside the city — Brookline has some of the best public schools in Massachusetts, beautiful parks, and a calm that's genuinely hard to find this close to downtown.…",
        tags: ["family","quiet","walkable"], lat: 42.3318, lng: -71.1211 },
    ],
    tips: [
      { category: "Transit", icon: "🚇", tip: "Get a CharlieCard day one. Driving in Boston will age you rapidly." },
      { category: "Weather", icon: "🧥", tip: "Winters are serious. A proper wool coat is survival gear from November onward." },
      { category: "Food", icon: "🦞", tip: "Skip tourist lobster rolls. Neptune Oyster and Row 34 are the real deal." },
    ],
    questions: [{ q: "How do Bostonians feel about transplants?", a: "Reserved at first but deeply loyal once you're in. Don't fake a Sox fandom — they'll know.", author: "Eileen M.", time: "3 days ago" }],
  },
  {
    id: "seattle", name: "Seattle", state: "WA", emoji: "🌧️",
    accent: "#2E7D6B", accentLight: "#5DB8A4", bg: "#080E0D", card: "#0F1A18", cardBorder: "#1e3530",
    textPrimary: "#E8F0EE", textMuted: "rgba(232,240,238,0.52)",
    displayFont: "'DM Serif Display', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "The rain doesn't stop us. It defines us.", vibe: "Introspective & Innovative",
    costIndex: "$$$", climate: "Overcast & Lush", population: "749K",
    tags: ["tech","outdoors","coffee","arts"],
    mapCenter: [47.6062, -122.3321],
    neighborhoods: [
      { name: "Capitol Hill", vibe: "Vibrant & queer-friendly", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 2, remote: 4, transit: 4,
        desc: "Capitol Hill is the beating heart of Seattle's counterculture — a dense, walkable neighborhood that has championed…",
        tags: ["nightlife","arts","walkable"], lat: 47.6253, lng: -122.3222 },
      { name: "Fremont", vibe: "Quirky & community-driven", cost: "$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 3, remote: 5, transit: 3,
        desc: "Fremont declared itself the \"Center of the Universe\" in 1994 and has never backed down. It's home to a giant troll under a bridge, a Soviet-era Lenin statue, an 18-foot rocket ship, and some of the best Sunday markets in the Pacific Northwest. Underneath the whimsy is a genuinely close-knit community with great food and real character.",
        tags: ["arts","community","quirky"], lat: 47.6519, lng: -122.3500 },
      { name: "Ballard", vibe: "Relaxed & local", cost: "$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 4, remote: 4, transit: 3,
        desc: "Originally a fishing village settled by Scandinavian immigrants, Ballard has evolved into one of Seattle's most…",
        tags: ["food","outdoors","community"], lat: 47.6686, lng: -122.3831 },
      { name: "Queen Anne", vibe: "Elevated & family-friendly", cost: "$$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 4, transit: 3,
        desc: "Queen Anne sits on a hill above Seattle and feels like it knows it. The views of the Space Needle, Elliott Bay, and…",
        tags: ["family","outdoors","views"], lat: 47.6374, lng: -122.3569 },
      { name: "Columbia City", vibe: "Diverse & up-and-coming", cost: "$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 4, transit: 4,
        desc: "Columbia City is Seattle's most genuinely diverse neighborhood — a place where Ethiopian, Vietnamese, Mexican, and…",
        tags: ["community","food","affordable"], lat: 47.5598, lng: -122.2929 },
      { name: "Wallingford", vibe: "Cozy & connected", cost: "$$", pace: "Medium", outdoors: 4, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "Seattle's most underrated neighborhood — Wallingford is centrally located, walkable, full of good restaurants and coffee shops, and has none of the pretension of Capitol Hill.…",
        tags: ["community","family","quiet"], lat: 47.6607, lng: -122.3358 },
      { name: "West Seattle", vibe: "Beachy & self-sufficient", cost: "$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 4, transit: 2,
        desc: "Across the West Seattle Bridge, the peninsula has its own beach town identity — Alki Beach, sweeping views of downtown and the Olympics, and a community that rarely needs to leave.…",
        tags: ["outdoors","family","community"], lat: 47.5630, lng: -122.3868 },
      { name: "South Lake Union", vibe: "Tech-forward & modern", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 3, family: 2, remote: 3, transit: 5,
        desc: "Amazon's backyard — South Lake Union is Seattle's most rapidly transformed neighborhood, a former industrial wasteland now full of glass towers, tech campuses, and rooftop bars.…",
        tags: ["tech","walkable","upscale"], lat: 47.6256, lng: -122.3356 },
      { name: "Beacon Hill", vibe: "Diverse & underrated", cost: "$", pace: "Medium", outdoors: 3, nightlife: 2, family: 4, remote: 4, transit: 5,
        desc: "One of Seattle's most genuinely diverse neighborhoods with excellent light rail access — Beacon Hill has a strong community identity, great Vietnamese and Latino food, and real affordability.…",
        tags: ["community","affordable","food"], lat: 47.5714, lng: -122.3105 },
    ],
    tips: [
      { category: "Coffee", icon: "☕", tip: "Skip Starbucks — explore Victrola, Lighthouse, or Caffe Vita instead." },
      { category: "Weather", icon: "🌧️", tip: "A good waterproof jacket matters more than an umbrella. Locals don't carry umbrellas." },
      { category: "Community", icon: "🤝", tip: "Seattle Freeze is real. Join a climbing gym or hiking club to break through it." },
    ],
    questions: [{ q: "What's the Seattle Freeze and how do I beat it?", a: "Join clubs, say yes to everything for 3 months, and it cracks open.", author: "Nadia K.", time: "1 day ago" }],
  },
  {
    id: "chicago", name: "Chicago", state: "IL", emoji: "🌬️",
    accent: "#C49A2A", accentLight: "#E8C96A", bg: "#080A0F", card: "#10131C", cardBorder: "#252d45",
    textPrimary: "#EEF0F5", textMuted: "rgba(238,240,245,0.52)",
    displayFont: "'Libre Baskerville', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Gritty, gorgeous, and fiercely itself.", vibe: "Proud & Architectural",
    costIndex: "$$", climate: "Brutal winters, perfect summers", population: "2.7M",
    tags: ["architecture","food","arts","sports"],
    mapCenter: [41.8781, -87.6298],
    neighborhoods: [
      { name: "Logan Square", vibe: "Creative & evolving", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 3, remote: 5, transit: 4,
        desc: "Logan Square is Chicago's creative nerve center — a neighborhood of wide boulevards, 100-year-old greystone…",
        tags: ["arts","nightlife","community"], lat: 41.9217, lng: -87.7045 },
      { name: "Wicker Park", vibe: "Hip & established", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 2, remote: 4, transit: 4,
        desc: "Wicker Park is Chicago's version of Brooklyn's Williamsburg — once edgy, now expensive, but still genuinely cool.…",
        tags: ["nightlife","food","arts"], lat: 41.9088, lng: -87.6803 },
      { name: "Lincoln Park", vibe: "Polished & park-side", cost: "$$$", pace: "Medium", outdoors: 5, nightlife: 3, family: 5, remote: 4, transit: 4,
        desc: "Lincoln Park is Chicago at its most polished — beautiful greystones and townhomes lining streets that give way to…",
        tags: ["outdoors","family","upscale"], lat: 41.9241, lng: -87.6444 },
      { name: "Hyde Park", vibe: "Intellectual & historic", cost: "$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "Hyde Park is a neighborhood of ideas — home to the University of Chicago, the Obama Presidential Center, and one of…",
        tags: ["academia","historic","community"], lat: 41.7943, lng: -87.5907 },
      { name: "Pilsen", vibe: "Cultural & affordable", cost: "$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 4, transit: 3,
        desc: "Pilsen is one of the most visually stunning neighborhoods in Chicago — every building, underpass, and alley is a…",
        tags: ["arts","food","affordable"], lat: 41.8557, lng: -87.6615 },
      { name: "Andersonville", vibe: "Quirky & welcoming", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 3, family: 4, remote: 5, transit: 4,
        desc: "Chicago's most welcoming neighborhood — a Swedish-heritage corridor turned LGBTQ+ and family-friendly haven, with some of the city's best independent bookstores, restaurants, and coffee shops.…",
        tags: ["community","arts","food"], lat: 41.9817, lng: -87.6681 },
      { name: "Bucktown", vibe: "Polished & residential", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 5, transit: 4,
        desc: "Wicker Park's quieter sibling — Bucktown has the same great restaurants and boutiques but more families, more strollers, and slightly more breathing room on the streets.…",
        tags: ["food","community","upscale"], lat: 41.9198, lng: -87.6849 },
      { name: "Ravenswood", vibe: "Established & artistic", cost: "$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 5, remote: 5, transit: 4,
        desc: "A long industrial corridor turned thriving arts district — Ravenswood has working studios, great architecture, top-rated schools, and a deeply rooted community that's been here for generations.…",
        tags: ["arts","family","community"], lat: 41.9771, lng: -87.6739 },
      { name: "Ukrainian Village", vibe: "Artsy & underrated", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 4, family: 3, remote: 5, transit: 4,
        desc: "One of Chicago's most authentic neighborhoods — Ukrainian Village has stunning historic churches, gritty bars, excellent new restaurants, and a creative energy that hasn't yet been priced out.…",
        tags: ["arts","community","historic"], lat: 41.8939, lng: -87.6820 },
    ],
    tips: [
      { category: "Transit", icon: "🚇", tip: "Get a Ventra card day one. Driving downtown is a special kind of punishment." },
      { category: "Weather", icon: "🧥", tip: "Invest in a real parka — not a fashion one. Layering is a lifestyle." },
      { category: "Food", icon: "🍕", tip: "Deep dish is a special occasion. Real Chicagoans eat thin crust tavern-style." },
    ],
    questions: [{ q: "Best neighborhoods to start in as a newcomer?", a: "Logan Square for creative vibes. Lincoln Park if you want polished. Pilsen for culture and value.", author: "Tom N.", time: "2 weeks ago" }],
  },
  {
    id: "denver", name: "Denver", state: "CO", emoji: "🏔️",
    accent: "#5B8DB8", accentLight: "#8DBFE0", bg: "#080D14", card: "#0F1820", cardBorder: "#1e3050",
    textPrimary: "#E8F0F8", textMuted: "rgba(232,240,248,0.52)",
    displayFont: "'DM Serif Display', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Mile high and just getting started.", vibe: "Outdoorsy & Ambitious",
    costIndex: "$$", climate: "300 days of sunshine", population: "715K",
    tags: ["outdoors","tech","food","sports"],
    mapCenter: [39.7392, -104.9903],
    neighborhoods: [
      { name: "RiNo", vibe: "Artsy & trendy", cost: "$$$", pace: "Fast", outdoors: 3, nightlife: 5, family: 2, remote: 4, transit: 3,
        desc: "River North is Denver's creative explosion — a former industrial district now covered in murals, packed with breweries, galleries, and the city's best restaurants.",
        tags: ["arts","nightlife","walkable"], lat: 39.7716, lng: -104.9739 },
      { name: "Capitol Hill", vibe: "Eclectic & diverse", cost: "$$", pace: "Fast", outdoors: 2, nightlife: 4, family: 2, remote: 4, transit: 4,
        desc: "Denver's most densely populated and diverse neighborhood — Victorian mansions sit next to punk bars and vintage shops on a walkable, electric grid.",
        tags: ["nightlife","arts","walkable"], lat: 39.7322, lng: -104.9771 },
      { name: "Washington Park", vibe: "Active & family-friendly", cost: "$$$", pace: "Medium", outdoors: 5, nightlife: 2, family: 5, remote: 4, transit: 2,
        desc: "Wash Park is Denver's most beloved neighborhood — anchored by a stunning 165-acre park with two lakes, tennis courts, and the city's best jogging paths.",
        tags: ["outdoors","family","community"], lat: 39.7085, lng: -104.9617 },
      { name: "Highland", vibe: "Polished & social", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 3, remote: 4, transit: 3,
        desc: "LoHi (Lower Highland) is Denver's foodie capital — a hilly neighborhood just northwest of downtown with sweeping city views and some of the best restaurants in the state.",
        tags: ["food","nightlife","upscale"], lat: 39.7578, lng: -105.0083 },
      { name: "Five Points", vibe: "Historic & evolving", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 4, family: 3, remote: 4, transit: 4,
        desc: "Once called the 'Harlem of the West,' Five Points is Denver's historically Black cultural heart — now resurging with jazz history, new restaurants, and community energy.",
        tags: ["arts","community","historic"], lat: 39.7587, lng: -104.9711 },
      { name: "LoDo", vibe: "Urban core & lively", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 2, remote: 4, transit: 5,
        desc: "Denver's most walkable neighborhood — Lower Downtown is anchored by Union Station, Coors Field, and some of the city's best bars and restaurants in beautifully restored 19th-century brick warehouses.…",
        tags: ["nightlife","walkable","upscale"], lat: 39.7545, lng: -104.9998 },
      { name: "Cherry Creek", vibe: "Affluent & polished", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 4, remote: 4, transit: 3,
        desc: "Denver's upscale address — Cherry Creek is known for its trail along the creek, upscale shopping district, and a dense collection of great restaurants that attract the city's professionals and families.…",
        tags: ["upscale","outdoors","food"], lat: 39.7161, lng: -104.9522 },
      { name: "Baker", vibe: "Vintage & creative", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 4, family: 2, remote: 5, transit: 4,
        desc: "South Broadway is Denver's antique row meets cocktail bar corridor — Baker is where young creatives and design-minded residents landed after RiNo got too expensive, and it's better for it.…",
        tags: ["arts","nightlife","affordable"], lat: 39.7057, lng: -104.9802 },
      { name: "Congress Park", vibe: "Quiet & central", cost: "$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "Denver's best-kept secret for remote workers and families — Congress Park is a tree-canopied residential neighborhood wrapped around Cheesman Park, with great coffee shops and genuine quiet.…",
        tags: ["outdoors","family","quiet"], lat: 39.7244, lng: -104.9606 },
    ],
    tips: [
      { category: "Altitude", icon: "🏔️", tip: "You're at 5,280 feet. Drink more water than you think, go easy on alcohol your first week." },
      { category: "Outdoors", icon: "🎿", tip: "A ski pass is a lifestyle investment here. Ikon or Epic pass gets you to the mountains in 90 min." },
      { category: "Getting Around", icon: "🚗", tip: "The RTD light rail is solid downtown but you'll want a car for mountain access." },
    ],
    questions: [{ q: "Is Denver worth it despite rising costs?", a: "For outdoor lifestyle, still yes. Prices have risen sharply but salaries have too. Pick the right neighborhood.", author: "Jake M.", time: "1 week ago" }],
  },
  {
    id: "nashville", name: "Nashville", state: "TN", emoji: "🎸",
    accent: "#C4872A", accentLight: "#E8B86D", bg: "#110C04", card: "#1E1508", cardBorder: "#3d2a10",
    textPrimary: "#F5EDD8", textMuted: "rgba(245,237,216,0.52)",
    displayFont: "'Playfair Display', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Music City never stops playing.", vibe: "Soulful & Explosive",
    costIndex: "$$", climate: "Mild & humid", population: "689K",
    tags: ["music","food","nightlife","growth"],
    mapCenter: [36.1627, -86.7816],
    neighborhoods: [
      { name: "East Nashville", vibe: "Creative & cool", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 3, remote: 5, transit: 2,
        desc: "East Nashville is what the city looked like before the bachelorette parties took over — genuine, creative, and home to Nashville's best independent restaurants and musicians.",
        tags: ["arts","food","community"], lat: 36.1748, lng: -86.7441 },
      { name: "The Gulch", vibe: "Upscale & modern", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 4, family: 2, remote: 4, transit: 3,
        desc: "The Gulch is Nashville's sleekest neighborhood — a LEED-certified walkable district with luxury towers, rooftop bars, and some of the best brunches in the city.",
        tags: ["upscale","nightlife","walkable"], lat: 36.1498, lng: -86.7892 },
      { name: "12 South", vibe: "Charming & walkable", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 4, transit: 2,
        desc: "Nashville's most photogenic neighborhood — a tree-lined street of boutiques, coffee shops, and restaurants that feels genuinely neighborly despite its Instagram fame.",
        tags: ["walkable","food","community"], lat: 36.1312, lng: -86.7924 },
      { name: "Germantown", vibe: "Historic & refined", cost: "$$$", pace: "Slow", outdoors: 2, nightlife: 3, family: 3, remote: 5, transit: 3,
        desc: "Nashville's oldest neighborhood — Germantown is a collection of beautifully restored Victorian homes turned boutique hotels, acclaimed restaurants, and quiet cobblestone streets.",
        tags: ["historic","food","quiet"], lat: 36.1759, lng: -86.7897 },
      { name: "Sylvan Park", vibe: "Residential & relaxed", cost: "$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "The city's best-kept secret for families — Sylvan Park is a tight-knit community of bungalows, great schools, and dog-friendly parks without the downtown chaos.",
        tags: ["family","quiet","community"], lat: 36.1523, lng: -86.8289 },
      { name: "Midtown", vibe: "Young & energetic", cost: "$$", pace: "Fast", outdoors: 2, nightlife: 4, family: 2, remote: 4, transit: 3,
        desc: "Nashville's most walkable stretch outside downtown — anchored by Vanderbilt and Belmont universities, Midtown has great bars, restaurants, and the kind of perpetual energy that young professionals gravitate toward.…",
        tags: ["nightlife","walkable","community"], lat: 36.1486, lng: -86.8010 },
      { name: "Wedgewood-Houston", vibe: "Emerging arts district", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 3, family: 2, remote: 5, transit: 2,
        desc: "Nashville's answer to East Nashville five years ago — WeHo is an industrial neighborhood being transformed by artist studios, galleries, and a craft cocktail scene that hasn't been discovered by tourists yet.…",
        tags: ["arts","community","affordable"], lat: 36.1402, lng: -86.7728 },
      { name: "Green Hills", vibe: "Affluent & suburban", cost: "$$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "Nashville's most established family enclave — Green Hills has excellent public and private schools, upscale shopping at The Mall at Green Hills, and a quiet, tree-lined residential character.…",
        tags: ["family","upscale","quiet"], lat: 36.1057, lng: -86.8191 },
      { name: "North Nashville", vibe: "Historic & resurgent", cost: "$", pace: "Medium", outdoors: 2, nightlife: 3, family: 3, remote: 4, transit: 3,
        desc: "The historically Black heart of Nashville — home to Fisk University, Tennessee State, and a deep musical legacy, North Nashville is in the middle of a genuine renaissance driven by community pride.…",
        tags: ["historic","community","affordable"], lat: 36.1855, lng: -86.7990 },
    ],
    tips: [
      { category: "Music", icon: "🎵", tip: "Broadway honky-tonks are for tourists. Bluebird Cafe and Station Inn are where the real talent plays." },
      { category: "Getting Around", icon: "🚗", tip: "Nashville has almost no public transit. A car is non-negotiable." },
      { category: "Growth", icon: "📈", tip: "The city is growing fast — traffic is real. Pick your neighborhood carefully relative to your job." },
    ],
    questions: [{ q: "Is Nashville just a party city or is there real community?", a: "Totally depends on the neighborhood. East Nashville and Sylvan Park feel nothing like Broadway.", author: "Claire B.", time: "4 days ago" }],
  },
  {
    id: "miami", name: "Miami", state: "FL", emoji: "🌴",
    accent: "#E05A8A", accentLight: "#F09AB8", bg: "#0D0810", card: "#18101A", cardBorder: "#3a1e35",
    textPrimary: "#F8EEF4", textMuted: "rgba(248,238,244,0.52)",
    displayFont: "'EB Garamond', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Where the ocean meets ambition.", vibe: "Electric & International",
    costIndex: "$$$", climate: "Hot & tropical year-round", population: "442K",
    tags: ["beach","nightlife","food","international"],
    mapCenter: [25.7617, -80.1918],
    neighborhoods: [
      { name: "Wynwood", vibe: "Artsy & electric", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 2, remote: 4, transit: 2,
        desc: "Wynwood is Miami's open-air art museum — a former warehouse district transformed into the world's largest outdoor mural installation, packed with galleries, bars, and restaurants.",
        tags: ["arts","nightlife","walkable"], lat: 25.8008, lng: -80.1993 },
      { name: "Brickell", vibe: "Sleek & financial", cost: "$$$", pace: "Fast", outdoors: 2, nightlife: 4, family: 2, remote: 4, transit: 4,
        desc: "Miami's Manhattan — a dense corridor of glass towers, finance firms, and rooftop bars. The most walkable and transit-friendly part of Miami.",
        tags: ["upscale","nightlife","walkable"], lat: 25.7584, lng: -80.1936 },
      { name: "Coconut Grove", vibe: "Lush & laid-back", cost: "$$$", pace: "Slow", outdoors: 5, nightlife: 3, family: 4, remote: 4, transit: 2,
        desc: "Miami's oldest neighborhood feels like a bohemian village — shaded by a canopy of banyan trees, dotted with marinas, and home to a surprisingly calm, community-focused vibe.",
        tags: ["outdoors","community","quiet"], lat: 25.7274, lng: -80.2381 },
      { name: "Little Havana", vibe: "Cultural & vibrant", cost: "$", pace: "Medium", outdoors: 2, nightlife: 3, family: 4, remote: 3, transit: 3,
        desc: "The soul of Miami's Cuban community — Calle Ocho is alive with domino parks, cigar rollers, excellent Cuban food, and a cultural richness found nowhere else in the US.",
        tags: ["community","food","arts"], lat: 25.7680, lng: -80.2280 },
      { name: "South Beach", vibe: "Glamorous & touristy", cost: "$$$", pace: "Fast", outdoors: 5, nightlife: 5, family: 1, remote: 2, transit: 3,
        desc: "Art Deco architecture, white sand, and neon nights — South Beach is exactly what you've seen in movies. Living here means choosing the show over the quiet.",
        tags: ["nightlife","beach","arts"], lat: 25.7826, lng: -80.1340 },
      { name: "Coral Gables", vibe: "Mediterranean & refined", cost: "$$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "Miami's most beautiful suburb — Coral Gables is a planned city of Mediterranean Revival architecture, canopied banyan streets, the Venetian Pool, and some of the best schools in South Florida.…",
        tags: ["upscale","family","historic"], lat: 25.7217, lng: -80.2684 },
      { name: "Edgewater", vibe: "Waterfront & evolving", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 3, remote: 4, transit: 3,
        desc: "Squeezed between Wynwood and downtown on Biscayne Bay, Edgewater is Miami's fastest-improving neighborhood — new waterfront towers, gallery spaces, and a walkable bayfront park.…",
        tags: ["arts","walkable","community"], lat: 25.7929, lng: -80.1919 },
      { name: "Design District", vibe: "Luxury & curated", cost: "$$$", pace: "Medium", outdoors: 2, nightlife: 3, family: 2, remote: 3, transit: 2,
        desc: "Miami's answer to SoHo — a curated grid of luxury flagship stores, architecture galleries, and outdoor dining that's more neighborhood than shopping mall, with genuine style.…",
        tags: ["arts","upscale","walkable"], lat: 25.8135, lng: -80.1944 },
      { name: "Allapattah", vibe: "Authentic & affordable", cost: "$", pace: "Medium", outdoors: 2, nightlife: 2, family: 4, remote: 4, transit: 3,
        desc: "Miami's most authentic neighborhood and best-kept secret — Allapattah has incredible Dominican, Haitian, and Central American food, the Rubell Museum, and rents that remind you this city isn't entirely unaffordable.…",
        tags: ["community","affordable","food"], lat: 25.7992, lng: -80.2298 },
    ],
    tips: [
      { category: "Heat", icon: "☀️", tip: "June–September is brutal. AC is not optional, it's infrastructure." },
      { category: "Traffic", icon: "🚗", tip: "I-95 is a parking lot at rush hour. Build your commute around it or go car-free in Brickell." },
      { category: "Culture", icon: "🌍", tip: "Spanish is genuinely useful here — about 70% of Miami speaks it as a first language." },
    ],
    questions: [{ q: "Can you actually afford to live in Miami right now?", a: "Getting harder. Look at Little Havana, Allapattah, or Little River for relative value.", author: "Sofia R.", time: "3 days ago" }],
  },
  {
    id: "nyc", name: "New York City", state: "NY", emoji: "🗽",
    accent: "#E8C840", accentLight: "#F5E27A", bg: "#080808", card: "#111111", cardBorder: "#2a2a2a",
    textPrimary: "#F5F5F0", textMuted: "rgba(245,245,240,0.52)",
    displayFont: "'Libre Baskerville', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "If you can make it here, you can make it anywhere.", vibe: "Relentless & Iconic",
    costIndex: "$$$", climate: "Four true seasons", population: "8.3M",
    tags: ["culture","food","nightlife","career"],
    mapCenter: [40.7128, -74.0060],
    neighborhoods: [
      { name: "Astoria", vibe: "Diverse & accessible", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 4, transit: 5,
        desc: "Queens' most beloved neighborhood — Astoria is where NYC actually lives. Incredible Greek food, a genuinely international mix of residents, and a subway ride from everything.",
        tags: ["food","community","affordable"], lat: 40.7721, lng: -73.9303 },
      { name: "Bushwick", vibe: "Creative & gritty", cost: "$$", pace: "Fast", outdoors: 2, nightlife: 5, family: 2, remote: 4, transit: 4,
        desc: "Brooklyn's art and party capital — Bushwick is where artists, musicians, and young creatives land when Manhattan prices push them out. Raw, alive, and constantly evolving.",
        tags: ["arts","nightlife","community"], lat: 40.6944, lng: -73.9213 },
      { name: "Park Slope", vibe: "Polished & family", cost: "$$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 5, transit: 4,
        desc: "Brooklyn's most family-oriented neighborhood — beautifully maintained brownstones, Prospect Park at your doorstep, and some of the best schools in the borough.",
        tags: ["family","outdoors","upscale"], lat: 40.6681, lng: -73.9803 },
      { name: "Harlem", vibe: "Historic & evolving", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 4, remote: 4, transit: 5,
        desc: "Harlem is NYC history made physical — the Apollo, Marcus Garvey Park, soul food institutions, and a neighborhood in the middle of a major renaissance with Central Park at its edge.",
        tags: ["historic","arts","community"], lat: 40.8116, lng: -73.9465 },
      { name: "Williamsburg", vibe: "Trendy & social", cost: "$$$", pace: "Fast", outdoors: 3, nightlife: 5, family: 2, remote: 4, transit: 4,
        desc: "The original gentrification case study — Williamsburg is still one of Brooklyn's most electric neighborhoods. Waterfront views, incredible food, and the L train to Manhattan.",
        tags: ["nightlife","food","arts"], lat: 40.7081, lng: -73.9571 },
      { name: "Crown Heights", vibe: "Diverse & vibrant", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 4, transit: 4,
        desc: "One of Brooklyn's most genuinely diverse neighborhoods — Crown Heights has beautiful brownstones, a strong Caribbean community, excellent food, and subway access that makes Manhattan easy.…",
        tags: ["community","arts","affordable"], lat: 40.6694, lng: -73.9442 },
      { name: "Jackson Heights", vibe: "Incredibly diverse & flavorful", cost: "$", pace: "Medium", outdoors: 2, nightlife: 3, family: 4, remote: 4, transit: 5,
        desc: "Possibly the most diverse neighborhood in the world — Jackson Heights has incredible food from across South Asia, Latin America, and East Asia, all within a walkable Queens grid with great subway access.…",
        tags: ["food","community","affordable"], lat: 40.7557, lng: -73.8827 },
      { name: "Fort Greene", vibe: "Artistic & elevated", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 4, remote: 5, transit: 5,
        desc: "Brooklyn at its most refined — Fort Greene has stunning brownstone blocks, Fort Greene Park, the Brooklyn Academy of Music, and a creative class that's been quietly rooted here for decades.…",
        tags: ["arts","historic","walkable"], lat: 40.6878, lng: -73.9745 },
      { name: "Upper West Side", vibe: "Classic NYC & refined", cost: "$$$", pace: "Medium", outdoors: 5, nightlife: 2, family: 5, remote: 5, transit: 5,
        desc: "The quintessential New York intellectual neighborhood — Riverside Park, Central Park, Columbia University, the Natural History Museum, and pre-war apartments that feel like they were built for the city's best readers.…",
        tags: ["family","outdoors","upscale"], lat: 40.7870, lng: -73.9754 },
    ],
    tips: [
      { category: "Transit", icon: "🚇", tip: "Get a MetroCard or tap your card. Walking + subway is the best way to live here — skip the car." },
      { category: "Cost", icon: "💰", tip: "Budget for broker fees when apartment hunting — usually one month's rent. It's brutal but expected." },
      { category: "Community", icon: "🤝", tip: "NYC can feel lonely at first. Find your block, your coffee shop, your regular spot — it opens up fast." },
    ],
    questions: [{ q: "Is NYC actually worth the cost in 2025?", a: "For career acceleration and culture, still unmatched. Quality of life depends entirely on your borough and block.", author: "Marcus T.", time: "2 days ago" }],
  },
  {
    id: "la", name: "Los Angeles", state: "CA", emoji: "🎬",
    accent: "#D4762A", accentLight: "#EEA96A", bg: "#0F0A06", card: "#1A1108", cardBorder: "#3a2510",
    textPrimary: "#F5EDE0", textMuted: "rgba(245,237,224,0.52)",
    displayFont: "'Playfair Display', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Every stranger is a story waiting to happen.", vibe: "Sprawling & Dreamy",
    costIndex: "$$$", climate: "Sunny & perfect almost always", population: "3.9M",
    tags: ["entertainment","food","outdoors","beach"],
    mapCenter: [34.0522, -118.2437],
    neighborhoods: [
      { name: "Silver Lake", vibe: "Creative & laid-back", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 3, remote: 5, transit: 2,
        desc: "LA's creative heartbeat — Silver Lake is where musicians, designers, and writers settled when Echo Park got too expensive. Walkable (for LA), beautiful, and full of character.",
        tags: ["arts","community","food"], lat: 34.0869, lng: -118.2706 },
      { name: "Venice", vibe: "Beach & bohemian", cost: "$$$", pace: "Medium", outdoors: 5, nightlife: 3, family: 3, remote: 4, transit: 2,
        desc: "Ocean Front Walk, Abbot Kinney boutiques, and a boardwalk circus that never sleeps. Venice is LA's most distinctive neighborhood — weird, expensive, and addictive.",
        tags: ["beach","arts","community"], lat: 33.9850, lng: -118.4695 },
      { name: "Los Feliz", vibe: "Intellectual & charming", cost: "$$$", pace: "Slow", outdoors: 4, nightlife: 3, family: 4, remote: 5, transit: 2,
        desc: "Griffith Park, beautiful pre-war architecture, and a walkable village feel rare in LA. Los Feliz is where the city's writers and academics quietly set down roots.",
        tags: ["outdoors","quiet","arts"], lat: 34.1081, lng: -118.2904 },
      { name: "Koreatown", vibe: "Dense & 24/7", cost: "$$", pace: "Fast", outdoors: 1, nightlife: 5, family: 2, remote: 3, transit: 4,
        desc: "The most walkable and transit-connected neighborhood in LA — Koreatown is dense, alive at all hours, and home to the city's best Korean BBQ and karaoke scene.",
        tags: ["nightlife","food","walkable"], lat: 34.0584, lng: -118.2999 },
      { name: "Eagle Rock", vibe: "Neighborly & up-and-coming", cost: "$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "Eagle Rock feels like a small town inside a massive city — tight community, great independent coffee shops, and a slower pace that LA transplants fall hard for.",
        tags: ["family","community","quiet"], lat: 34.1397, lng: -118.2088 },
      { name: "Highland Park", vibe: "Artsy & independent", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 5, transit: 3,
        desc: "Northeast LA's creative wave — Highland Park has Figueroa Street's excellent independent restaurants and bars, a strong Latino heritage, and the kind of authentic character that Silver Lake had before Silver Lake got expensive.…",
        tags: ["arts","food","community"], lat: 34.1089, lng: -118.1909 },
      { name: "Culver City", vibe: "Creative & walkable", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 4, remote: 5, transit: 3,
        desc: "LA's most surprising walkable neighborhood — Culver City has an actual downtown, excellent restaurants, film and tech studios, the Expo Line to downtown, and a genuine community feel rare in this city.…",
        tags: ["arts","walkable","tech"], lat: 34.0211, lng: -118.3965 },
      { name: "Atwater Village", vibe: "Intimate & creative", cost: "$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 4, remote: 5, transit: 2,
        desc: "The smallest of the eastside creative neighborhoods — Atwater Village sits along the LA River with a handful of excellent restaurants, studios, and the kind of low-key community that's genuinely hard to find in LA.…",
        tags: ["community","arts","quiet"], lat: 34.1152, lng: -118.2247 },
      { name: "Pasadena", vibe: "Historic & polished", cost: "$$$", pace: "Slow", outdoors: 4, nightlife: 2, family: 5, remote: 5, transit: 3,
        desc: "The Rose Bowl, Old Town's walkable shopping street, beautiful Craftsman homes, and CalTech — Pasadena is a genuine city within the metro, refined and self-contained in ways that most of LA isn't.…",
        tags: ["historic","family","upscale"], lat: 34.1478, lng: -118.1445 },
    ],
    tips: [
      { category: "Traffic", icon: "🚗", tip: "The 405 will humble you. Learn your alternate routes, work from home when possible, and budget 2x commute time." },
      { category: "Outdoors", icon: "🏄", tip: "The beach, the mountains, the desert — all within 90 minutes. This is the whole point of LA." },
      { category: "Social", icon: "🤝", tip: "LA doesn't come to you. Join things, say yes to invites, and give it 6 months before judging it." },
    ],
    questions: [{ q: "Is the LA lifestyle worth the cost and traffic?", a: "If you're outdoors-driven and career-focused in entertainment/tech/creative — still yes. Otherwise think hard.", author: "Priya N.", time: "5 days ago" }],
  },
  {
    id: "portland", name: "Portland", state: "OR", emoji: "🌲",
    accent: "#5E9E6A", accentLight: "#94C99E", bg: "#070D09", card: "#0E1810", cardBorder: "#1e3522",
    textPrimary: "#E4F0E6", textMuted: "rgba(228,240,230,0.52)",
    displayFont: "'DM Serif Display', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Keep Portland weird — we mean it.", vibe: "Independent & Green",
    costIndex: "$$", climate: "Lush, rainy, mild", population: "652K",
    tags: ["outdoors","food","arts","community"],
    mapCenter: [45.5051, -122.6750],
    neighborhoods: [
      { name: "Alberta Arts District", vibe: "Artsy & welcoming", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 3, remote: 5, transit: 3,
        desc: "Northeast Portland's creative corridor — Alberta Street is lined with galleries, murals, independent restaurants, and the kind of block-by-block character that cities try and fail to manufacture.",
        tags: ["arts","community","food"], lat: 45.5601, lng: -122.6475 },
      { name: "Pearl District", vibe: "Polished & walkable", cost: "$$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 3, remote: 4, transit: 5,
        desc: "Portland's most upscale neighborhood — converted warehouses now hold luxury condos, Powell's Books, brewpubs, and galleries on a beautifully walkable grid.",
        tags: ["walkable","upscale","arts"], lat: 45.5259, lng: -122.6832 },
      { name: "Hawthorne", vibe: "Bohemian & diverse", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 3, family: 3, remote: 5, transit: 3,
        desc: "Portland's original weird street — vintage shops, bookstores, vegetarian restaurants, and a street culture that's been authentically alternative since the 1990s.",
        tags: ["arts","community","walkable"], lat: 45.5120, lng: -122.6323 },
      { name: "Division Street", vibe: "Foodie & evolving", cost: "$$", pace: "Medium", outdoors: 3, nightlife: 4, family: 3, remote: 4, transit: 3,
        desc: "Portland's best restaurant row — SE Division has become nationally recognized for its dining scene while remaining genuinely neighborhood-focused and accessible.",
        tags: ["food","community","arts"], lat: 45.5040, lng: -122.6360 },
      { name: "St. Johns", vibe: "Quirky & affordable", cost: "$", pace: "Slow", outdoors: 4, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "The most underrated neighborhood in Portland — St. Johns is a small-town main street at the tip of a peninsula, with the stunning Cathedral Park under the St. Johns Bridge.",
        tags: ["affordable","community","outdoors"], lat: 45.5938, lng: -122.7534 },
      { name: "Mississippi Ave", vibe: "Hip & community-focused", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 3, family: 3, remote: 5, transit: 3,
        desc: "North Portland's creative spine — Mississippi Avenue is lined with independent restaurants, murals, and locally-owned shops that feel like Portland before it got discovered, somehow still surviving.…",
        tags: ["arts","food","community"], lat: 45.5501, lng: -122.6793 },
      { name: "Sellwood", vibe: "Small-town charming", cost: "$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "Portland's most idyllic neighborhood — Sellwood sits on a bluff above the Willamette River with antique shops, excellent brunch spots, river access, and a pace of life that feels genuinely restorative.…",
        tags: ["quiet","outdoors","family"], lat: 45.4729, lng: -122.6585 },
      { name: "Northwest District", vibe: "Upscale & European-feel", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 3, remote: 4, transit: 4,
        desc: "Portland's most walkable and polished neighborhood — NW 23rd Avenue has a European café culture feel, excellent independent restaurants, and Forest Park's 5,000 acres of trails starting at the doorstep.…",
        tags: ["walkable","upscale","food"], lat: 45.5310, lng: -122.6986 },
      { name: "Montavilla", vibe: "Affordable & authentic", cost: "$", pace: "Medium", outdoors: 3, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "East Portland's genuine community neighborhood — Montavilla has a strong block association, independent shops on 82nd Ave, and the kind of authentic neighborhood character that gentrification hasn't yet reached.…",
        tags: ["community","affordable","arts"], lat: 45.5128, lng: -122.5811 },
    ],
    tips: [
      { category: "Rain", icon: "🌧️", tip: "A quality rain jacket is essential — not an umbrella. You'll get laughed at for the umbrella." },
      { category: "Food", icon: "🍕", tip: "Portland's food cart scene is world-class. Cartopia and Hawthorne Asylum are musts." },
      { category: "Outdoors", icon: "🌲", tip: "Mt Hood is 90 minutes away. Columbia River Gorge is 30. This is the whole sell." },
    ],
    questions: [{ q: "Is Portland recovering and worth moving to?", a: "The core neighborhoods are vibrant — Alberta, Pearl, Hawthorne all feel strong. Give it a fair look.", author: "Reed H.", time: "1 week ago" }],
  },
  {
    id: "phoenix", name: "Phoenix", state: "AZ", emoji: "☀️",
    accent: "#E07830", accentLight: "#F0A870", bg: "#100808", card: "#1C1008", cardBorder: "#3a2010",
    textPrimary: "#F8EEE0", textMuted: "rgba(248,238,224,0.52)",
    displayFont: "'Libre Baskerville', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "Sun-drenched and endlessly expanding.", vibe: "Sunny & Sprawling",
    costIndex: "$", climate: "Hot desert — seriously hot", population: "1.6M",
    tags: ["outdoors","affordable","growth","sports"],
    mapCenter: [33.4484, -112.0740],
    neighborhoods: [
      { name: "Roosevelt Row", vibe: "Artsy & walkable", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 4, family: 2, remote: 5, transit: 3,
        desc: "Phoenix's arts district — Roosevelt Row is the most walkable, creative block in the city with murals, galleries, and the best bar scene in downtown Phoenix.",
        tags: ["arts","nightlife","walkable"], lat: 33.4597, lng: -112.0668 },
      { name: "Scottsdale Old Town", vibe: "Upscale & social", cost: "$$$", pace: "Fast", outdoors: 3, nightlife: 5, family: 2, remote: 3, transit: 2,
        desc: "Phoenix's playground — Old Town Scottsdale is all rooftop bars, galleries, resort pools, and the kind of nightlife that draws people from across the valley.",
        tags: ["nightlife","upscale","food"], lat: 33.4942, lng: -111.9261 },
      { name: "Arcadia", vibe: "Lush & family-friendly", cost: "$$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 4, transit: 2,
        desc: "Phoenix's greenest neighborhood — Arcadia is defined by irrigated citrus groves, mountain views of Camelback, beautiful ranch homes, and an excellent restaurant scene.",
        tags: ["family","outdoors","upscale"], lat: 33.4836, lng: -111.9927 },
      { name: "Tempe", vibe: "Young & energetic", cost: "$", pace: "Fast", outdoors: 3, nightlife: 4, family: 2, remote: 4, transit: 4,
        desc: "Home to Arizona State University, Tempe is the valley's most walkable and transit-friendly city — a young, affordable, and energetic hub with Tempe Town Lake at its center.",
        tags: ["nightlife","walkable","affordable"], lat: 33.4255, lng: -111.9400 },
      { name: "Chandler", vibe: "Suburban & polished", cost: "$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "The valley's most livable suburb — Chandler has excellent schools, a growing tech corridor (Intel, PayPal), and a downtown that's actually worth visiting on weekends.",
        tags: ["family","tech","quiet"], lat: 33.3062, lng: -111.8413 },
      { name: "Midtown Phoenix", vibe: "Urban & accessible", cost: "$$", pace: "Medium", outdoors: 2, nightlife: 3, family: 2, remote: 5, transit: 4,
        desc: "Phoenix's most walkable corridor — the light rail spine through Midtown connects museums, coffee shops, and restaurants in a way that makes the city feel genuinely urban rather than suburban sprawl.…",
        tags: ["walkable","arts","tech"], lat: 33.4743, lng: -112.0731 },
      { name: "Ahwatukee", vibe: "Suburban & outdoorsy", cost: "$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "Tucked against South Mountain Park, Ahwatukee is one of the valley's most coveted family enclaves — excellent schools, world-class hiking literally out your back door, and a safe, close-knit community feel.…",
        tags: ["family","outdoors","quiet"], lat: 33.3225, lng: -112.0023 },
      { name: "Gilbert", vibe: "Polished & family-first", cost: "$$", pace: "Slow", outdoors: 3, nightlife: 2, family: 5, remote: 5, transit: 2,
        desc: "The valley's fastest-growing suburb — Gilbert has transformed from a farming town to a nationally recognized family destination with exceptional schools, a walkable Heritage District, and a strong sense of community.…",
        tags: ["family","tech","quiet"], lat: 33.3528, lng: -111.7890 },
      { name: "North Scottsdale", vibe: "Upscale & resort-like", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 4, remote: 4, transit: 2,
        desc: "Desert luxury at its most refined — North Scottsdale has world-class golf, Kierland Commons walkable shopping, corporate tech campuses, and desert mountain preserve trails that reward those who embrace the heat.…",
        tags: ["upscale","tech","outdoors"], lat: 33.6381, lng: -111.9268 },
    ],
    tips: [
      { category: "Heat", icon: "🌡️", tip: "June–September you live indoors or in the pool. Plan outdoor activities before 8am or after 7pm." },
      { category: "Cost", icon: "💰", tip: "Still one of the most affordable major metros in the US — your money genuinely goes further here." },
      { category: "Car", icon: "🚗", tip: "Phoenix is built for cars. You will need one. Plan your neighborhood around your commute." },
    ],
    questions: [{ q: "How do people survive the summer heat?", a: "You adapt faster than you think. AC everywhere, pools everywhere, and Flagstaff is 2 hours away when you need a break.", author: "Dana K.", time: "3 days ago" }],
  },
  {
    id: "atlanta", name: "Atlanta", state: "GA", emoji: "🍑",
    accent: "#C43C3C", accentLight: "#E07A7A", bg: "#0E0808", card: "#1A1010", cardBorder: "#352020",
    textPrimary: "#F5EAEA", textMuted: "rgba(245,234,234,0.52)",
    displayFont: "'EB Garamond', Georgia, serif", bodyFont: "'Source Serif 4', Georgia, serif",
    tagline: "The city in a forest that never slows down.", vibe: "Ambitious & Cultural",
    costIndex: "$$", climate: "Warm & humid, mild winters", population: "498K",
    tags: ["culture","food","music","growth"],
    mapCenter: [33.7490, -84.3880],
    neighborhoods: [
      { name: "Poncey-Highland", vibe: "Creative & walkable", cost: "$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 3, remote: 5, transit: 3,
        desc: "One of Atlanta's most walkable neighborhoods — Ponce City Market anchors a stretch of the BeltLine trail, great restaurants, and a genuinely mixed and thriving community.",
        tags: ["food","arts","walkable"], lat: 33.7715, lng: -84.3596 },
      { name: "Inman Park", vibe: "Historic & charming", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 3, family: 4, remote: 4, transit: 3,
        desc: "Atlanta's first planned suburb (1890) is now one of its most beloved neighborhoods — Victorian homes, the BeltLine at your doorstep, and a restaurant scene that punches above its weight.",
        tags: ["historic","food","walkable"], lat: 33.7565, lng: -84.3555 },
      { name: "Old Fourth Ward", vibe: "Historic & electric", cost: "$$", pace: "Fast", outdoors: 4, nightlife: 4, family: 3, remote: 4, transit: 4,
        desc: "MLK's birthplace neighborhood has transformed into Atlanta's trendiest zip code — the BeltLine's Eastside Trail, Ponce City Market, and an electric mix of history and new energy.",
        tags: ["arts","nightlife","historic"], lat: 33.7573, lng: -84.3712 },
      { name: "Decatur", vibe: "Walkable & community-driven", cost: "$$", pace: "Slow", outdoors: 3, nightlife: 3, family: 5, remote: 5, transit: 4,
        desc: "Atlanta's best small-town experience — Decatur is a MARTA-connected city unto itself with award-winning schools, a walkable downtown square, and a genuine sense of community.",
        tags: ["family","walkable","community"], lat: 33.7748, lng: -84.2963 },
      { name: "West End", vibe: "Cultural & affordable", cost: "$", pace: "Medium", outdoors: 3, nightlife: 3, family: 3, remote: 4, transit: 4,
        desc: "Atlanta's historically Black neighborhood is undergoing a remarkable renaissance — the BeltLine's Westside Trail, new restaurants, and deep cultural roots make this one to watch.",
        tags: ["arts","community","affordable"], lat: 33.7340, lng: -84.4197 },
      { name: "East Atlanta Village", vibe: "Gritty & creative", cost: "$", pace: "Medium", outdoors: 3, nightlife: 4, family: 2, remote: 4, transit: 3,
        desc: "Atlanta's dive bar capital and creative underground — East Atlanta Village is loud, unpretentious, and full of musicians, artists, and longtime locals who've resisted every gentrification wave so far.…",
        tags: ["arts","nightlife","affordable"], lat: 33.7267, lng: -84.3481 },
      { name: "Virginia-Highland", vibe: "Charming & lively", cost: "$$$", pace: "Medium", outdoors: 4, nightlife: 4, family: 3, remote: 4, transit: 3,
        desc: "Atlanta's most beloved walkable neighborhood — 'VaHi' has beautiful bungalows, Piedmont Park at its edge, some of the city's best restaurants on Highland Ave, and a genuine neighborhood energy.…",
        tags: ["food","walkable","arts"], lat: 33.7800, lng: -84.3598 },
      { name: "Buckhead", vibe: "Affluent & corporate", cost: "$$$", pace: "Fast", outdoors: 3, nightlife: 4, family: 4, remote: 4, transit: 3,
        desc: "Atlanta's power corridor — Buckhead has the city's highest concentration of luxury apartments, corporate headquarters, upscale dining, and a nightlife district that draws the entire metro on weekends.…",
        tags: ["upscale","nightlife","tech"], lat: 33.8396, lng: -84.3800 },
      { name: "Grant Park", vibe: "Historic & community-rich", cost: "$$", pace: "Slow", outdoors: 5, nightlife: 2, family: 4, remote: 5, transit: 3,
        desc: "One of Atlanta's most beautiful historic neighborhoods — Grant Park surrounds the city zoo and a stunning Victorian park, with craftsman bungalows, a strong neighborhood association, and BeltLine access.…",
        tags: ["historic","outdoors","family"], lat: 33.7284, lng: -84.3706 },
    ],
    tips: [
      { category: "Traffic", icon: "🚗", tip: "I-285 and I-75/85 will test your patience daily. MARTA is underrated — use it if you can." },
      { category: "BeltLine", icon: "🚶", tip: "The Atlanta BeltLine is transformative. Pick a neighborhood on or near it and your quality of life goes up." },
      { category: "Food", icon: "🍑", tip: "Atlanta's food scene is legitimately world-class. Buford Highway alone is worth moving for." },
    ],
    questions: [{ q: "Is Atlanta as traffic-heavy as people say?", a: "Yes. But if you pick the right neighborhood and use MARTA, it's very manageable.", author: "James P.", time: "6 days ago" }],
  },
];

const ALL_TAGS = ["music","tech","outdoors","food","history","academia","sports","coffee","arts","architecture"];
const QUIZ = [
  { id: "pace", question: "What pace of life are you looking for?", options: [{ label: "Slow & quiet", value: "Slow" }, { label: "Balanced — some buzz, some calm", value: "Medium" }, { label: "Fast & always something happening", value: "Fast" }] },
  { id: "priority", question: "What matters most day-to-day?", options: [{ label: "Green space & outdoors", value: "outdoors" }, { label: "Nightlife & restaurants", value: "nightlife" }, { label: "Family & community feel", value: "family" }, { label: "Quiet for remote work / focus", value: "remote" }] },
  { id: "transit", question: "How important is walkability & transit?", options: [{ label: "Critical — I don't want to drive", value: 5 }, { label: "Important but flexible", value: 3 }, { label: "Not a priority", value: 1 }] },
  { id: "cost", question: "Budget comfort zone?", options: [{ label: "$ — Affordable is essential", value: "$" }, { label: "$$ — Mid-range works", value: "$$" }, { label: "$$$ — I'll pay for the right place", value: "$$$" }] },
];
const EXPLORE_STEPS = [
  { id: "reason", type: "single", question: "What's bringing you to a new city?", options: ["New job or career move", "Following a partner or family", "Fresh start / adventure", "Remote work — my choice"], field: "reason" },
  { id: "priorities", type: "multi", question: "What matters most in a city?", subtitle: "Pick everything that resonates.", options: ["Outdoors & nature", "Food & nightlife", "Arts & culture", "Career networking", "Sports & fitness", "Community & belonging", "Affordability", "Walkability"], field: "priorities" },
  { id: "cost", type: "single", question: "Budget comfort zone?", options: ["$ — Affordability is essential", "$$ — Mid-range works", "$$$ — I'll pay for the right place"], field: "cost" },
  { id: "climate", type: "single", question: "How do you feel about cold winters?", options: ["Love the seasons — bring it", "Can handle it with a good coat", "Prefer warmth year-round", "Genuinely don't mind"], field: "climate" },
];

function scoreNeighborhood(n, answers) {
  let s = 0;
  if (answers.pace && n.pace === answers.pace) s += 3;
  if (answers.priority) s += (n[answers.priority] || 0);
  if (answers.transit) s += Math.max(0, 3 - Math.abs(n.transit - answers.transit));
  if (answers.cost && n.cost === answers.cost) s += 3;
  return s;
}

function useMount(d = 40) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), d); return () => clearTimeout(t); }, []);
  return v;
}

// ── City Card with SVG Skyline ─────────────────────────────────────────────────
const CityCardBg = (props) => {
var {city, hovered} = props;
  const Skyline = SKYLINES[city.id];
  return Skyline ? <Skyline accent={city.accent} opacity={hovered ? 0.28 : 0.16} /> : null;
}

// ── Split Entry ───────────────────────────────────────────────────────────────
const SplitEntry = (props) => {
var {onKnow, onExplore} = props;
  const [hover, setHover] = useState(null);
  const v = useMount(20);

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'EB Garamond', Georgia, serif", overflow: "hidden", opacity: v ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, display: "flex", justifyContent: "center", paddingTop: "64px", pointerEvents: "none" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(28px,4.5vw,48px)", fontWeight: "400", letterSpacing: "-2px", fontFamily: "'Playfair Display',Georgia,serif", color: "#f0ece6", textShadow: "0 2px 24px rgba(0,0,0,0.95)", lineHeight: 1 }}>Relo</h1>
      </div>

      {/* LEFT — I Know My City */}
      <div onClick={onKnow} onMouseEnter={() => setHover("know")} onMouseLeave={() => setHover(null)}
        style={{ flex: hover === "know" ? "1.5" : hover ? "0.75" : "1", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "80px 36px 60px", position: "relative", overflow: "hidden", transition: "flex 0.5s cubic-bezier(0.4,0,0.2,1)", borderRight: "1px solid rgba(217,95,43,0.2)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#1f110a 0%,#140b05 100%)" }} />
        {SKYLINES.austin({ accent: "#D95F2B", opacity: hover === "know" ? 0.32 : 0.16 })}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(20,11,5,0.2) 0%, rgba(20,11,5,0.82) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 70%, rgba(217,95,43,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: "320px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#D95F2B", marginBottom: "14px" }}>I'm moving to</div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: "400", color: "#F7EDE2", margin: "0 0 14px", lineHeight: "1.1", letterSpacing: "-1px", fontFamily: "'Playfair Display',Georgia,serif" }}>I know<br />my city</h2>
          <p style={{ fontSize: "13px", color: "rgba(247,237,226,0.52)", lineHeight: "1.75", fontStyle: "italic", margin: "0 0 24px" }}>Find your neighborhood, get local intel, and hit the ground running.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F4A16A", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
            <span>Find my neighborhood</span>
            <span style={{ fontSize: "16px", transform: hover === "know" ? "translateX(6px)" : "none", transition: "transform 0.3s" }}>→</span>
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "18px", flexWrap: "wrap" }}>
            {["Neighborhood match", "Local tips", "Map"].map(t => (
              <span key={t} style={{ fontSize: "9px", padding: "2px 8px", border: "1px solid rgba(217,95,43,0.3)", color: "rgba(244,161,106,0.6)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>


      <div style={{ width: "0", position: "relative", zIndex: 10 }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "-1px", width: "2px", background: "linear-gradient(180deg, transparent 5%, rgba(150,180,200,0.18) 50%, transparent 95%)" }} />
      </div>

      {/* RIGHT — Help Me Choose */}
      <div onClick={onExplore} onMouseEnter={() => setHover("explore")} onMouseLeave={() => setHover(null)}
        style={{ flex: hover === "explore" ? "1.5" : hover ? "0.75" : "1", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", padding: "80px 36px 60px", position: "relative", overflow: "hidden", transition: "flex 0.5s cubic-bezier(0.4,0,0.2,1)", textAlign: "right" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg,#0c1512 0%,#060b0a 100%)" }} />
        {SKYLINES.chicago({ accent: "#C49A2A", opacity: hover === "explore" ? 0.32 : 0.16 })}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(6,11,10,0.2) 0%, rgba(6,11,10,0.82) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 80% 30%, rgba(46,125,107,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: "320px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#2E7D6B", marginBottom: "14px" }}>I'm exploring</div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: "400", color: "#E8F0EE", margin: "0 0 14px", lineHeight: "1.1", letterSpacing: "-1px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Help me<br />choose</h2>
          <p style={{ fontSize: "13px", color: "rgba(232,240,238,0.52)", lineHeight: "1.75", fontStyle: "italic", margin: "0 0 24px" }}>Tell us what matters and we'll match you to the city that fits your life.</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", color: "#5DB8A4", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
            <span style={{ fontSize: "16px", transform: hover === "explore" ? "translateX(-6px)" : "none", transition: "transform 0.3s" }}>←</span>
            <span>Explore cities</span>
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "18px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {["City matching", "Personalized picks", "Compare"].map(t => (
              <span key={t} style={{ fontSize: "9px", padding: "2px 8px", border: "1px solid rgba(46,125,107,0.3)", color: "rgba(93,184,164,0.6)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "20px", left: 0, right: 0, textAlign: "center", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(240,236,230,0.15)", zIndex: 20, pointerEvents: "none" }}>Your next chapter starts here</div>
    </div>
  );
}
// ── Know Path ─────────────────────────────────────────────────────────────────
const KnowPath = (props) => {
var {onBack} = props;
  const [stage, setStage] = useState("pick");
  const [cityId, setCityId] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [activeTab, setActiveTab] = useState("neighborhoods");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [neighborhoodPage, setNeighborhoodPage] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [qInput, setQInput] = useState("");
  const [qSubmitted, setQSubmitted] = useState(false);
  const v = useMount();
  const c = cityId ? CITIES.find(x => x.id === cityId) : null;

  function selectAnswer(qid, val) {
    const next = { ...answers, [qid]: val };
    setAnswers(next);
    if (quizStep < QUIZ.length - 1) setQuizStep(quizStep + 1);
    else { setStage("result"); setSelectedNeighborhood(null); }
  }

  const scored = c ? [...c.neighborhoods].map(n => ({ ...n, score: scoreNeighborhood(n, answers) })).sort((a, b) => b.score - a.score) : [];
  const maxScore = scored.length ? Math.max(...scored.map(n => n.score)) : 0;
  const minScore = scored.length ? Math.min(...scored.map(n => n.score)) : 0;
  const selectedN = selectedNeighborhood ? scored.find(n => n.name === selectedNeighborhood) : null;

  if (stage === "pick") return (
    <div style={{ minHeight: "100vh", background: "#140b05", fontFamily: "'Source Serif 4',Georgia,serif", color: "#F7EDE2", opacity: v ? 1 : 0, transition: "opacity 0.4s" }}>
      <div style={{ borderBottom: "1px solid rgba(217,95,43,0.2)", padding: "16px 24px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(20,11,5,0.95)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "rgba(244,161,106,0.7)", cursor: "pointer", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Source Serif 4',Georgia,serif" }}>← Back</button>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "400", fontFamily: "'Playfair Display',Georgia,serif" }}>Relo</h1>
        <span style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(247,237,226,0.28)" }}>I know my city</span>
      </div>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#D95F2B", marginBottom: "14px" }}>Step 1 of 2</div>
        <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: "400", margin: "0 0 10px", fontFamily: "'Playfair Display',Georgia,serif", letterSpacing: "-0.5px" }}>Where are you headed?</h2>
        <p style={{ fontSize: "14px", color: "rgba(247,237,226,0.45)", fontStyle: "italic", margin: "0 0 32px", lineHeight: "1.7" }}>Pick your city and we'll help you find the right neighborhood.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "2px" }}>
          {CITIES.map(ct => {
            const Skyline = SKYLINES[ct.id];
            return (
              <div key={ct.id} onClick={() => { setCityId(ct.id); setStage("quiz"); setQuizStep(0); setAnswers({}); }}
                onMouseEnter={() => setHoveredCard(ct.id)} onMouseLeave={() => setHoveredCard(null)}
                style={{ position: "relative", overflow: "hidden", cursor: "pointer", border: `1px solid ${ct.cardBorder}`, transition: "all 0.25s", minHeight: "210px", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: ct.bg }}
                onMouseEnterCapture={e => { e.currentTarget.style.borderColor = ct.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 40px ${ct.accent}33`; }}
                onMouseLeaveCapture={e => { e.currentTarget.style.borderColor = ct.cardBorder; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {Skyline && <Skyline accent={ct.accent} opacity={hoveredCard === ct.id ? 0.35 : 0.2} />}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${ct.bg} 38%, transparent 100%)` }} />
                <div style={{ position: "relative", padding: "20px" }}>
                  <div style={{ fontSize: "26px", marginBottom: "8px" }}>{ct.emoji}</div>
                  <div style={{ fontSize: "28px", fontWeight: "400", fontFamily: ct.displayFont, color: ct.textPrimary, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: "5px" }}>{ct.name}</div>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: ct.accentLight, marginBottom: "8px" }}>{ct.state} · {ct.vibe}</div>
                  <p style={{ fontSize: "12px", color: ct.textMuted, fontStyle: "italic", margin: "0 0 8px", lineHeight: "1.5" }}>"{ct.tagline}"</p>
                  <div style={{ fontSize: "11px", color: ct.accentLight }}>Explore {ct.neighborhoods.length} neighborhoods →</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (stage === "quiz" && c) {
    const q = QUIZ[quizStep];
    const Skyline = SKYLINES[c.id];
    return (
      <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'Source Serif 4',Georgia,serif", color: c.textPrimary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", opacity: v ? 1 : 0, transition: "opacity 0.4s", overflow: "hidden", background: c.bg }}>
        {Skyline && <Skyline accent={c.accent} opacity={0.14} />}
        <div style={{ position: "absolute", inset: 0, background: `${c.bg}cc` }} />
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.06)", zIndex: 100 }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${c.accent}, ${c.accentLight})`, width: String((quizStep / QUIZ.length) * 100) + "%", transition: "width 0.4s ease" }} />
        </div>
        <div style={{ maxWidth: "500px", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
            <span style={{ fontSize: "22px" }}>{c.emoji}</span>
            <span style={{ fontSize: "18px", fontFamily: c.displayFont }}>{c.name}</span>
            <span style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.textMuted, marginLeft: "4px" }}>Neighborhood Match</span>
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: c.accentLight, marginBottom: "12px" }}>Question {quizStep + 1} of {QUIZ.length}</div>
          <h2 style={{ fontSize: "26px", fontWeight: "400", margin: "0 0 26px", fontFamily: c.displayFont, lineHeight: "1.3" }}>{q.question}</h2>
          <div style={{ display: "grid", gap: "9px" }}>
            {q.options.map(opt => (
              <button key={opt.label} onClick={() => selectAnswer(q.id, opt.value)}
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${c.cardBorder}`, color: c.textPrimary, padding: "15px 20px", fontSize: "15px", cursor: "pointer", textAlign: "left", fontFamily: c.bodyFont, transition: "all 0.15s", lineHeight: "1.4" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}22`; e.currentTarget.style.borderColor = c.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = c.cardBorder; }}
              >{opt.label}</button>
            ))}
          </div>
          <button onClick={() => { setStage("pick"); setCityId(null); }} style={{ background: "transparent", border: "none", color: c.textMuted, cursor: "pointer", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "28px", fontFamily: c.bodyFont }}>← Change city</button>
        </div>
      </div>
    );
  }

  // Neighborhood deep dive page
  if (neighborhoodPage && c) {
    const n = c.neighborhoods.find(x => x.name === neighborhoodPage);
    if (n) return <NeighborhoodPage neighborhood={n} city={c} onBack={() => setNeighborhoodPage(null)} />;
  }

  if (stage === "result" && c) return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: c.bodyFont, color: c.textPrimary, opacity: v ? 1 : 0, transition: "opacity 0.4s" }}>
      <div style={{ borderBottom: `1px solid ${c.cardBorder}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: "14px", background: `${c.bg}f0`, backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 20, flexWrap: "wrap" }}>
        <button onClick={() => setStage("pick")} style={{ background: "transparent", border: "none", color: c.accentLight, cursor: "pointer", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: c.bodyFont }}>← Cities</button>
        <span style={{ fontSize: "20px" }}>{c.emoji}</span>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "400", fontFamily: c.displayFont }}>{c.name}</h1>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          {["neighborhoods","tips","ask"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "transparent", border: "none", borderBottom: activeTab === tab ? `2px solid ${c.accent}` : "2px solid transparent", color: activeTab === tab ? c.textPrimary : c.textMuted, padding: "8px 14px", fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont }}>
              {tab === "neighborhoods" ? "Neighborhoods" : tab === "tips" ? "Tips" : "Ask"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 24px 60px" }}>
        {activeTab === "neighborhoods" && (
          <div>
            {/* SVG Map */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.textMuted, opacity: 0.55, marginBottom: "10px" }}>Neighborhood Map — click a pin to highlight</div>
              <NeighborhoodMap city={c} scored={scored} selectedNeighborhood={selectedNeighborhood} onSelectNeighborhood={setSelectedNeighborhood} />
            </div>

            {/* Selected detail */}
            {selectedN && (
              <div style={{ background: `linear-gradient(135deg, ${c.card}, ${c.bg})`, border: `1px solid ${selectedN.score === maxScore ? c.accent + "66" : c.cardBorder}`, padding: "22px", marginBottom: "18px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: `radial-gradient(circle at top right, ${c.accent}18, transparent 65%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight, marginBottom: "4px" }}>Selected on map</div>
                    <h3 style={{ fontSize: "24px", fontWeight: "400", margin: 0, fontFamily: c.displayFont }}>{selectedN.name}</h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "26px", fontFamily: c.displayFont, color: selectedN.score === maxScore ? c.accent : c.accentLight }}>{selectedN.score}</div>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: c.textMuted, opacity: 0.6 }}>match score</div>
                  </div>
                </div>
                <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: c.accentLight, marginBottom: "12px" }}>{selectedN.vibe} · {selectedN.cost} · {selectedN.pace} pace</div>
                <p style={{ fontSize: "14px", color: c.textMuted, lineHeight: "1.8", margin: "0 0 14px" }}>{selectedN.desc}</p>
                {selectedN.defining && (
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: c.accent, marginBottom: "5px" }}>Known for</div>
                    <div style={{ fontSize: "13px", color: c.textPrimary, fontStyle: "italic", fontFamily: c.displayFont }}>{selectedN.defining}</div>
                  </div>
                )}
                {selectedN.hotspots && (
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: c.accent, marginBottom: "8px" }}>Hotspots</div>
                    <div style={{ display: "grid", gap: "5px" }}>
                      {selectedN.hotspots.map((h, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ color: c.accent, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>◆</span>
                          <span style={{ fontSize: "13px", color: c.textMuted, lineHeight: "1.5" }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {selectedN.tags.map(t => <span key={t} style={{ fontSize: "10px", padding: "2px 9px", border: `1px solid ${c.accent}44`, color: c.accentLight }}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "14px", alignItems: "center" }}>
                  <button onClick={() => setNeighborhoodPage(selectedN.name)}
                    style={{ background: c.accent, border: "none", color: "#fff", padding: "10px 22px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont }}
                  >Full Guide →</button>
                  <button onClick={() => setSelectedNeighborhood(null)} style={{ background: "transparent", border: `1px solid ${c.cardBorder}`, color: c.textMuted, cursor: "pointer", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: c.bodyFont, padding: "10px 16px" }}>✕ Close</button>
                </div>
                <button onClick={() => setSelectedNeighborhood(null)} style={{ position: "absolute", top: "12px", right: "12px", background: "transparent", border: "none", color: c.textMuted, cursor: "pointer", fontSize: "16px", opacity: 0.4, display: "none" }}>✕</button>
              </div>
            )}

            {/* Best match */}
            <div style={{ background: `linear-gradient(135deg, ${c.card}, ${c.bg})`, border: `1px solid ${c.accent}55`, padding: "24px", marginBottom: "14px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "110px", height: "110px", background: `radial-gradient(circle at top right, ${c.accent}18, transparent 65%)`, pointerEvents: "none" }} />
              <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: c.accent, marginBottom: "6px" }}>✦ Your best match</div>
              <h2 style={{ fontSize: "32px", fontWeight: "400", margin: "0 0 5px", fontFamily: c.displayFont, letterSpacing: "-0.5px" }}>{scored[0].name}</h2>
              <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight, marginBottom: "12px" }}>{scored[0].vibe} · {scored[0].cost} · {scored[0].pace} pace</div>
              <p style={{ fontSize: "14px", color: c.textMuted, lineHeight: "1.8", margin: "0 0 14px" }}>{scored[0].desc}</p>
              {scored[0].defining && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: c.accent, marginBottom: "5px" }}>Known for</div>
                  <div style={{ fontSize: "13px", color: c.textPrimary, fontStyle: "italic", fontFamily: c.displayFont }}>{scored[0].defining}</div>
                </div>
              )}
              {scored[0].hotspots && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: c.accent, marginBottom: "8px" }}>Hotspots</div>
                  <div style={{ display: "grid", gap: "5px" }}>
                    {scored[0].hotspots.map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: c.accent, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>◆</span>
                        <span style={{ fontSize: "13px", color: c.textMuted, lineHeight: "1.5" }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                {scored[0].tags.map(t => <span key={t} style={{ fontSize: "10px", padding: "2px 9px", border: `1px solid ${c.accent}44`, color: c.accentLight }}>{t}</span>)}
              </div>
              <button onClick={() => setNeighborhoodPage(scored[0].name)}
                style={{ background: c.accent, border: "none", color: "#fff", padding: "12px 28px", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Explore Full Neighborhood Guide →</button>
            </div>

            {/* Ranked list */}
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.textMuted, opacity: 0.5, marginBottom: "10px" }}>All neighborhoods — ranked by match</div>
            <div style={{ display: "grid", gap: "7px" }}>
              {scored.map((n, i) => {
                const isLeast = n.score === minScore && minScore < maxScore;
                const isSelected = selectedNeighborhood === n.name;
                return (
                  <div key={n.name}
                    style={{ background: isSelected ? `${c.accent}18` : c.card, border: `1px solid ${isSelected ? c.accent + "88" : i === 0 ? c.accent + "44" : c.cardBorder}`, transition: "all 0.2s", opacity: isLeast ? 0.65 : 1, overflow: "hidden" }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = `${c.accent}55`; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = i === 0 ? `${c.accent}44` : c.cardBorder; }}
                  >
                    {/* Main row */}
                    <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center", cursor: "pointer" }}
                      onClick={() => setSelectedNeighborhood(isSelected ? null : n.name)}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", color: c.textMuted, fontFamily: "monospace", opacity: 0.45 }}>#{i + 1}</span>
                          <span style={{ fontSize: "16px", fontFamily: c.displayFont, color: isLeast ? c.textMuted : c.textPrimary }}>{n.name}</span>
                          {i === 0 && <span style={{ fontSize: "9px", padding: "2px 7px", background: c.accent, color: "#fff", letterSpacing: "1.5px", textTransform: "uppercase" }}>Top</span>}
                          {isLeast && <span style={{ fontSize: "9px", padding: "2px 6px", border: `1px solid ${c.cardBorder}`, color: c.textMuted, opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" }}>Least match</span>}
                        </div>
                        <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: isLeast ? c.textMuted : c.accentLight, opacity: isLeast ? 0.5 : 1 }}>{n.vibe} · {n.cost} · {n.pace} pace</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "48px", height: "3px", background: c.cardBorder, borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: String(maxScore > 0 ? (n.score / maxScore) * 100 : 0) + "%", background: isLeast ? "#4a4a6a" : c.accent, borderRadius: "2px" }} />
                        </div>
                        <div style={{ fontSize: "18px", fontFamily: c.displayFont, color: isLeast ? c.textMuted : c.accent, opacity: isLeast ? 0.5 : 1, minWidth: "22px", textAlign: "right" }}>{n.score}</div>
                      </div>
                    </div>
                    {/* Deep dive button */}
                    <div style={{ borderTop: `1px solid ${c.cardBorder}`, padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `${c.accent}08` }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {(n.tags || []).slice(0,3).map(t => <span key={t} style={{ fontSize: "9px", padding: "1px 7px", border: `1px solid ${c.accent}33`, color: c.accentLight, opacity: 0.7 }}>{t}</span>)}
                      </div>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <button onClick={e => {
                          e.stopPropagation();
                          try {
                            const saved = JSON.parse(localStorage.getItem("relo_neighborhoods")||"[]");
                            if (!saved.find(s => s.name === n.name)) {
                              localStorage.setItem("relo_neighborhoods", JSON.stringify([...saved, { name:n.name, city:c.name, vibe:n.vibe, cost:n.cost }]));
                              e.currentTarget.textContent = "✓ Saved";
                              e.currentTarget.style.color = "#4caf50";
                              e.currentTarget.style.borderColor = "#4caf50";
                            }
                          } catch {}
                        }}
                          style={{ background:"transparent", border:`1px solid ${c.cardBorder}`, color:c.textMuted, padding:"5px 10px", fontSize:"10px", cursor:"pointer", fontFamily:c.bodyFont }}>
                          🔖 Save
                        </button>
                        <button
                          onClick={() => setNeighborhoodPage(n.name)}
                          style={{ background: "transparent", border: `1px solid ${c.accent}55`, color: c.accentLight, padding: "5px 14px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont, transition: "all 0.15s", whiteSpace: "nowrap" }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}22`; e.currentTarget.style.borderColor = c.accent; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${c.accent}55`; }}
                        >Full Guide →</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => { setStage("quiz"); setQuizStep(0); setAnswers({}); setSelectedNeighborhood(null); }}
              style={{ background: "transparent", border: `1px solid ${c.cardBorder}`, color: c.textMuted, padding: "11px 20px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont, marginTop: "16px", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accentLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.cardBorder; e.currentTarget.style.color = c.textMuted; }}
            >↺ Retake quiz</button>
          </div>
        )}

        {activeTab === "tips" && (
          <div style={{ display: "grid", gap: "12px" }}>
            {c.tips.map((tip, i) => (
              <div key={i} style={{ background: c.card, border: `1px solid ${c.cardBorder}`, borderLeft: `3px solid ${c.accent}`, padding: "18px 22px", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateX(5px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{tip.icon}</span>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight }}>{tip.category}</span>
                </div>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: c.textPrimary }}>{tip.tip}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ask" && (
          <div>
            <div style={{ display: "grid", gap: "14px", marginBottom: "24px" }}>
              {c.questions.map((q, i) => (
                <div key={i} style={{ background: c.card, border: `1px solid ${c.cardBorder}`, padding: "22px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: "17px", fontStyle: "italic", color: c.textPrimary, fontFamily: c.displayFont }}>"{q.q}"</p>
                  <div style={{ width: "24px", height: "1px", background: `${c.accent}66`, margin: "0 0 12px" }} />
                  <p style={{ margin: "0 0 10px", fontSize: "14px", color: c.textMuted, lineHeight: "1.7" }}>{q.a}</p>
                  <div style={{ fontSize: "11px", color: c.textMuted, opacity: 0.55 }}>— {q.author} · {q.time}</div>
                </div>
              ))}
            </div>
            <div style={{ background: c.card, border: `1px dashed ${c.accent}44`, padding: "22px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight, marginBottom: "12px" }}>Ask the Community</div>
              {qSubmitted ? <p style={{ color: c.textMuted, fontStyle: "italic", margin: 0 }}>✓ Submitted! A local will answer soon.</p> : (
                <>
                  <textarea value={qInput} onChange={e => setQInput(e.target.value)} placeholder={`What do you want to know about ${c.name}?`} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${c.cardBorder}`, color: c.textPrimary, padding: "14px", fontSize: "14px", fontFamily: c.bodyFont, resize: "vertical", minHeight: "80px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }} />
                  <button onClick={() => { if (qInput.trim()) setQSubmitted(true); }} style={{ background: c.accent, color: "#fff", border: "none", padding: "12px 28px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont }}>Submit →</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}

// ── Explore Path ──────────────────────────────────────────────────────────────
const ExplorePath = (props) => {
var {onBack} = props;
  const [stage, setStage] = useState("onboard");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [costFilter, setCostFilter] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState("tips");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [qInput, setQInput] = useState("");
  const [qSubmitted, setQSubmitted] = useState(false);
  const v = useMount();
  const cur = EXPLORE_STEPS[step];

  function selectSingle(field, val) { const next = { ...answers, [field]: val }; setAnswers(next); setTimeout(() => { if (step < EXPLORE_STEPS.length - 1) setStep(step + 1); else setStage("grid"); }, 260); }
  function toggleMulti(field, val) { setAnswers(a => { const arr = a[field] || []; return { ...a, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }; }); }
  function toggleTag(t) { setActiveTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]); }
  function getScore(c) { let s = 0; const pm = { "Outdoors & nature": ["outdoors"], "Food & nightlife": ["food"], "Arts & culture": ["arts"], "Career networking": ["tech"], "Sports & fitness": ["sports"] }; (answers.priorities || []).forEach(p => (pm[p] || []).forEach(t => { if (c.tags.includes(t)) s++; })); if (answers.cost && c.costIndex === answers.cost.split(" — ")[0]) s += 2; return s; }

  const btnBase = { border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e8f0ee", padding: "15px 20px", fontSize: "15px", cursor: "pointer", textAlign: "left", fontFamily: "'Source Serif 4',Georgia,serif", transition: "all 0.15s", lineHeight: "1.4", display: "block", width: "100%" };

  if (stage === "onboard") {
    const SeattleSkyline = SKYLINES.seattle;
    return (
      <div style={{ minHeight: "100vh", background: "#080E0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", fontFamily: "'Source Serif 4',Georgia,serif", color: "#E8F0EE", opacity: v ? 1 : 0, transition: "opacity 0.4s", position: "relative", overflow: "hidden" }}>
        <SeattleSkyline accent="#2E7D6B" opacity={0.12} />
        <div style={{ position: "absolute", inset: 0, background: "#080E0Dcc" }} />
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.05)", zIndex: 100 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#2E7D6B,#5DB8A4)", width: String((step / EXPLORE_STEPS.length) * 100) + "%", transition: "width 0.4s ease" }} />
        </div>
        <div style={{ maxWidth: "480px", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
            <button onClick={onBack} style={{ background: "transparent", border: "none", color: "rgba(93,184,164,0.7)", cursor: "pointer", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Source Serif 4',Georgia,serif" }}>← Back</button>
            <span style={{ fontSize: "20px", fontFamily: "'DM Serif Display',Georgia,serif", color: "#E8F0EE" }}>Relo</span>
            <span style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(232,240,238,0.28)" }}>Find your city</span>
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#5DB8A4", marginBottom: "12px" }}>{step + 1} of {EXPLORE_STEPS.length}</div>
          <h2 style={{ fontSize: "27px", fontWeight: "400", color: "#E8F0EE", margin: "0 0 20px", fontFamily: "'DM Serif Display',Georgia,serif", lineHeight: "1.3" }}>{cur.question}</h2>
          {cur.subtitle && <p style={{ fontSize: "13px", color: "rgba(232,240,238,0.38)", fontStyle: "italic", margin: "0 0 18px" }}>{cur.subtitle}</p>}
          {cur.type === "single" && (
            <div style={{ display: "grid", gap: "9px" }}>
              {cur.options.map(opt => (
                <button key={opt} onClick={() => selectSingle(cur.field, opt)} style={{ ...btnBase, background: answers[cur.field] === opt ? "rgba(46,125,107,0.2)" : "rgba(255,255,255,0.03)", borderColor: answers[cur.field] === opt ? "#2E7D6B" : "rgba(255,255,255,0.1)" }}
                  onMouseEnter={e => { if (answers[cur.field] !== opt) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={e => { if (answers[cur.field] !== opt) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >{opt}</button>
              ))}
            </div>
          )}
          {cur.type === "multi" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginBottom: "20px" }}>
                {cur.options.map(opt => { const sel = (answers[cur.field] || []).includes(opt); return (
                  <button key={opt} onClick={() => toggleMulti(cur.field, opt)} style={{ ...btnBase, background: sel ? "rgba(46,125,107,0.18)" : "rgba(255,255,255,0.03)", borderColor: sel ? "#2E7D6B" : "rgba(255,255,255,0.1)", textAlign: "center", padding: "13px 12px", fontSize: "13px" }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >{opt}</button>
                ); })}
              </div>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => { if (step < EXPLORE_STEPS.length - 1) setStep(step + 1); else setStage("grid"); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(232,240,238,0.55)", padding: "11px 28px", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Source Serif 4',Georgia,serif" }}>Continue →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const c = selectedCity ? CITIES.find(x => x.id === selectedCity) : null;
  if (stage === "city" && c) {
    const Skyline = SKYLINES[c.id];
    return (
      <div style={{ minHeight: "100vh", background: c.bg, fontFamily: c.bodyFont, color: c.textPrimary, opacity: v ? 1 : 0, transition: "opacity 0.4s" }}>
        <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${c.cardBorder}` }}>
          <div style={{ position: "absolute", inset: 0, background: c.card }} />
          {Skyline && <Skyline accent={c.accent} opacity={0.28} />}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${c.bg}44, ${c.bg}dd)` }} />
          <div style={{ position: "relative", padding: "16px 24px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <button onClick={() => { setStage("grid"); setSelectedCity(null); }} style={{ background: "transparent", border: "none", color: c.accentLight, cursor: "pointer", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: c.bodyFont }}>← Cities</button>
            <span style={{ fontSize: "22px" }}>{c.emoji}</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "400", fontFamily: c.displayFont, lineHeight: 1 }}>{c.name}</h1>
              <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight, marginTop: "3px" }}>{c.state} · {c.vibe}</div>
            </div>
            <div style={{ display: "flex", marginLeft: "auto" }}>
              {["tips","ask"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "transparent", border: "none", borderBottom: activeTab === tab ? `2px solid ${c.accent}` : "2px solid transparent", color: activeTab === tab ? c.textPrimary : c.textMuted, padding: "8px 14px", fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont }}>{tab === "tips" ? "Tips" : "Ask"}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "28px 24px 60px" }}>
          {activeTab === "tips" && (
            <div style={{ display: "grid", gap: "12px" }}>
              {c.tips.map((tip, i) => (
                <div key={i} style={{ background: c.card, border: `1px solid ${c.cardBorder}`, borderLeft: `3px solid ${c.accent}`, padding: "18px 22px", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(5px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "16px" }}>{tip.icon}</span>
                    <span style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight }}>{tip.category}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: c.textPrimary }}>{tip.tip}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "ask" && (
            <div>
              <div style={{ display: "grid", gap: "14px", marginBottom: "22px" }}>
                {c.questions.map((q, i) => (
                  <div key={i} style={{ background: c.card, border: `1px solid ${c.cardBorder}`, padding: "22px" }}>
                    <p style={{ margin: "0 0 12px", fontSize: "17px", fontStyle: "italic", color: c.textPrimary, fontFamily: c.displayFont }}>"{q.q}"</p>
                    <div style={{ width: "24px", height: "1px", background: `${c.accent}66`, margin: "0 0 12px" }} />
                    <p style={{ margin: "0 0 10px", fontSize: "14px", color: c.textMuted, lineHeight: "1.7" }}>{q.a}</p>
                    <div style={{ fontSize: "11px", color: c.textMuted, opacity: 0.55 }}>— {q.author} · {q.time}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: c.card, border: `1px dashed ${c.accent}44`, padding: "22px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c.accentLight, marginBottom: "12px" }}>Ask the Community</div>
                {qSubmitted ? <p style={{ color: c.textMuted, fontStyle: "italic", margin: 0 }}>✓ Submitted!</p> : (
                  <>
                    <textarea value={qInput} onChange={e => setQInput(e.target.value)} placeholder={`Ask about ${c.name}...`} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${c.cardBorder}`, color: c.textPrimary, padding: "14px", fontSize: "14px", fontFamily: c.bodyFont, resize: "vertical", minHeight: "80px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }} />
                    <button onClick={() => { if (qInput.trim()) setQSubmitted(true); }} style={{ background: c.accent, color: "#fff", border: "none", padding: "12px 28px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont }}>Submit →</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const filtered = CITIES.filter(c => {
    const q = search.toLowerCase();
    const ms = !q || c.name.toLowerCase().includes(q) || c.vibe.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
    const mt = activeTags.length === 0 || activeTags.every(t => c.tags.includes(t));
    const mc = !costFilter || c.costIndex === costFilter;
    return ms && mt && mc;
  });
  const scoredCities = filtered.map(c => ({ ...c, score: getScore(c) }));
  const maxScore = Math.max(...scoredCities.map(c => c.score));

  return (
    <div style={{ minHeight: "100vh", background: "#080E0D", fontFamily: "'Source Serif 4',Georgia,serif", color: "#E8F0EE", opacity: v ? 1 : 0, transition: "opacity 0.4s" }}>
      <div style={{ borderBottom: "1px solid rgba(46,125,107,0.2)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", background: "rgba(8,14,13,0.95)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", color: "rgba(93,184,164,0.7)", cursor: "pointer", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Source Serif 4',Georgia,serif" }}>← Back</button>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "400", letterSpacing: "-0.5px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Relo</h1>
          <span style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(232,240,238,0.26)" }}>City Explorer</span>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cities..." style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(46,125,107,0.25)", color: "#E8F0EE", padding: "9px 16px", fontSize: "14px", fontFamily: "'Source Serif 4',Georgia,serif", outline: "none", width: "180px" }} />
      </div>
      <div style={{ padding: "14px 24px 0", maxWidth: "960px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(232,240,238,0.26)" }}>Filter:</span>
        {ALL_TAGS.map(tag => <button key={tag} onClick={() => toggleTag(tag)} style={{ background: activeTags.includes(tag) ? "rgba(46,125,107,0.22)" : "rgba(255,255,255,0.04)", border: activeTags.includes(tag) ? "1px solid #2E7D6B" : "1px solid rgba(255,255,255,0.1)", color: activeTags.includes(tag) ? "#5DB8A4" : "rgba(232,240,238,0.42)", padding: "4px 11px", fontSize: "11px", cursor: "pointer", fontFamily: "'Source Serif 4',Georgia,serif", transition: "all 0.15s" }}>{tag}</button>)}
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.08)" }} />
        {["$","$$","$$$"].map(cc => <button key={cc} onClick={() => setCostFilter(costFilter === cc ? null : cc)} style={{ background: costFilter === cc ? "rgba(46,125,107,0.22)" : "rgba(255,255,255,0.04)", border: costFilter === cc ? "1px solid #2E7D6B" : "1px solid rgba(255,255,255,0.1)", color: costFilter === cc ? "#5DB8A4" : "rgba(232,240,238,0.42)", padding: "4px 11px", fontSize: "11px", cursor: "pointer", fontFamily: "'Source Serif 4',Georgia,serif" }}>{cc}</button>)}
        {(activeTags.length > 0 || costFilter) && <button onClick={() => { setActiveTags([]); setCostFilter(null); }} style={{ background: "transparent", border: "none", color: "rgba(232,240,238,0.28)", fontSize: "11px", cursor: "pointer", fontFamily: "'Source Serif 4',Georgia,serif" }}>✕ Clear</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(285px,1fr))", gap: "2px", padding: "16px 24px 60px", maxWidth: "960px", margin: "0 auto" }}>
        {scoredCities.map(cc => {
          const isBest = cc.score > 0 && cc.score === maxScore;
          const Skyline = SKYLINES[cc.id];
          return (
            <div key={cc.id} onClick={() => { setSelectedCity(cc.id); setStage("city"); setActiveTab("tips"); setQSubmitted(false); setQInput(""); }}
              onMouseEnter={() => setHoveredCard(cc.id)} onMouseLeave={() => setHoveredCard(null)}
              style={{ position: "relative", overflow: "hidden", cursor: "pointer", border: `1px solid ${cc.cardBorder}`, transition: "all 0.25s", minHeight: "255px", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: cc.bg }}
              onMouseEnterCapture={e => { e.currentTarget.style.borderColor = `${cc.accent}88`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 14px 42px ${cc.accent}28`; }}
              onMouseLeaveCapture={e => { e.currentTarget.style.borderColor = cc.cardBorder; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {Skyline && <Skyline accent={cc.accent} opacity={hoveredCard === cc.id ? 0.32 : 0.18} />}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${cc.bg} 40%, transparent 100%)` }} />
              {isBest && <div style={{ position: "absolute", top: "12px", right: "12px", background: "#2E7D6B", color: "#fff", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "3px 8px", fontFamily: "'Source Serif 4',Georgia,serif", zIndex: 2 }}>Best Match</div>}
              <div style={{ position: "relative", padding: "20px" }}>
                <div style={{ fontSize: "26px", marginBottom: "8px" }}>{cc.emoji}</div>
                <h2 style={{ margin: "0 0 4px", fontSize: "34px", fontWeight: "400", letterSpacing: "-0.5px", lineHeight: "0.92", fontFamily: cc.displayFont, color: cc.textPrimary }}>{cc.name}</h2>
                <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: cc.accentLight, margin: "6px 0 10px" }}>{cc.state} · {cc.vibe}</div>
                <p style={{ margin: "0 0 12px", fontSize: "12px", color: cc.textMuted, fontStyle: "italic", lineHeight: "1.55", fontFamily: cc.displayFont }}>"{cc.tagline}"</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {cc.tags.slice(0,3).map(t => <span key={t} style={{ fontSize: "10px", padding: "2px 8px", border: `1px solid ${cc.accent}33`, color: `${cc.accentLight}88` }}>{t}</span>)}
                  <span style={{ fontSize: "10px", padding: "2px 8px", border: `1px solid ${cc.accent}22`, color: `${cc.accentLight}66` }}>{cc.costIndex}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: cc.textMuted, opacity: 0.5, borderTop: `1px solid ${cc.cardBorder}`, paddingTop: "12px" }}>
                  <span>{cc.tips.length} tips</span><span>{cc.neighborhoods.length} neighborhoods</span><span style={{ color: cc.accentLight, opacity: 1 }}>Explore →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



// ── Google Maps loader ────────────────────────────────────────────────────────
const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve();
  if (window._gmapsPromise) return window._gmapsPromise;
  window._gmapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places`;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window._gmapsPromise;
}

// ── Neighborhood Google Map ──────────────────────────────────────────────────
const NeighborhoodGoogleMap = (props) => {
var {neighborhood, city, selectedPlace} = props;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const selectedMarkerRef = useRef(null);
  const outlineRef = useRef([]);
  const [mapError, setMapError] = useState(false);

  // Convert OSM geometry to Google Maps LatLng arrays
  function osmToLatLng(geometry) {
    if (!geometry) return [];
    if (geometry.type === "Polygon") {
      return geometry.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
    }
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates[0][0].map(([lng, lat]) => ({ lat, lng }));
    }
    return [];
  }

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        if (!mapRef.current) return;
        const center = { lat: neighborhood.lat, lng: neighborhood.lng };
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          styles: [
            { elementType:"geometry", stylers:[{ color:"#0d1117" }] },
            { elementType:"labels.text.fill", stylers:[{ color:"#9e9e9e" }] },
            { elementType:"labels.text.stroke", stylers:[{ color:"#1a1a2e" }] },
            { featureType:"road", elementType:"geometry", stylers:[{ color:"#1c1c2e" }] },
            { featureType:"road", elementType:"geometry.stroke", stylers:[{ color:"#212121" }] },
            { featureType:"road.highway", elementType:"geometry", stylers:[{ color:"#2c2c3e" }] },
            { featureType:"water", elementType:"geometry", stylers:[{ color:"#050810" }] },
            { featureType:"poi", elementType:"labels", stylers:[{ visibility:"off" }] },
            { featureType:"transit", stylers:[{ visibility:"off" }] },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
        });
        // Center pin
        new window.google.maps.Marker({
          position: center,
          map: mapInstance.current,
          title: neighborhood.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: city.accent,
            fillOpacity: 0.9,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        });

        // Fetch neighborhood outline from OpenStreetMap Nominatim
        const query = encodeURIComponent(`${neighborhood.name}, ${city.name}`);
        fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&polygon_geojson=1&limit=1&addressdetails=0`, {
          headers: { "Accept-Language": "en" }
        })
          .then(r => r.json())
          .then(results => {
            if (!results?.[0]?.geojson) return;
            const coords = osmToLatLng(results[0].geojson);
            if (coords.length < 3) return;
            // Clear old outline
            outlineRef.current.forEach(p => p.setMap(null));
            outlineRef.current = [];
            // Draw glowing outline
            const outline = new window.google.maps.Polygon({
              paths: coords,
              strokeColor: city.accent,
              strokeOpacity: 0.85,
              strokeWeight: 2.5,
              fillColor: city.accent,
              fillOpacity: 0.08,
              map: mapInstance.current,
            });
            outlineRef.current.push(outline);
            // Fit map to outline bounds
            const bounds = new window.google.maps.LatLngBounds();
            coords.forEach(p => bounds.extend(p));
            mapInstance.current.fitBounds(bounds);
          })
          .catch(() => {}); // silently fail if outline not found
      })
      .catch(() => setMapError(true));
  }, [neighborhood.lat, neighborhood.lng]);

  // Drop a pin when a place is selected via geocoding
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps) return;
    if (selectedMarkerRef.current) {
      try { selectedMarkerRef.current.setMap(null); } catch(e) {}
      selectedMarkerRef.current = null;
    }
    if (!selectedPlace) {
      mapInstance.current.setCenter({ lat: neighborhood.lat, lng: neighborhood.lng });
      mapInstance.current.setZoom(14);
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: `${selectedPlace.name}, ${neighborhood.name}, ${city.name}` }, (results, status) => {
      if (status !== "OK" || !results?.[0]?.geometry) return;
      const pos = results[0].geometry.location;
      mapInstance.current.setCenter(pos);
      mapInstance.current.setZoom(16);
      selectedMarkerRef.current = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: selectedPlace.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 13,
          fillColor: "#fff",
          fillOpacity: 1,
          strokeColor: city.accent,
          strokeWeight: 3,
        },
      });
      const iw = new window.google.maps.InfoWindow({
        content: "<div style=\"font-family:sans-serif;padding:4px;color:#111\"><strong>" + selectedPlace.name + "</strong></div>",
      });
      iw.open(mapInstance.current, selectedMarkerRef.current);
    });
  }, [selectedPlace]);

  if (mapError) return null;
  return (
    <div style={{ position:"relative", borderRadius:0, overflow:"hidden", border:`1px solid ${city.cardBorder}` }}>
      <div ref={mapRef} style={{ width:"100%", height:"320px" }} />
      <div style={{ position:"absolute", top:"10px", left:"12px", background:`${city.bg}dd`, border:`1px solid ${city.cardBorder}`, padding:"5px 10px", backdropFilter:"blur(8px)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.accentLight }}>
        {selectedPlace ? `📍 ${selectedPlace.name}` : `${neighborhood.name} · Live Map`}
      </div>
    </div>
  );
}

// ── Place Photo Card (Unsplash) ───────────────────────────────────────────────
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const photoCache = {};

const PlacePhoto = (props) => {
  var {placeName, placeType, neighborhood, city, style} = props;
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    setPhotoUrl(null);
    const cacheKey = `${placeName}-${city}`;
    if (photoCache[cacheKey]) { setPhotoUrl(photoCache[cacheKey]); return; }

    // Try Google Places first for real venue photos
    loadGoogleMaps().then(() => {
      const svc = new window.google.maps.places.PlacesService(document.createElement("div"));
      svc.findPlaceFromText(
        { query: `${placeName} ${neighborhood} ${city}`, fields: ["photos"] },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.[0]?.photos?.length) {
            const url = results[0].photos[0].getUrl({ maxWidth: 800, maxHeight: 500 });
            photoCache[cacheKey] = url;
            setPhotoUrl(url);
          } else {
            // Fallback: Unsplash with place name + type
            if (!UNSPLASH_KEY) return;
            const typeMap = { food:"restaurant food", bars:"bar cocktails", coffee:"cafe coffee", shopping:"boutique shop", gyms:"gym fitness", landmarks:"landmark", parks:"park nature" };
            const q = `${placeName} ${typeMap[placeType]||"place"} ${city}`;
            fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(q)}&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`)
              .then(r => r.json())
              .then(d => { if (d?.urls?.regular) { photoCache[cacheKey] = d.urls.regular; setPhotoUrl(d.urls.regular); } })
              .catch(() => {});
          }
        }
      );
    }).catch(() => {});
  }, [placeName, city]);

  return (
    <div style={style}>
      {photoUrl
        ? <img src={photoUrl} alt={placeName} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }} />
        : <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:"11px", color:"#555", letterSpacing:"1px", textTransform:"uppercase" }}>{placeType}</span>
          </div>
      }
    </div>
  );
}

// ── Place Detail Panel (inline expanded) ─────────────────────────────────────
const detailCache = {};

const PlaceDetailPanel = (props) => {
var {item, placeType, neighborhood, city, onClose} = props;
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);

  const cacheKey = `${item.name}-${city.name}`;

  useEffect(() => {
    // Fetch multiple Unsplash photos
    if (!UNSPLASH_KEY) return;
    const typeMap = {
      food:"restaurant interior food",bars:"bar interior cocktails",
      coffee:"coffee shop interior",shopping:"boutique shop interior",
      gyms:"gym fitness studio",landmarks:"landmark architecture exterior",parks:"park nature outdoor"
    };
    const q = `${typeMap[placeType]||"restaurant"} ${city.name}`;
    fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(q)}&count=4&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPhotos(d.map(p => p.urls.regular)); })
      .catch(() => {});
  }, [item.name]);

  useEffect(() => {
    if (detailCache[cacheKey]) { setDetail(detailCache[cacheKey]); setLoadingDetail(false); return; }
    const prompt = `You are a local expert. Generate a detailed profile for "${item.name}" (${placeType}) in ${neighborhood}, ${city.name}. Return JSON only, no markdown:
{
  "overview": "2-3 sentences vivid description",
  "hours": "e.g. Mon-Fri 8am-10pm, Sat-Sun 9am-11pm",
  "priceRange": "$, $$, $$$, or $$$$",
  "vibeRating": 1-10,
  "vibeDesc": "3-4 words e.g. lively, trendy, cozy",
  "website": "https://... (best guess or leave empty string)",
  "mustTry": "one item or experience to try",
  "tags": ["tag1","tag2","tag3"]
}`;
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY },
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500, messages:[{role:"user",content:prompt}] })
    })
    .then(r => r.json())
    .then(d => {
      const raw = (d.content||[]).map(i=>i.text||"").join("");
      const m = raw.match(new RegExp("\\{[\\s\\S]*\\}"));
      if (m) { const parsed = JSON.parse(m[0]); detailCache[cacheKey] = parsed; setDetail(parsed); }
      setLoadingDetail(false);
    })
    .catch(() => setLoadingDetail(false));
  }, [item.name]);

  return (
    <div style={{ background:city.bg, border:`1px solid ${city.accent}55`, borderLeft:`3px solid ${city.accent}`, marginTop:"2px", overflow:"hidden" }}>
      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div style={{ position:"relative", height:"220px", overflow:"hidden" }}>
          <img src={photos[activePhoto]} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.9 }} />
          {photos.length > 1 && (
            <div style={{ position:"absolute", bottom:"10px", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"6px" }}>
              {photos.map((_,i) => (
                <button key={i} onClick={() => setActivePhoto(i)}
                  style={{ width:"8px", height:"8px", borderRadius:"50%", border:"none", background: i===activePhoto?"#fff":city.accent+"88", cursor:"pointer", padding:0 }} />
              ))}
            </div>
          )}
          {photos.length > 1 && (
            <>
              <button onClick={() => setActivePhoto(p => (p-1+photos.length)%photos.length)}
                style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)", border:"none", color:"#fff", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" }}>‹</button>
              <button onClick={() => setActivePhoto(p => (p+1)%photos.length)}
                style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)", border:"none", color:"#fff", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" }}>›</button>
            </>
          )}
          <button onClick={onClose} style={{ position:"absolute", top:"10px", right:"10px", background:"rgba(0,0,0,0.6)", border:"none", color:"#fff", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"16px", lineHeight:"28px", textAlign:"center" }}>×</button>
        </div>
      )}
      {photos.length === 0 && (
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"8px 12px" }}>
          <button onClick={onClose} style={{ background:"transparent", border:`1px solid ${city.cardBorder}`, color:city.textMuted, width:"24px", height:"24px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" }}>×</button>
        </div>
      )}

      <div style={{ padding:"18px 20px" }}>
        {loadingDetail && <div style={{ fontSize:"12px", color:city.textMuted, fontStyle:"italic" }}>Loading details…</div>}
        {detail && (
          <>
            {/* Vibe + Price */}
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px", alignItems:"center" }}>
              <span style={{ fontSize:"11px", padding:"3px 10px", background:city.accent+"22", color:city.accent, border:`1px solid ${city.accent}44` }}>
                {"⭐".repeat(Math.round((detail.vibeRating||7)/2))} {detail.vibeRating}/10 vibe
              </span>
              <span style={{ fontSize:"11px", padding:"3px 10px", background:city.card, color:city.textMuted, border:`1px solid ${city.cardBorder}` }}>{detail.priceRange}</span>
              <span style={{ fontSize:"11px", color:city.textMuted, fontStyle:"italic" }}>{detail.vibeDesc}</span>
            </div>

            {/* Overview */}
            <p style={{ margin:"0 0 12px", fontSize:"13px", color:city.textMuted, lineHeight:"1.7" }}>{detail.overview}</p>

            {/* Hours + Must Try */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
              <div style={{ background:city.card, border:`1px solid ${city.cardBorder}`, padding:"10px 12px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>Hours</div>
                <div style={{ fontSize:"12px", color:city.textPrimary }}>{detail.hours}</div>
              </div>
              <div style={{ background:city.card, border:`1px solid ${city.cardBorder}`, padding:"10px 12px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>Must Try</div>
                <div style={{ fontSize:"12px", color:city.accentLight }}>{detail.mustTry}</div>
              </div>
            </div>

            {/* Tags */}
            {detail.tags?.length > 0 && (
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"12px" }}>
                {detail.tags.map((t,i) => <span key={i} style={{ fontSize:"10px", padding:"2px 8px", background:city.bg, border:`1px solid ${city.cardBorder}`, color:city.textMuted }}>#{t}</span>)}
              </div>
            )}

            {/* Website */}
            {detail.website && (
              <a href={detail.website} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"11px", padding:"7px 14px", background:city.card, border:`1px solid ${city.accent}55`, color:city.accent, textDecoration:"none", letterSpacing:"1.5px", textTransform:"uppercase" }}>
                🔗 Visit Website
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Jobs Tab ──────────────────────────────────────────────────────────────────
const JobsTab = (props) => {
var {jobs, city} = props;
  if (!jobs) return <div style={{ padding:"32px", textAlign:"center", color:city.textMuted, fontSize:"13px" }}>Job market data loading…</div>;
  const growthColor = { high:"#4caf50", medium:city.accent, low:"#f44336" };
  return (
    <div>
      {/* Summary + Stats */}
      <div style={{ background:city.card, border:`1px solid ${city.cardBorder}`, borderLeft:`3px solid ${city.accent}`, padding:"16px 20px", marginBottom:"16px" }}>
        <p style={{ margin:"0 0 12px", fontSize:"13px", color:city.textMuted, lineHeight:"1.7" }}>{jobs.jobMarketSummary}</p>
        <div style={{ display:"flex", gap:"20px", flexWrap:"wrap" }}>
          <div><div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"3px" }}>Avg Household Income</div><div style={{ fontSize:"16px", fontFamily:city.displayFont, color:city.accent }}>{jobs.avgHouseholdIncome}</div></div>
          <div><div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"3px" }}>Unemployment Rate</div><div style={{ fontSize:"16px", fontFamily:city.displayFont, color:city.accent }}>{jobs.unemploymentRate}</div></div>
        </div>
      </div>
      {/* Top Industries */}
      <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"10px" }}>Top Industries</div>
      <div style={{ display:"grid", gap:"8px", marginBottom:"20px" }}>
        {(jobs.topIndustries||[]).map((ind,i) => (
          <div key={i} style={{ background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px", fontFamily:city.displayFont, color:city.textPrimary, marginBottom:"3px" }}>{ind.name}</div>
              <div style={{ fontSize:"12px", color:city.textMuted }}>{ind.desc}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"15px", color:city.accent, fontFamily:city.displayFont }}>{ind.avgSalary}</div>
              <div style={{ fontSize:"9px", padding:"2px 7px", background:growthColor[ind.growth]+"22", color:growthColor[ind.growth], border:`1px solid ${growthColor[ind.growth]}44`, marginTop:"3px", display:"inline-block" }}>{ind.growth} growth</div>
            </div>
          </div>
        ))}
      </div>
      {/* Top Employers */}
      <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"10px" }}>Major Employers</div>
      <div style={{ display:"grid", gap:"8px" }}>
        {(jobs.topEmployers||[]).map((emp,i) => (
          <div key={i} style={{ background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px" }}>
            <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"4px" }}>
              <span style={{ fontSize:"14px", fontFamily:city.displayFont, color:city.textPrimary }}>{emp.name}</span>
              <span style={{ fontSize:"9px", padding:"2px 7px", border:`1px solid ${city.accent}33`, color:city.accentLight }}>{emp.type}</span>
            </div>
            <div style={{ fontSize:"12px", color:city.textMuted }}>{emp.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Schools Tab ───────────────────────────────────────────────────────────────
const SchoolsTab = (props) => {
var {schools, city} = props;
  if (!schools) return <div style={{ padding:"32px", textAlign:"center", color:city.textMuted, fontSize:"13px" }}>School data loading…</div>;
  const ratingColor = r => r >= 8 ? "#4caf50" : r >= 6 ? city.accent : "#f44336";
  const Section = ({ title, items, showRating }) => items?.length > 0 ? (
    <div style={{ marginBottom:"20px" }}>
      <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"10px" }}>{title}</div>
      <div style={{ display:"grid", gap:"8px" }}>
        {items.map((s,i) => (
          <div key={i} style={{ background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"10px" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px", fontFamily:city.displayFont, color:city.textPrimary, marginBottom:"3px" }}>{s.name}</div>
              <div style={{ fontSize:"11px", color:city.accentLight, marginBottom:"4px" }}>{s.grades}</div>
              <div style={{ fontSize:"12px", color:city.textMuted }}>{s.desc}</div>
            </div>
            {showRating && s.rating && (
              <div style={{ textAlign:"center", minWidth:"44px" }}>
                <div style={{ fontSize:"20px", fontFamily:city.displayFont, color:ratingColor(s.rating) }}>{s.rating}</div>
                <div style={{ fontSize:"9px", color:city.textMuted }}>/10</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
  return (
    <div>
      <div style={{ background:city.card, border:`1px solid ${city.cardBorder}`, borderLeft:`3px solid ${city.accent}`, padding:"14px 18px", marginBottom:"20px" }}>
        <p style={{ margin:0, fontSize:"13px", color:city.textMuted, lineHeight:"1.7" }}>{schools.summary}</p>
      </div>
      <Section title="Public Schools" items={schools.public} showRating={true} />
      <Section title="Private Schools" items={schools.private} showRating={false} />
      <Section title="Colleges & Universities" items={schools.universities} showRating={false} />
    </div>
  );
}

// ── Community Tab ─────────────────────────────────────────────────────────────
const CommunityTab = (props) => {
var {community, city} = props;
  if (!community) return <div style={{ padding:"32px", textAlign:"center", color:city.textMuted, fontSize:"13px" }}>Community data loading…</div>;
  return (
    <div>
      {/* Summary */}
      <div style={{ background:city.card, border:`1px solid ${city.cardBorder}`, borderLeft:`3px solid ${city.accent}`, padding:"14px 18px", marginBottom:"20px" }}>
        <p style={{ margin:0, fontSize:"13px", color:city.textMuted, lineHeight:"1.7" }}>{community.summary}</p>
      </div>
      {/* Online Communities */}
      <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"10px" }}>Online Communities</div>
      <div style={{ display:"grid", gap:"8px", marginBottom:"20px" }}>
        {community.subreddit && (
          <a href={`https://reddit.com/${community.subreddit}`} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:"12px", background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", textDecoration:"none", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=city.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=city.cardBorder}>
            <span style={{ fontSize:"20px" }}>🟠</span>
            <div>
              <div style={{ fontSize:"13px", color:city.textPrimary, fontFamily:city.displayFont }}>{community.subreddit}</div>
              <div style={{ fontSize:"11px", color:city.textMuted }}>Reddit community</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:"11px", color:city.accent }}>→</span>
          </a>
        )}
        {(community.facebook||[]).map((g,i) => (
          <a key={i} href={`https://www.facebook.com/groups/search/results/?q=${encodeURIComponent(g)}`} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:"12px", background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", textDecoration:"none", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=city.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=city.cardBorder}>
            <span style={{ fontSize:"20px" }}>🔵</span>
            <div>
              <div style={{ fontSize:"13px", color:city.textPrimary, fontFamily:city.displayFont }}>{g}</div>
              <div style={{ fontSize:"11px", color:city.textMuted }}>Facebook Group</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:"11px", color:city.accent }}>→</span>
          </a>
        ))}
        {(community.discord||[]).map((d,i) => (
          <a key={i} href={`https://discord.com/servers`} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:"12px", background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", textDecoration:"none", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=city.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=city.cardBorder}>
            <span style={{ fontSize:"20px" }}>💜</span>
            <div>
              <div style={{ fontSize:"13px", color:city.textPrimary, fontFamily:city.displayFont }}>{d}</div>
              <div style={{ fontSize:"11px", color:city.textMuted }}>Discord Server</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:"11px", color:city.accent }}>→</span>
          </a>
        ))}
        {community.nextdoor && (
          <a href="https://nextdoor.com" target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:"12px", background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", textDecoration:"none", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=city.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=city.cardBorder}>
            <span style={{ fontSize:"20px" }}>🟢</span>
            <div>
              <div style={{ fontSize:"13px", color:city.textPrimary, fontFamily:city.displayFont }}>Nextdoor</div>
              <div style={{ fontSize:"11px", color:city.textMuted }}>Local neighborhood network</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:"11px", color:city.accent }}>→</span>
          </a>
        )}
      </div>
      {/* Local Events */}
      {community.events?.length > 0 && (
        <>
          <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"10px" }}>Local Events & Gatherings</div>
          <div style={{ display:"grid", gap:"8px" }}>
            {community.events.map((ev,i) => (
              <div key={i} style={{ background:city.card, border:`1px solid ${city.cardBorder}`, padding:"13px 16px", display:"flex", gap:"12px", alignItems:"flex-start" }}>
                <span style={{ fontSize:"9px", padding:"3px 8px", background:city.accent+"22", color:city.accent, border:`1px solid ${city.accent}44`, whiteSpace:"nowrap", marginTop:"2px" }}>{ev.freq}</span>
                <div>
                  <div style={{ fontSize:"13px", fontFamily:city.displayFont, color:city.textPrimary, marginBottom:"3px" }}>{ev.name}</div>
                  <div style={{ fontSize:"12px", color:city.textMuted }}>{ev.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Cost of Living Calculator ─────────────────────────────────────────────────
const COL_DATA = {
  austin:    { rent1br:1850, groceries:110, transport:85, utilities:130, dining:55, tax:0 },
  boston:    { rent1br:2800, groceries:125, transport:90, utilities:140, dining:65, tax:5.0 },
  seattle:   { rent1br:2400, groceries:120, transport:80, utilities:110, dining:60, tax:0 },
  chicago:   { rent1br:1900, groceries:105, transport:105, utilities:120, dining:55, tax:4.95 },
  denver:    { rent1br:1950, groceries:112, transport:75, utilities:115, dining:55, tax:4.55 },
  nashville: { rent1br:1750, groceries:105, transport:80, utilities:125, dining:50, tax:0 },
  miami:     { rent1br:2600, groceries:118, transport:85, utilities:160, dining:60, tax:0 },
  nyc:       { rent1br:3800, groceries:135, transport:130, utilities:150, dining:75, tax:6.85 },
  la:        { rent1br:2700, groceries:122, transport:90, utilities:115, dining:65, tax:9.3 },
  portland:  { rent1br:1800, groceries:115, transport:75, utilities:105, dining:55, tax:0 },
  phoenix:   { rent1br:1550, groceries:100, transport:80, utilities:145, dining:48, tax:2.5 },
  atlanta:   { rent1br:1700, groceries:105, transport:78, utilities:130, dining:52, tax:5.75 },
};

const CostOfLivingTool = (props) => {
var {onClose, cities} = props;
  const cityIds = cities.map(c => c.id);
  const [cityA, setCityA] = useState(cityIds[0]);
  const [cityB, setCityB] = useState(cityIds[1]);
  const [salary, setSalary] = useState(75000);

  const cityAData = COL_DATA[cityA] || {};
  const cityBData = COL_DATA[cityB] || {};
  const cityAInfo = cities.find(c => c.id === cityA);
  const cityBInfo = cities.find(c => c.id === cityB);

  const monthlyA = Object.values(cityAData).slice(0,5).reduce((a,b) => a+b, 0);
  const monthlyB = Object.values(cityBData).slice(0,5).reduce((a,b) => a+b, 0);
  const diff = monthlyB - monthlyA;
  const pct = monthlyA > 0 ? Math.round((diff / monthlyA) * 100) : 0;

  const taxA = cityAData.tax || 0;
  const taxB = cityBData.tax || 0;
  const netA = Math.round(salary * (1 - taxA/100) / 12);
  const netB = Math.round(salary * (1 - taxB/100) / 12);
  const leftoverA = netA - monthlyA;
  const leftoverB = netB - monthlyB;

  const rows = [
    { label:"1BR Rent", keyA:"rent1br", keyB:"rent1br" },
    { label:"Groceries/mo", keyA:"groceries", keyB:"groceries" },
    { label:"Transport/mo", keyA:"transport", keyB:"transport" },
    { label:"Utilities/mo", keyA:"utilities", keyB:"utilities" },
    { label:"Dining out/wk", keyA:"dining", keyB:"dining" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={onClose}>
      <div style={{ background:"#0d1117", border:"1px solid #2a2a3a", maxWidth:"680px", width:"100%", maxHeight:"90vh", overflowY:"auto", padding:"28px" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <div>
            <div style={{ fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"4px" }}>Cost of Living</div>
            <div style={{ fontSize:"22px", fontFamily:"Georgia, serif", color:"#fff" }}>City Comparison</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.5)", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"16px" }}>×</button>
        </div>

        {/* City Pickers */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:"12px", alignItems:"center", marginBottom:"20px" }}>
          <select value={cityA} onChange={e => setCityA(e.target.value)} style={{ background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"10px 12px", fontFamily:"Georgia, serif", fontSize:"14px", cursor:"pointer" }}>
            {cities.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:"18px" }}>⇄</div>
          <select value={cityB} onChange={e => setCityB(e.target.value)} style={{ background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"10px 12px", fontFamily:"Georgia, serif", fontSize:"14px", cursor:"pointer" }}>
            {cities.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>

        {/* Salary Input */}
        <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"14px 16px", marginBottom:"20px" }}>
          <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"6px" }}>Your Annual Salary: ${salary.toLocaleString()}</div>
          <input type="range" min={30000} max={300000} step={5000} value={salary} onChange={e => setSalary(Number(e.target.value))} style={{ width:"100%", accentColor:"#5b8db8" }} />
        </div>

        {/* Comparison Table */}
        <div style={{ border:"1px solid #2a2a3a", marginBottom:"16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", background:"#111", padding:"10px 14px", borderBottom:"1px solid #2a2a3a" }}>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px" }}>Category</div>
            <div style={{ fontSize:"12px", color:cityAInfo?.accent||"#fff", textAlign:"center", fontFamily:"Georgia,serif" }}>{cityAInfo?.emoji} {cityAInfo?.name}</div>
            <div style={{ fontSize:"12px", color:cityBInfo?.accent||"#fff", textAlign:"center", fontFamily:"Georgia,serif" }}>{cityBInfo?.emoji} {cityBInfo?.name}</div>
          </div>
          {rows.map(row => (
            <div key={row.label} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"10px 14px", borderBottom:"1px solid #1a1a2a" }}>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>{row.label}</div>
              <div style={{ fontSize:"13px", color:"#fff", textAlign:"center" }}>${(cityAData[row.keyA]||0).toLocaleString()}</div>
              <div style={{ fontSize:"13px", color:"#fff", textAlign:"center" }}>${(cityBData[row.keyB]||0).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"12px 14px", background:"#0a0a12", borderBottom:"1px solid #2a2a3a" }}>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)", fontWeight:"bold" }}>Monthly Total</div>
            <div style={{ fontSize:"15px", color:cityAInfo?.accent||"#fff", textAlign:"center", fontFamily:"Georgia,serif" }}>${monthlyA.toLocaleString()}</div>
            <div style={{ fontSize:"15px", color:cityBInfo?.accent||"#fff", textAlign:"center", fontFamily:"Georgia,serif" }}>${monthlyB.toLocaleString()}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"10px 14px", borderBottom:"1px solid #1a1a2a" }}>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>State Income Tax</div>
            <div style={{ fontSize:"13px", color:"#fff", textAlign:"center" }}>{taxA === 0 ? "None" : `${taxA}%`}</div>
            <div style={{ fontSize:"13px", color:"#fff", textAlign:"center" }}>{taxB === 0 ? "None" : `${taxB}%`}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"10px 14px", borderBottom:"1px solid #1a1a2a" }}>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>Monthly take-home</div>
            <div style={{ fontSize:"13px", color:"#fff", textAlign:"center" }}>${netA.toLocaleString()}</div>
            <div style={{ fontSize:"13px", color:"#fff", textAlign:"center" }}>${netB.toLocaleString()}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"12px 14px", background:"#0a0a12" }}>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)", fontWeight:"bold" }}>Monthly Leftover</div>
            <div style={{ fontSize:"15px", color: leftoverA >= 0 ? "#4caf50" : "#f44336", textAlign:"center", fontFamily:"Georgia,serif" }}>${leftoverA.toLocaleString()}</div>
            <div style={{ fontSize:"15px", color: leftoverB >= 0 ? "#4caf50" : "#f44336", textAlign:"center", fontFamily:"Georgia,serif" }}>${leftoverB.toLocaleString()}</div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: diff > 0 ? "#f4433611" : "#4caf5011", border: diff > 0 ? "1px solid #f4433633" : "1px solid #4caf5033", padding:"14px 16px", fontSize:"13px", color:"rgba(255,255,255,0.8)", lineHeight:"1.6" }}>
          {cityBInfo?.name} is <strong style={{ color: diff > 0 ? "#f44336" : "#4caf50" }}>{Math.abs(pct)}% {diff > 0 ? "more" : "less"} expensive</strong> than {cityAInfo?.name} per month (${Math.abs(diff).toLocaleString()} difference). {leftoverB > leftoverA ? `You'd have $${(leftoverB-leftoverA).toLocaleString()} more per month in ${cityBInfo?.name}.` : `You'd have $${(leftoverA-leftoverB).toLocaleString()} less per month in ${cityBInfo?.name}.`}
        </div>
      </div>
    </div>
  );
}

// ── Apartments Tab ────────────────────────────────────────────────────────────
const ApartmentsTab = (props) => {
var {apartments, stats, neighborhood, city} = props;
  const [minBeds, setMinBeds] = useState(0);
  const [maxRent, setMaxRent] = useState(10000);
  const [tierFilter, setTierFilter] = useState("all");

  const rentNum = r => parseInt((r||"$0").replace(new RegExp("[^0-9]", "g"), "")) || 0;

  const filtered = (apartments||[]).filter(a => {
    if (minBeds > 0 && a.beds < minBeds) return false;
    if (rentNum(a.rent) > maxRent) return false;
    if (tierFilter !== "all" && a.tier !== tierFilter) return false;
    return true;
  });

  const tierColor = { budget: "#4caf50", mid: city.accent, luxury: "#c9a84c" };
  const tierLabel = { budget: "Budget", mid: "Mid-Range", luxury: "Luxury" };

  const zillow = `https://www.zillow.com/homes/${encodeURIComponent(neighborhood.name+", "+city.name)}_rb/`;
  const aptsCom = "https://www.apartments.com/" + neighborhood.name.toLowerCase().replace(new RegExp("\\s+", "g"), "-") + "-" + city.name.toLowerCase() + "/";

  return (
    <div>
      {/* Rent Stats Bar */}
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"20px" }}>
        {[
          { label:"Avg 1BR", value: stats?.avgRent1br || "–" },
          { label:"Avg 2BR", value: stats?.avgRent2br || "–" },
          { label:"Best For", value: stats?.bestFor || "–" },
        ].map(s => (
          <div key={s.label} style={{ flex:"1 1 120px", background:city.card, border:`1px solid ${city.cardBorder}`, padding:"14px 16px" }}>
            <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>{s.label}</div>
            <div style={{ fontSize:"16px", fontFamily:city.displayFont, color:city.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* External Links */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px", flexWrap:"wrap" }}>
        <a href={zillow} target="_blank" rel="noopener noreferrer"
          style={{ flex:"1 1 140px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"12px 16px", background:city.card, border:`1px solid ${city.accent}55`, color:city.accent, textDecoration:"none", fontSize:"12px", letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:city.bodyFont, transition:"background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background=city.accent+"22"}
          onMouseLeave={e => e.currentTarget.style.background=city.card}>
          🏠 Search Zillow
        </a>
        <a href={aptsCom} target="_blank" rel="noopener noreferrer"
          style={{ flex:"1 1 140px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"12px 16px", background:city.card, border:`1px solid ${city.accent}55`, color:city.accent, textDecoration:"none", fontSize:"12px", letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:city.bodyFont, transition:"background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background=city.accent+"22"}
          onMouseLeave={e => e.currentTarget.style.background=city.card}>
          🏢 Apartments.com
        </a>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"20px", padding:"14px 16px", background:city.card, border:`1px solid ${city.cardBorder}` }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"4px", flex:"1 1 100px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted }}>Min Beds</label>
          <select value={minBeds} onChange={e => setMinBeds(Number(e.target.value))}
            style={{ background:city.bg, border:`1px solid ${city.cardBorder}`, color:city.textPrimary, padding:"6px 8px", fontFamily:city.bodyFont, fontSize:"12px", cursor:"pointer" }}>
            <option value={0}>Any</option>
            <option value={0.5}>Studio+</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"4px", flex:"1 1 140px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted }}>Max Rent: ${maxRent >= 10000 ? "No limit" : maxRent.toLocaleString()}</label>
          <input type="range" min={500} max={10000} step={250} value={maxRent} onChange={e => setMaxRent(Number(e.target.value))}
            style={{ accentColor:city.accent, cursor:"pointer" }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"4px", flex:"1 1 100px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted }}>Tier</label>
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}
            style={{ background:city.bg, border:`1px solid ${city.cardBorder}`, color:city.textPrimary, padding:"6px 8px", fontFamily:city.bodyFont, fontSize:"12px", cursor:"pointer" }}>
            <option value="all">All</option>
            <option value="budget">Budget</option>
            <option value="mid">Mid-Range</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div style={{ display:"grid", gap:"9px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"32px", color:city.textMuted, fontSize:"13px" }}>No listings match your filters</div>
        )}
        {filtered.map((apt, i) => (
          <div key={i}
            onMouseEnter={e => e.currentTarget.style.transform="translateX(3px)"}
            onMouseLeave={e => e.currentTarget.style.transform="none"}
            style={{ background:city.card, border:`1px solid ${city.cardBorder}`, borderLeft:`3px solid ${tierColor[apt.tier]||city.accent}`, padding:"16px 18px", transition:"transform 0.15s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"8px", marginBottom:"6px" }}>
              <div>
                <div style={{ fontSize:"15px", fontFamily:city.displayFont, color:city.textPrimary, marginBottom:"2px" }}>{apt.name}</div>
                <div style={{ fontSize:"11px", color:city.textMuted }}>{apt.address}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"18px", fontFamily:city.displayFont, color:city.accent }}>{apt.rent}</div>
                <div style={{ fontSize:"9px", padding:"2px 8px", background:tierColor[apt.tier]+"22", color:tierColor[apt.tier]||city.accent, border:`1px solid ${tierColor[apt.tier]||city.accent}44`, display:"inline-block", marginTop:"2px" }}>{tierLabel[apt.tier]||apt.tier}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"16px", fontSize:"12px", color:city.textMuted, marginBottom:"8px" }}>
              <span>🛏 {apt.beds === 0 ? "Studio" : `${apt.beds} bed`}</span>
              <span>🚿 {apt.baths} bath</span>
              <span>📐 {apt.sqft?.toLocaleString()} sqft</span>
            </div>
            {apt.features?.length > 0 && (
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"10px" }}>
                {apt.features.map((f,j) => (
                  <span key={j} style={{ fontSize:"10px", padding:"2px 8px", background:city.bg, border:`1px solid ${city.cardBorder}`, color:city.textMuted }}>{f}</span>
                ))}
              </div>
            )}
            <button onClick={e => {
              e.stopPropagation();
              try {
                const saved = JSON.parse(localStorage.getItem("relo_apartments")||"[]");
                const id = `${apt.name}-${apt.address}`;
                if (!saved.find(s => s.id === id)) {
                  localStorage.setItem("relo_apartments", JSON.stringify([...saved, { ...apt, id }]));
                  e.currentTarget.textContent = "✓ Saved to planner";
                  e.currentTarget.style.color = "#4caf50";
                  e.currentTarget.style.borderColor = "#4caf50";
                }
              } catch {}
            }} style={{ background:"transparent", border:`1px solid ${city.cardBorder}`, color:city.textMuted, padding:"5px 12px", fontSize:"10px", cursor:"pointer", fontFamily:city.bodyFont, letterSpacing:"1px" }}>
              🔖 Save to My Move
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI-Powered Neighborhood Page ─────────────────────────────────────────────
const SECTION_ICONS = { food:"🍽",bars:"🍸",coffee:"☕",shopping:"🛍",gyms:"💪",landmarks:"📍",parks:"🌿",apartments:"🏠",jobs:"💼",schools:"🏫",community:"💬" };
const SECTION_LABELS = { food:"Food & Dining",bars:"Bars & Nightlife",coffee:"Coffee",shopping:"Shopping",gyms:"Fitness & Outdoors",landmarks:"Landmarks & Culture",parks:"Parks & Green Space",apartments:"Apartments",jobs:"Job Market",schools:"Schools",community:"Community" };

const NeighborhoodPage = (props) => {
var {neighborhood, city, onBack} = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [activeSection, setActiveSection] = useState("food");
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const v = useMount();
  const Skyline = SKYLINES[city.id];

  useEffect(() => {
    setLoading(true); setData(null); setError(null);
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "YOUR_ANTHROPIC_KEY_HERE") {
      setError("Missing API key — add VITE_ANTHROPIC_API_KEY to your .env file and rebuild.");
      setLoading(false);
      return;
    }
    const prompt = `You are a local expert on ${city.name}. Generate a neighborhood guide for "${neighborhood.name}" in JSON only (no markdown, no backticks).

Return this exact structure:
{
  "headline": "short punchy tagline (max 10 words)",
  "about": "2-3 sentence neighborhood overview",
  "stats": { "walkScore": 0-100, "transitScore": 0-100, "bikeScore": 0-100, "safetyScore": 0-100, "avgRent1br": "$X,XXX", "avgRent2br": "$X,XXX", "bestFor": "who lives here" },
  "food": [{"name":"...","type":"cuisine","desc":"1 sentence","must":true}],
  "bars": [{"name":"...","desc":"1 sentence"}],
  "coffee": [{"name":"...","desc":"1 sentence"}],
  "shopping": [{"name":"...","desc":"1 sentence"}],
  "gyms": [{"name":"...","desc":"1 sentence"}],
  "landmarks": [{"name":"...","desc":"1 sentence"}],
  "parks": [{"name":"...","desc":"1 sentence"}],
  "apartments": [{"name":"...","address":"...","beds":1,"baths":1,"sqft":750,"rent":"$X,XXX/mo","features":["feature1","feature2"],"tier":"budget"}],
  "jobs": {
    "topIndustries": [{"name":"...","desc":"1 sentence","avgSalary":"$XX,XXX","growth":"high/medium/low"}],
    "topEmployers": [{"name":"...","type":"...","desc":"1 sentence"}],
    "jobMarketSummary": "2 sentence overview of job market",
    "avgHouseholdIncome": "$XX,XXX",
    "unemploymentRate": "X.X%"
  },
  "schools": {
    "summary": "2 sentence overview of schools in this neighborhood",
    "public": [{"name":"...","grades":"K-5 / 6-8 / 9-12","rating":8,"desc":"1 sentence"}],
    "private": [{"name":"...","grades":"...","desc":"1 sentence"}],
    "universities": [{"name":"...","desc":"1 sentence"}]
  },
  "community": {
    "summary": "1-2 sentences about community vibe",
    "subreddit": "r/cityname",
    "facebook": ["Group Name 1","Group Name 2"],
    "discord": ["Server Name 1"],
    "nextdoor": true,
    "events": [{"name":"...","freq":"weekly/monthly/annual","desc":"1 sentence"}]
  }
}

Include 8 items per category. For apartments, generate 8 realistic listings with varied bedroom counts (studios, 1br, 2br, 3br) and price tiers (budget/mid/luxury). For jobs include 6 top industries and 5 major employers. For schools include 3-4 public, 2-3 private, and any nearby universities. For community include the real subreddit and 3 Facebook groups for ${city.name}. Mark the top 3 must-visit food spots with must:true.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 5000,
        messages: [{ role: "user", content: prompt }]
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.error) throw new Error(d.error.message || JSON.stringify(d.error));
      const raw = (d.content || []).map(i => i.text || "").join("");
      const jsonMatch = raw.match(new RegExp("\\{[\\s\\S]*\\}"));
      if (!jsonMatch) throw new Error("No JSON in response");
      setData(JSON.parse(jsonMatch[0]));
      setLoading(false);
    })
    .catch(err => {
      if (err.name === "AbortError") setError("Request timed out — try again.");
      else setError(err.message || "Something went wrong");
      setLoading(false);
    })
    .finally(() => clearTimeout(timeout));

    return () => { controller.abort(); clearTimeout(timeout); };
  }, [neighborhood.name, city.id, retryKey]);

  const sections = data ? (() => {
    const core = ["food","apartments","bars","coffee","shopping","gyms","landmarks","parks"];
    const extra = ["jobs","schools","community"];
    return [...core.filter(s => s === "apartments" || data[s]?.length > 0), ...extra];
  })() : [];

  return (
    <div style={{ minHeight:"100vh", background:city.bg, fontFamily:city.bodyFont, color:city.textPrimary, opacity:v?1:0, transition:"opacity 0.5s" }}>
      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", minHeight:"220px", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
        <div style={{ position:"absolute", inset:0, background:city.card }} />
        {Skyline && <Skyline accent={city.accent} opacity={0.25} />}
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, ${city.bg}11, ${city.bg}ee)` }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"14px 24px", display:"flex", alignItems:"center", gap:"12px", zIndex:10 }}>
          <button onClick={onBack} style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${city.cardBorder}`, color:city.accentLight, cursor:"pointer", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", fontFamily:city.bodyFont, padding:"7px 14px", backdropFilter:"blur(8px)" }}>← {city.name}</button>
        </div>
        <div style={{ position:"relative", padding:"28px 32px 24px" }}>
          <div style={{ display:"flex", gap:"6px", marginBottom:"8px", flexWrap:"wrap" }}>
            {(neighborhood.tags||[]).map(t => <span key={t} style={{ fontSize:"9px", padding:"2px 9px", border:`1px solid ${city.accent}55`, color:city.accentLight }}>{t}</span>)}
            <span style={{ fontSize:"9px", padding:"2px 9px", border:`1px solid ${city.accent}33`, color:city.accentLight, opacity:0.6 }}>{neighborhood.cost} · {neighborhood.pace} pace</span>
          </div>
          <h1 style={{ fontSize:"clamp(30px,5vw,52px)", fontWeight:"400", margin:"0 0 6px", fontFamily:city.displayFont, letterSpacing:"-1px", lineHeight:1 }}>{neighborhood.name}</h1>
          {data && <p style={{ fontSize:"14px", color:city.accentLight, fontStyle:"italic", margin:"0 0 10px" }}>{data.headline}</p>}
          {data && <p style={{ fontSize:"13px", color:city.textMuted, lineHeight:"1.75", maxWidth:"680px", margin:0 }}>{data.about}</p>}
          {loading && <p style={{ fontSize:"13px", color:city.textMuted, fontStyle:"italic" }}>Curating your neighborhood guide…</p>}
        </div>
      </div>

      {/* Stats bar */}
      {data?.stats && (
        <div style={{ background:city.card, borderTop:`1px solid ${city.cardBorder}`, borderBottom:`1px solid ${city.cardBorder}`, padding:"14px 32px", display:"flex", gap:"28px", overflowX:"auto", flexWrap:"wrap" }}>
          {[
            {l:"Walk Score",v:data.stats.walkScore,max:100},
            {l:"Transit",v:data.stats.transitScore,max:100},
            {l:"Bike Score",v:data.stats.bikeScore,max:100},
            {l:"Safety Score",v:data.stats.safetyScore,max:100,safety:true},
            {l:"1BR Rent",v:data.stats.avgRent1br},
            {l:"2BR Rent",v:data.stats.avgRent2br}
          ].map(s => {
            const safetyColor = s.safety ? (s.v >= 75 ? "#4caf50" : s.v >= 50 ? "#ff9800" : "#f44336") : city.accent;
            return (
              <div key={s.l} style={{ minWidth:"72px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>{s.l}</div>
                {s.max
                  ? <div>
                      <div style={{ fontSize:"18px", fontFamily:city.displayFont, color:safetyColor }}>{s.v}</div>
                      <div style={{ width:"52px", height:"3px", background:city.cardBorder, borderRadius:"2px", marginTop:"3px" }}>
                        <div style={{ height:"100%", width:String(((s.v||0)/s.max)*100) + "%", background:safetyColor, borderRadius:"2px" }} />
                      </div>
                    </div>
                  : <div style={{ fontSize:"16px", fontFamily:city.displayFont, color:city.accentLight }}>{s.v}</div>
                }
              </div>
            );
          })}
          {data.stats.bestFor && <div style={{ flex:1, minWidth:"130px" }}><div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>Best For</div><div style={{ fontSize:"12px", color:city.textMuted, fontStyle:"italic", lineHeight:1.4 }}>{data.stats.bestFor}</div></div>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", gap:"16px" }}>
          <div style={{ fontSize:"28px" }}>🔍</div>
          <div style={{ fontSize:"13px", color:city.textMuted, fontStyle:"italic" }}>Building your guide for {neighborhood.name}…</div>
          <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
          <div style={{ display:"flex", gap:"6px" }}>{[0,1,2].map(i => <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:city.accent, animationName:"pulse", animationDuration:"1.2s", animationTimingFunction:"ease-in-out", animationDelay:(i*0.2)+"s", animationIterationCount:"infinite" }} />)}</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding:"32px", textAlign:"center" }}>
          <p style={{ fontSize:"13px", color:city.textMuted, marginBottom:"12px" }}>Couldn't load guide — {error}</p>
          <button onClick={() => { setError(null); setLoading(true); setRetryKey(k => k + 1); }} style={{ background:city.accent, border:"none", color:"#fff", padding:"8px 20px", cursor:"pointer", fontFamily:city.bodyFont, fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase" }}>Try Again</button>
        </div>
      )}

      {/* Map */}
      {neighborhood.lat && (
        <div style={{ maxWidth:"860px", margin:"0 auto", padding:"20px 32px 0" }}>
          <NeighborhoodGoogleMap
            neighborhood={neighborhood}
            city={city}
            selectedPlace={selectedPlace}
          />
        </div>
      )}

      {/* Tabs */}
      {data && sections.length > 0 && (
        <>
          <div style={{ borderBottom:`1px solid ${city.cardBorder}`, position:"sticky", top:0, zIndex:15, background:`${city.bg}f8`, backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", overflowX:"auto", padding:"0 20px" }}>
              {sections.map(s => (
                <button key={s} onClick={() => { setActiveSection(s); setExpandedItem(null); setSelectedPlace(null); }}
                  style={{ background:"transparent", border:"none", borderBottom:activeSection===s?`2px solid ${city.accent}`:"2px solid transparent", color:activeSection===s?city.textPrimary:city.textMuted, padding:"13px 14px", fontSize:"11px", cursor:"pointer", fontFamily:city.bodyFont, whiteSpace:"nowrap", transition:"color 0.15s" }}>
                  {SECTION_ICONS[s]} {SECTION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ maxWidth:"860px", margin:"0 auto", padding:"24px 32px 80px" }}>
            {activeSection === "apartments" ? (
              <ApartmentsTab apartments={data.apartments} stats={data.stats} neighborhood={neighborhood} city={city} />
            ) : activeSection === "jobs" ? (
              <JobsTab jobs={data.jobs} city={city} />
            ) : activeSection === "schools" ? (
              <SchoolsTab schools={data.schools} city={city} />
            ) : activeSection === "community" ? (
              <CommunityTab community={data.community} city={city} />
            ) : (
              <div style={{ display:"grid", gap:"9px" }}>
                {(data[activeSection]||[]).map((item,i) => {
                  const isExpanded = expandedItem === `${activeSection}-${i}`;
                  return (
                    <div key={`${activeSection}-${i}`}>
                      <div
                        onClick={() => {
                          const key = `${activeSection}-${i}`;
                          if (isExpanded) { setExpandedItem(null); setSelectedPlace(null); }
                          else { setExpandedItem(key); setSelectedPlace(item); window.scrollTo({top:0,behavior:"smooth"}); }
                        }}
                        style={{ background:isExpanded?`${city.accent}11`:city.card, border:`1px solid ${isExpanded?city.accent+"66":item.must?city.accent+"55":city.cardBorder}`, borderLeft:`3px solid ${isExpanded?city.accent:item.must?city.accent:city.cardBorder}`, transition:"all 0.2s", position:"relative", overflow:"hidden", cursor:"pointer" }}
                        onMouseEnter={e => { if(!isExpanded) e.currentTarget.style.transform="translateX(3px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="none"; }}
                      >
                        <PlacePhoto
                          placeName={item.name}
                          placeType={activeSection}
                          neighborhood={neighborhood.name}
                          city={city.name}
                          style={{ width:"100%", height:"160px", background:city.card, overflow:"hidden", position:"relative" }}
                        />
                        <div style={{ padding:"14px 18px" }}>
                          {item.must && <div style={{ position:"absolute", top:"10px", right:"12px", fontSize:"9px", padding:"2px 7px", background:city.accent, color:"#fff", letterSpacing:"1.5px", textTransform:"uppercase", zIndex:2 }}>Must Visit</div>}
                          <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:item.desc?"5px":0, justifyContent:"space-between" }}>
                            <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                              <span style={{ fontSize:"15px", fontFamily:city.displayFont, color:city.textPrimary }}>{item.name}</span>
                              {item.type && <span style={{ fontSize:"9px", padding:"2px 7px", border:`1px solid ${city.accent}33`, color:city.accentLight }}>{item.type}</span>}
                            </div>
                            <span style={{ fontSize:"12px", color:city.accent, opacity:0.8 }}>{isExpanded?"▲":"▼"}</span>
                          </div>
                          {item.desc && <p style={{ margin:0, fontSize:"13px", color:city.textMuted, lineHeight:"1.65" }}>{item.desc}</p>}
                        </div>
                      </div>
                      {isExpanded && (
                        <PlaceDetailPanel
                          item={item}
                          placeType={activeSection}
                          neighborhood={neighborhood.name}
                          city={city.name}
                          onClose={() => { setExpandedItem(null); setSelectedPlace(null); }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Relocation Dashboard ──────────────────────────────────────────────────────
const DEFAULT_CHECKLIST = [
  { id:"dl", category:"Legal", task:"Update driver's license", done:false },
  { id:"vote", category:"Legal", task:"Update voter registration", done:false },
  { id:"irs", category:"Legal", task:"Update address with IRS", done:false },
  { id:"ss", category:"Legal", task:"Update address with Social Security", done:false },
  { id:"bank", category:"Finance", task:"Update bank address", done:false },
  { id:"cc", category:"Finance", task:"Update credit card addresses", done:false },
  { id:"insure", category:"Finance", task:"Update insurance policies", done:false },
  { id:"employer", category:"Work", task:"Notify employer of new address", done:false },
  { id:"usps", category:"Moving", task:"Set up USPS mail forwarding", done:false },
  { id:"movers", category:"Moving", task:"Book moving company", done:false },
  { id:"car", category:"Moving", task:"Arrange car shipping (if needed)", done:false },
  { id:"storage", category:"Moving", task:"Book storage if needed", done:false },
  { id:"electric", category:"Utilities", task:"Set up electricity", done:false },
  { id:"gas", category:"Utilities", task:"Set up gas", done:false },
  { id:"internet", category:"Utilities", task:"Set up internet", done:false },
  { id:"water", category:"Utilities", task:"Set up water account", done:false },
  { id:"doctor", category:"Health", task:"Find new primary care doctor", done:false },
  { id:"dentist", category:"Health", task:"Find new dentist", done:false },
  { id:"prescriptions", category:"Health", task:"Transfer prescriptions", done:false },
  { id:"school", category:"Family", task:"Research/enroll in schools", done:false },
  { id:"pets", category:"Family", task:"Update pet microchip address", done:false },
];

const BUDGET_CATEGORIES = ["Moving Company","Car Shipping","First/Last Month Rent","Security Deposit","Flights","Temporary Housing","Storage","Furniture","Utilities Setup","Misc"];

function useLocalStorage(key, defaultVal) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : defaultVal; } catch { return defaultVal; }
  });
  const set = v => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}


// ── Vendor Suggestions Data ───────────────────────────────────────────────────
const VENDOR_SUGGESTIONS = {
  "Moving Company": [
    { name:"PODS", desc:"Portable containers — load at your pace, they drive it", best:"Long-distance, flexible timeline", rating:"4.4", url:"https://www.pods.com", price:"$$" },
    { name:"Two Men and a Truck", desc:"Local and long-distance full-service movers", best:"Full-service, hands-off moving", rating:"4.6", url:"https://www.twomenandatruck.com", price:"$$$" },
    { name:"U-Haul", desc:"Rent a truck and DIY your move", best:"Budget-conscious, short distance", rating:"4.0", url:"https://www.uhaul.com", price:"$" },
    { name:"Mayflower", desc:"One of the oldest, most trusted long-distance movers", best:"Cross-country, large homes", rating:"4.3", url:"https://www.mayflower.com", price:"$$$" },
    { name:"Allied Van Lines", desc:"National network with full packing services available", best:"Corporate relocation, full service", rating:"4.2", url:"https://www.allied.com", price:"$$$" },
    { name:"HireAHelper", desc:"Marketplace to find and compare local moving labor", best:"Comparing local movers quickly", rating:"4.5", url:"https://www.hireahelper.com", price:"$$" },
  ],
  "Car Shipping": [
    { name:"Montway Auto Transport", desc:"Top-rated broker with nationwide carrier network", best:"Best overall value and reliability", rating:"4.7", url:"https://www.montway.com", price:"$$" },
    { name:"Ship.Cars", desc:"Instant quotes and real-time tracking", best:"Fast booking, transparent pricing", rating:"4.5", url:"https://www.ship.cars", price:"$$" },
    { name:"AmeriFreight", desc:"Discount programs and gap coverage insurance", best:"Budget-friendly with insurance options", rating:"4.4", url:"https://www.amerifreight.net", price:"$" },
    { name:"uShip", desc:"Marketplace where carriers bid on your shipment", best:"Getting competitive quotes fast", rating:"4.3", url:"https://www.uship.com", price:"$" },
    { name:"Sherpa Auto Transport", desc:"Price lock guarantee — no surprise fees", best:"Peace of mind, locked pricing", rating:"4.6", url:"https://www.sherpaautotransport.com", price:"$$" },
  ],
  "Apartment / Broker": [
    { name:"Zillow", desc:"Largest rental listing database in the US", best:"Browsing verified listings with photos", rating:"4.5", url:"https://www.zillow.com", price:"Free" },
    { name:"Apartments.com", desc:"Detailed listings with virtual tours and reviews", best:"Comparing amenities side by side", rating:"4.4", url:"https://www.apartments.com", price:"Free" },
    { name:"Zumper", desc:"Fast application process, real-time availability", best:"Applying quickly in competitive markets", rating:"4.3", url:"https://www.zumper.com", price:"Free" },
    { name:"Furnished Finder", desc:"Furnished month-to-month rentals", best:"Short-term housing during transition", rating:"4.4", url:"https://www.furnishedfinder.com", price:"Free" },
    { name:"Compass", desc:"Tech-forward real estate brokerage", best:"Working with a dedicated agent", rating:"4.6", url:"https://www.compass.com", price:"Agent fee" },
  ],
  "Storage Unit": [
    { name:"Public Storage", desc:"Largest storage company in the US, locations everywhere", best:"Finding storage near your new home", rating:"4.2", url:"https://www.publicstorage.com", price:"$$" },
    { name:"Extra Space Storage", desc:"Climate-controlled options, strong security", best:"Climate-sensitive items, long-term", rating:"4.4", url:"https://www.extraspace.com", price:"$$" },
    { name:"CubeSmart", desc:"Flexible month-to-month with no long-term commitment", best:"Short-term storage flexibility", rating:"4.3", url:"https://www.cubesmart.com", price:"$$" },
    { name:"PODS Storage", desc:"Container delivered to you, stored at their facility", best:"Easy access during the move", rating:"4.4", url:"https://www.pods.com/storage", price:"$$" },
    { name:"Neighbor.com", desc:"Peer-to-peer storage in people's garages/homes", best:"Cheaper rates, neighborhood storage", rating:"4.3", url:"https://www.neighbor.com", price:"$" },
  ],
  "Internet / Utilities": [
    { name:"Google Fiber", desc:"Gigabit internet in select cities", best:"Fastest speeds where available", rating:"4.7", url:"https://fiber.google.com", price:"$$" },
    { name:"Xfinity", desc:"Widest national coverage for cable internet", best:"Most cities and neighborhoods", rating:"3.8", url:"https://www.xfinity.com", price:"$$" },
    { name:"AT&T Fiber", desc:"Fiber-optic speeds in major metros", best:"Reliable fiber in AT&T markets", rating:"4.2", url:"https://www.att.com/internet", price:"$$" },
    { name:"T-Mobile Home Internet", desc:"5G home internet, no contracts", best:"No-contract flexibility", rating:"4.1", url:"https://www.t-mobile.com/home-internet", price:"$" },
    { name:"HelloTech", desc:"Tech setup and smart home installation service", best:"Getting everything set up on day one", rating:"4.5", url:"https://www.hellotech.com", price:"$$" },
    { name:"Updater", desc:"All-in-one app to transfer utilities and services", best:"Managing all utility changes at once", rating:"4.3", url:"https://www.updater.com", price:"Free" },
  ],
  "Custom": [],
};

const RelocationDashboard = (props) => {
var {onBack, cities} = props;
  const [activeTab, setActiveTab] = useState("timeline");
  const [moveDate, setMoveDate] = useLocalStorage("relo_moveDate", "");
  const [moveCity, setMoveCity] = useLocalStorage("relo_moveCity", "");
  const [checklist, setChecklist] = useLocalStorage("relo_checklist", DEFAULT_CHECKLIST);
  const [savedNeighborhoods, setSavedNeighborhoods] = useLocalStorage("relo_neighborhoods", []);
  const [savedApartments, setSavedApartments] = useLocalStorage("relo_apartments", []);
  const [budget, setBudget] = useLocalStorage("relo_budget", { total: 10000, categories: [], expenses: [] });
  const [vendors, setVendors] = useLocalStorage("relo_vendors", []);
  const [newExpense, setNewExpense] = useState({ label:"", category:"", amount:"" });
  const [newTask, setNewTask] = useState("");

  const daysUntilMove = moveDate ? Math.ceil((new Date(moveDate) - new Date()) / (1000*60*60*24)) : null;
  const checkDone = checklist.filter(c => c.done).length;
  const activeCategories = (budget.categories||[]).filter(c => c.active);
  const totalBudget = activeCategories.reduce((a,b) => a+(b.limit||0), 0) || budget.total || 0;
  const totalSpent = (budget.expenses||[]).reduce((a,b) => a+(b.amount||0), 0);
  const remaining = totalBudget - totalSpent;

  const ALL_BUDGET_CATS = [
    { id:"moving", label:"Moving Company", icon:"🚚" },
    { id:"carship", label:"Car Shipping", icon:"🚗" },
    { id:"rent", label:"First/Last Month Rent", icon:"🏠" },
    { id:"deposit", label:"Security Deposit", icon:"🔑" },
    { id:"flights", label:"Flights", icon:"✈️" },
    { id:"temp", label:"Temporary Housing", icon:"🏨" },
    { id:"storage", label:"Storage Unit", icon:"📦" },
    { id:"furniture", label:"Furniture", icon:"🛋️" },
    { id:"utilities", label:"Utilities Setup", icon:"💡" },
    { id:"broker", label:"Broker Fee", icon:"🤝" },
    { id:"misc", label:"Miscellaneous", icon:"💸" },
  ];

  const initCategories = () => {
    if (!budget.categories?.length) {
      setBudget({ ...budget, categories: ALL_BUDGET_CATS.map(c => ({ ...c, active: false, limit: 0 })) });
    }
  };

  const toggleCategory = (id) => {
    const cats = (budget.categories||[]).map(c => c.id === id ? {...c, active: !c.active} : c);
    setBudget({ ...budget, categories: cats });
  };

  const setCategoryLimit = (id, limit) => {
    const cats = (budget.categories||[]).map(c => c.id === id ? {...c, limit: parseFloat(limit)||0} : c);
    setBudget({ ...budget, categories: cats });
  };

  const toggleCheck = id => setChecklist(checklist.map(c => c.id === id ? {...c, done:!c.done} : c));
  const addTask = () => {
    if (!newTask.trim()) return;
    setChecklist([...checklist, { id: Date.now().toString(), category:"Custom", task:newTask.trim(), done:false }]);
    setNewTask("");
  };
  const addExpense = () => {
    if (!newExpense.label || !newExpense.amount || !newExpense.category) return;
    setBudget({ ...budget, expenses: [...(budget.expenses||[]), { ...newExpense, amount: parseFloat(newExpense.amount), id: Date.now() }] });
    setNewExpense({ label:"", category:"", amount:"" });
  };
  const removeExpense = id => setBudget({ ...budget, expenses: (budget.expenses||[]).filter(e => e.id !== id) });
  const removeNeighborhood = name => setSavedNeighborhoods(savedNeighborhoods.filter(n => n.name !== name));
  const removeApartment = id => setSavedApartments(savedApartments.filter(a => a.id !== id));

  // Vendor helpers
  const VENDOR_TYPES = ["Moving Company","Car Shipping","Apartment / Broker","Storage Unit","Internet / Utilities","Custom"];
  const VENDOR_STATUSES = ["Comparing","Quoted","Booked","Confirmed","Cancelled"];
  const statusColor = { Comparing:"#5b8db8", Quoted:"#ff9800", Booked:"#9c27b0", Confirmed:"#4caf50", Cancelled:"#f44336" };
  const [newVendor, setNewVendor] = useState({ name:"", type:VENDOR_TYPES[0], quote:"", contact:"", notes:"", status:"Comparing" });
  const [showAddVendor, setShowAddVendor] = useState(false);
  const addVendor = () => {
    if (!newVendor.name) return;
    setVendors([...vendors, { ...newVendor, id: Date.now() }]);
    setNewVendor({ name:"", type:VENDOR_TYPES[0], quote:"", contact:"", notes:"", status:"Comparing" });
    setShowAddVendor(false);
  };
  const updateVendorStatus = (id, status) => setVendors(vendors.map(v => v.id === id ? {...v, status} : v));
  const removeVendor = id => setVendors(vendors.filter(v => v.id !== id));

  // Export budget summary
  const exportBudget = () => {
    const lines = [
      "RELO — Budget Summary",
      `Move to: ${moveCity || "TBD"}`,
      `Date: ${moveDate || "TBD"}`,
      "",
      "=== BUDGET CATEGORIES ===",
      ...activeCategories.map(c => {
        const spent = (budget.expenses||[]).filter(e => e.category === c.label).reduce((a,b) => a+b.amount, 0);
        return `${c.icon} ${c.label}: $${spent.toLocaleString()} / $${c.limit.toLocaleString()} limit`;
      }),
      "",
      `Total Spent: $${totalSpent.toLocaleString()}`,
      `Total Budget: $${totalBudget.toLocaleString()}`,
      `Remaining: $${remaining.toLocaleString()}`,
      "",
      "=== EXPENSES ===",
      ...(budget.expenses||[]).map(e => `${e.category} — ${e.label}: $${e.amount.toLocaleString()}`),
      "",
      "=== VENDORS ===",
      ...vendors.map(v => v.type + ": " + v.name + " | " + v.status + " | Quote: " + (v.quote || "NA") + " | " + (v.contact || ""))
    ].join("\n");
    const blob = new Blob([lines], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "relo-budget.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  // Timeline milestones based on move date
  const milestones = moveDate ? (() => {
    const d = new Date(moveDate);
    const weeks = (n) => { const x = new Date(d); x.setDate(x.getDate() - n*7); return x.toLocaleDateString("en-US",{month:"short",day:"numeric"}); };
    return [
      { label:"Research neighborhoods & apartments", date: weeks(12), done: daysUntilMove < 84 },
      { label:"Book movers / car shipping", date: weeks(8), done: daysUntilMove < 56 },
      { label:"Give notice at current place", date: weeks(6), done: daysUntilMove < 42 },
      { label:"Set up USPS mail forwarding", date: weeks(4), done: daysUntilMove < 28 },
      { label:"Transfer utilities & services", date: weeks(3), done: daysUntilMove < 21 },
      { label:"Pack non-essentials", date: weeks(2), done: daysUntilMove < 14 },
      { label:"Confirm all bookings", date: weeks(1), done: daysUntilMove < 7 },
      { label:"🎉 Move day!", date: new Date(moveDate).toLocaleDateString("en-US",{month:"short",day:"numeric"}), done: daysUntilMove <= 0 },
    ];
  })() : [];

  const tabs = [
    { id:"timeline", label:"🗓 Timeline" },
    { id:"checklist", label:"✅ Checklist" },
    { id:"neighborhoods", label:"🏘 Saved" },
    { id:"budget", label:"💰 Budget" },
    { id:"vendors", label:"🏢 Vendors" },
  ];

  const checklistByCategory = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div style={{ minHeight:"100vh", background:"#080810", color:"#fff", fontFamily:"Georgia,serif" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 24px 80px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"28px", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <button onClick={onBack} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", padding:"0 0 10px 0" }}>
              Back to Explore
            </button>
            <div style={{ fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"6px" }}>My Relocation</div>
            <div style={{ fontSize:"32px", color:"#fff" }}>{moveCity ? "Moving to " + moveCity : "Relocation Planner"}</div>
            {daysUntilMove !== null && (
              <div style={{ fontSize:"13px", color: daysUntilMove <= 7 ? "#f44336" : daysUntilMove <= 30 ? "#ff9800" : "#4caf50", marginTop:"6px" }}>
                {daysUntilMove <= 0 ? "Move day is here!" : daysUntilMove + " days until move"}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <select value={moveCity} onChange={e => setMoveCity(e.target.value)}
              style={{ background:"#111", border:"1px solid #2a2a3a", color: moveCity ? "#fff" : "rgba(255,255,255,0.4)", padding:"9px 12px", fontFamily:"Georgia,serif", fontSize:"12px", cursor:"pointer" }}>
              <option value="">Select city...</option>
              {cities.map(c => <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>)}
            </select>
            <input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)}
              style={{ background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"9px 12px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
          </div>
        </div>

        {/* Widget Grid or Detail View */}
        {!activeTab ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px" }}>

            {/* Countdown */}
            <div style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #5b8db8", padding:"20px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Move Countdown</div>
              {daysUntilMove !== null ? (
                <div>
                  <div style={{ fontSize:"42px", fontFamily:"Georgia,serif", color: daysUntilMove <= 7 ? "#f44336" : daysUntilMove <= 30 ? "#ff9800" : "#4caf50", lineHeight:1.1 }}>
                    {daysUntilMove <= 0 ? "Now!" : daysUntilMove}
                  </div>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", marginTop:"6px" }}>{daysUntilMove <= 0 ? "Move day!" : "days to go"}</div>
                </div>
              ) : <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"8px" }}>Set your move date above</div>}
            </div>

            {/* Checklist */}
            <div onClick={() => setActiveTab("checklist")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #4caf50", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Checklist</div>
              <div style={{ fontSize:"28px", fontFamily:"Georgia,serif", color:"#4caf50", lineHeight:1.1 }}>{checkDone}{"/"}{checklist.length}</div>
              <div style={{ marginTop:"10px", height:"5px", background:"#1a1a2a", borderRadius:"3px" }}>
                <div style={{ height:"100%", width: checklist.length > 0 ? Math.round((checkDone/checklist.length)*100) + "%" : "0%", background:"#4caf50", borderRadius:"3px" }} />
              </div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"6px" }}>{checklist.length - checkDone} remaining</div>
            </div>

            {/* Budget */}
            <div onClick={() => setActiveTab("budget")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #ff9800", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Budget</div>
              <div style={{ fontSize:"28px", fontFamily:"Georgia,serif", color: remaining >= 0 ? "#4caf50" : "#f44336", lineHeight:1.1 }}>${Math.abs(remaining).toLocaleString()}</div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginTop:"4px" }}>{remaining >= 0 ? "remaining" : "over budget"}</div>
              <div style={{ marginTop:"10px", height:"5px", background:"#1a1a2a", borderRadius:"3px" }}>
                <div style={{ height:"100%", width: totalBudget > 0 ? Math.min(100, Math.round((totalSpent/totalBudget)*100)) + "%" : "0%", background: remaining < 0 ? "#f44336" : "#ff9800", borderRadius:"3px" }} />
              </div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"6px" }}>${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}</div>
            </div>

            {/* Vendors */}
            <div onClick={() => setActiveTab("vendors")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #9c27b0", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Vendors</div>
              <div style={{ display:"flex", gap:"20px", marginTop:"4px" }}>
                <div>
                  <div style={{ fontSize:"28px", fontFamily:"Georgia,serif", color:"#4caf50", lineHeight:1.1 }}>{vendorsBooked}</div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"3px" }}>Booked</div>
                </div>
                <div>
                  <div style={{ fontSize:"28px", fontFamily:"Georgia,serif", color:"#ff9800", lineHeight:1.1 }}>{vendorsComparing}</div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"3px" }}>Comparing</div>
                </div>
                <div>
                  <div style={{ fontSize:"28px", fontFamily:"Georgia,serif", color:"rgba(255,255,255,0.4)", lineHeight:1.1 }}>{vendors.length}</div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"3px" }}>Total</div>
                </div>
              </div>
            </div>

            {/* Next Tasks */}
            <div onClick={() => setActiveTab("checklist")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #5b8db8", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Next Tasks</div>
              {nextTasks.length === 0 ? (
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"8px" }}>All tasks complete!</div>
              ) : (
                <div style={{ display:"grid", gap:"7px", marginTop:"4px" }}>
                  {nextTasks.map(t => (
                    <div key={t.id} onClick={e => { e.stopPropagation(); toggleCheck(t.id); }}
                      style={{ display:"flex", gap:"10px", alignItems:"center", cursor:"pointer" }}>
                      <div style={{ width:"14px", height:"14px", borderRadius:"3px", border:"1.5px solid #3a3a5a", flexShrink:0 }} />
                      <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)" }}>{t.task}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div onClick={() => setActiveTab("timeline")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #c49a2a", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Upcoming Milestones</div>
              {!moveDate ? (
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"8px" }}>Set move date to see milestones</div>
              ) : upcomingMilestones.length === 0 ? (
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"8px" }}>All milestones complete!</div>
              ) : (
                <div style={{ display:"grid", gap:"8px", marginTop:"4px" }}>
                  {upcomingMilestones.map((m,i) => (
                    <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#c49a2a", flexShrink:0, marginTop:"4px" }} />
                      <div>
                        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)" }}>{m.label}</div>
                        <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>{m.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Neighborhoods */}
            <div onClick={() => setActiveTab("neighborhoods")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #2e7d6b", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Saved Neighborhoods</div>
              <div style={{ fontSize:"32px", fontFamily:"Georgia,serif", color:"#5db8a4", lineHeight:1.1 }}>{savedNeighborhoods.length}</div>
              {savedNeighborhoods.length > 0 ? (
                <div style={{ marginTop:"8px", display:"flex", gap:"6px", flexWrap:"wrap" }}>
                  {savedNeighborhoods.slice(0,3).map(n => (
                    <span key={n.name} style={{ fontSize:"10px", padding:"2px 8px", background:"rgba(46,125,107,0.15)", border:"1px solid rgba(46,125,107,0.3)", color:"#5db8a4" }}>{n.name}</span>
                  ))}
                </div>
              ) : <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"6px" }}>Browse cities to save neighborhoods</div>}
            </div>

            {/* Saved Apartments */}
            <div onClick={() => setActiveTab("neighborhoods")} style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #d95f2b", padding:"20px", cursor:"pointer" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"8px" }}>Saved Apartments</div>
              <div style={{ fontSize:"32px", fontFamily:"Georgia,serif", color:"#f4a16a", lineHeight:1.1 }}>{savedApartments.length}</div>
              {savedApartments.length > 0 ? (
                <div style={{ marginTop:"8px", display:"grid", gap:"4px" }}>
                  {savedApartments.slice(0,2).map(a => (
                    <div key={a.id} style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>{a.name} · {a.rent}</div>
                  ))}
                </div>
              ) : <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"6px" }}>Browse apartments to save listings</div>}
            </div>

            {/* Quick Actions */}
            <div style={{ background:"#0d0f1a", border:"1px solid #1e2030", borderTop:"2px solid #5b8db8", padding:"20px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"12px" }}>Quick Actions</div>
              <div style={{ display:"grid", gap:"8px" }}>
                {[
                  { label:"Full Checklist", tab:"checklist" },
                  { label:"Budget & Expenses", tab:"budget" },
                  { label:"Manage Vendors", tab:"vendors" },
                  { label:"Move Timeline", tab:"timeline" },
                ].map(a => (
                  <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                    style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.6)", padding:"7px 12px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", textAlign:"left" }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div>
            <button onClick={() => setActiveTab(null)}
              style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.5)", padding:"7px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", marginBottom:"20px" }}>
              Back to Overview
            </button>
            <div style={{ display:"flex", gap:"0", overflowX:"auto", borderBottom:"1px solid #1a1a2a", marginBottom:"24px" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ background:"transparent", border:"none", borderBottom: activeTab === t.id ? "2px solid #5b8db8" : "2px solid transparent", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)", padding:"12px 18px", fontSize:"12px", cursor:"pointer", fontFamily:"Georgia,serif", whiteSpace:"nowrap" }}>
                  {t.label}
                </button>
              ))}
            </div>
          {/* ── Timeline ── */}
          {activeTab === "timeline" && (
            <div>
              {!moveDate ? (
                <div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,0.35)", fontSize:"13px" }}>Set your move date above to generate your timeline</div>
              ) : (
                <div style={{ position:"relative" }}>
                  <div style={{ position:"absolute", left:"13px", top:0, bottom:0, width:"2px", background:"#2a2a3a" }} />
                  {milestones.map((m,i) => (
                    <div key={i} style={{ display:"flex", gap:"16px", marginBottom:"16px", alignItems:"flex-start" }}>
                      <div style={{ width:"28px", height:"28px", borderRadius:"50%", background: m.done ? "#4caf50" : "#1a1a2e", border:"2px solid "+(m.done ? "#4caf50" : "#2a2a3a"), flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", zIndex:1 }}>
                        {m.done ? "✓" : ""}
                      </div>
                      <div style={{ background:"#111", border:"1px solid "+(m.done ? "#4caf5033" : "#2a2a3a"), padding:"12px 16px", flex:1 }}>
                        <div style={{ fontSize:"13px", color: m.done ? "rgba(255,255,255,0.5)" : "#fff", textDecoration: m.done ? "line-through" : "none", marginBottom:"3px" }}>{m.label}</div>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)" }}>{m.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Checklist ── */}
          {activeTab === "checklist" && (
            <div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
                <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key==="Enter" && addTask()}
                  placeholder="Add a custom task..."
                  style={{ flex:1, background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"8px 12px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                <button onClick={addTask} style={{ background:"#5b8db8", border:"none", color:"#fff", padding:"8px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"11px", letterSpacing:"1px" }}>Add</button>
              </div>
              <div style={{ marginBottom:"8px", fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>{checkDone} of {checklist.length} completed</div>
              <div style={{ height:"4px", background:"#1a1a2a", borderRadius:"2px", marginBottom:"20px" }}>
                <div style={{ height:"100%", width:((checkDone/checklist.length)*100)+"%", background:"#4caf50", borderRadius:"2px", transition:"width 0.3s" }} />
              </div>
              {Object.entries(checklistByCategory).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom:"20px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"8px" }}>{cat}</div>
                  <div style={{ display:"grid", gap:"6px" }}>
                    {items.map(item => (
                      <div key={item.id} onClick={() => toggleCheck(item.id)}
                        style={{ display:"flex", alignItems:"center", gap:"12px", background:"#111", border:"1px solid "+(item.done ? "#4caf5033" : "#2a2a3a"), padding:"10px 14px", cursor:"pointer", transition:"all 0.15s" }}>
                        <div style={{ width:"18px", height:"18px", borderRadius:"3px", border:"2px solid "+(item.done ? "#4caf50" : "#3a3a4a"), background: item.done ? "#4caf50" : "transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", color:"#fff" }}>
                          {item.done ? "✓" : ""}
                        </div>
                        <span style={{ fontSize:"13px", color: item.done ? "rgba(255,255,255,0.4)" : "#fff", textDecoration: item.done ? "line-through" : "none" }}>{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Saved Neighborhoods & Apartments ── */}
          {activeTab === "neighborhoods" && (
            <div>
              <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"12px" }}>Saved Neighborhoods</div>
              {savedNeighborhoods.length === 0 ? (
                <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"24px", textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"24px" }}>
                  No saved neighborhoods yet — browse a city and click the bookmark icon
                </div>
              ) : (
                <div style={{ display:"grid", gap:"8px", marginBottom:"24px" }}>
                  {savedNeighborhoods.map((n,i) => (
                    <div key={i} style={{ background:"#111", border:"1px solid #2a2a3a", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:"14px", color:"#fff", fontFamily:"Georgia,serif", marginBottom:"3px" }}>{n.name}</div>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>{n.city} · {n.vibe} · {n.cost}</div>
                      </div>
                      <button onClick={() => removeNeighborhood(n.name)} style={{ background:"transparent", border:"1px solid #3a3a4a", color:"rgba(255,255,255,0.4)", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"12px" }}>Saved Apartments</div>
              {savedApartments.length === 0 ? (
                <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"24px", textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:"13px" }}>
                  No saved apartments yet — browse the Apartments tab and click the bookmark icon
                </div>
              ) : (
                <div style={{ display:"grid", gap:"8px" }}>
                  {savedApartments.map((a,i) => (
                    <div key={i} style={{ background:"#111", border:"1px solid #2a2a3a", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:"14px", color:"#fff", fontFamily:"Georgia,serif", marginBottom:"3px" }}>{a.name}</div>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>{a.address} · {a.beds === 0 ? "Studio" : a.beds+"BR"} · {a.rent}</div>
                      </div>
                      <button onClick={() => removeApartment(a.id)} style={{ background:"transparent", border:"1px solid #3a3a4a", color:"rgba(255,255,255,0.4)", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Budget ── */}
          {activeTab === "budget" && (
            <div>
              {/* Step 1: Pick categories */}
              <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"16px", marginBottom:"16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>1. Pick your budget categories</div>
                  <button onClick={initCategories} style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.4)", padding:"3px 10px", fontSize:"10px", cursor:"pointer", fontFamily:"Georgia,serif" }}>Reset</button>
                </div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {(budget.categories?.length ? budget.categories : ALL_BUDGET_CATS.map(c=>({...c,active:false,limit:0}))).map(cat => (
                    <button key={cat.id} onClick={() => {
                      if (!budget.categories?.length) setBudget({...budget, categories: ALL_BUDGET_CATS.map(c=>({...c,active:false,limit:0}))});
                      else toggleCategory(cat.id);
                    }}
                      style={{ padding:"6px 12px", fontSize:"11px", cursor:"pointer", fontFamily:"Georgia,serif", border:"1px solid "+(cat.active?"#5b8db8":"#2a2a3a"), background: cat.active?"#5b8db822":"transparent", color: cat.active?"#5b8db8":"rgba(255,255,255,0.5)", transition:"all 0.15s" }}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Set limits */}
              {activeCategories.length > 0 && (
                <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"16px", marginBottom:"16px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"12px" }}>2. Set limits per category</div>
                  <div style={{ display:"grid", gap:"8px" }}>
                    {activeCategories.map(cat => {
                      const spent = (budget.expenses||[]).filter(e => e.category === cat.label).reduce((a,b) => a+b.amount, 0);
                      const pct = cat.limit > 0 ? Math.min(100, (spent/cat.limit)*100) : 0;
                      const overBudget = spent > cat.limit && cat.limit > 0;
                      return (
                        <div key={cat.id} style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap" }}>
                          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)", minWidth:"160px" }}>{cat.icon} {cat.label}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px" }}>$</span>
                            <input type="number" value={cat.limit||""} onChange={e => setCategoryLimit(cat.id, e.target.value)} placeholder="Limit"
                              style={{ width:"100px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"5px 8px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                          </div>
                          {cat.limit > 0 && (
                            <div style={{ flex:1, minWidth:"120px" }}>
                              <div style={{ height:"4px", background:"#1a1a2a", borderRadius:"2px" }}>
                                <div style={{ height:"100%", width:(pct)+"%", background: overBudget?"#f44336":pct>80?"#ff9800":"#4caf50", borderRadius:"2px", transition:"width 0.3s" }} />
                              </div>
                              <div style={{ fontSize:"10px", color: overBudget?"#f44336":"rgba(255,255,255,0.35)", marginTop:"2px" }}>
                                ${spent.toLocaleString()} / ${cat.limit.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Visual chart */}
              {activeCategories.length > 0 && totalBudget > 0 && (
                <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"16px", marginBottom:"16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                    <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>3. Spending overview</div>
                    <button onClick={exportBudget} style={{ background:"#5b8db822", border:"1px solid #5b8db855", color:"#5b8db8", padding:"5px 12px", fontSize:"10px", cursor:"pointer", fontFamily:"Georgia,serif", letterSpacing:"1px" }}>⬇ Export</button>
                  </div>
                  {/* Overall bar */}
                  <div style={{ marginBottom:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"5px" }}>
                      <span style={{ color:"rgba(255,255,255,0.5)" }}>Total: ${totalSpent.toLocaleString()} spent</span>
                      <span style={{ color: remaining >= 0 ? "#4caf50" : "#f44336" }}>${Math.abs(remaining).toLocaleString()} {remaining >= 0 ? "remaining" : "over budget"}</span>
                    </div>
                    <div style={{ height:"8px", background:"#1a1a2a", borderRadius:"4px" }}>
                      <div style={{ height:"100%", width:(Math.min(100,(totalSpent/totalBudget)*100))+"%", background: remaining<0?"#f44336":remaining<totalBudget*0.2?"#ff9800":"#4caf50", borderRadius:"4px", transition:"width 0.3s" }} />
                    </div>
                  </div>
                  {/* Per-category bars */}
                  <div style={{ display:"grid", gap:"10px" }}>
                    {activeCategories.map(cat => {
                      const spent = (budget.expenses||[]).filter(e => e.category === cat.label).reduce((a,b) => a+b.amount, 0);
                      const pct = cat.limit > 0 ? Math.min(100,(spent/cat.limit)*100) : 0;
                      const barColor = spent > cat.limit && cat.limit > 0 ? "#f44336" : pct > 80 ? "#ff9800" : "#5b8db8";
                      return (
                        <div key={cat.id}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"3px" }}>
                            <span style={{ color:"rgba(255,255,255,0.6)" }}>{cat.icon} {cat.label}</span>
                            <span style={{ color:"rgba(255,255,255,0.4)" }}>${spent.toLocaleString()}{cat.limit>0?" / $"+(cat.limit.toLocaleString()):""}</span>
                          </div>
                          <div style={{ height:"5px", background:"#1a1a2a", borderRadius:"3px" }}>
                            <div style={{ height:"100%", width:(cat.limit>0?pct:0)+"%", background:barColor, borderRadius:"3px", transition:"width 0.3s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Add expenses */}
              <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"14px 16px", marginBottom:"16px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"10px" }}>4. Log an expense</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  <input value={newExpense.label} onChange={e => setNewExpense({...newExpense, label:e.target.value})} placeholder="Description"
                    style={{ flex:"2 1 120px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"7px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                  <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category:e.target.value})}
                    style={{ flex:"1 1 140px", background:"#0a0a14", border:"1px solid #2a2a3a", color: newExpense.category?"#fff":"rgba(255,255,255,0.4)", padding:"7px 8px", fontFamily:"Georgia,serif", fontSize:"12px", cursor:"pointer" }}>
                    <option value="">Select category...</option>
                    {activeCategories.map(c => <option key={c.id} value={c.label}>{c.icon} {c.label}</option>)}
                    <option value="Other">Other</option>
                  </select>
                  <input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount:e.target.value})} placeholder="Amount $"
                    style={{ flex:"1 1 80px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"7px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                  <button onClick={addExpense} style={{ background:"#5b8db8", border:"none", color:"#fff", padding:"7px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"11px", letterSpacing:"1px", whiteSpace:"nowrap" }}>+ Add</button>
                </div>
              </div>

              {/* Expense list */}
              {(budget.expenses||[]).length > 0 && (
                <div style={{ display:"grid", gap:"6px" }}>
                  {(budget.expenses||[]).map(e => (
                    <div key={e.id} style={{ display:"flex", alignItems:"center", gap:"12px", background:"#111", border:"1px solid #2a2a3a", padding:"10px 14px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"13px", color:"#fff" }}>{e.label}</div>
                        <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", marginTop:"2px" }}>{e.category}</div>
                      </div>
                      <div style={{ fontSize:"15px", color:"#fff", fontFamily:"Georgia,serif" }}>${(e.amount||0).toLocaleString()}</div>
                      <button onClick={() => removeExpense(e.id)} style={{ background:"transparent", border:"1px solid #3a3a4a", color:"rgba(255,255,255,0.4)", width:"24px", height:"24px", borderRadius:"50%", cursor:"pointer", fontSize:"12px" }}>×</button>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"flex-end", padding:"10px 14px", borderTop:"1px solid #2a2a3a" }}>
                    <span style={{ fontSize:"15px", color:"#fff", fontFamily:"Georgia,serif" }}>Total: ${totalSpent.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Vendors ── */}
          {activeTab === "vendors" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)" }}>Track quotes, contacts, and status for all your vendors</div>
                <button onClick={() => setShowAddVendor(!showAddVendor)}
                  style={{ background:"#5b8db8", border:"none", color:"#fff", padding:"8px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"11px", letterSpacing:"1px", whiteSpace:"nowrap" }}>
                  + Add Vendor
                </button>
              </div>

              {/* Add vendor form */}
              {showAddVendor && (
                <div style={{ background:"#111", border:"1px solid #5b8db833", padding:"16px", marginBottom:"16px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"12px" }}>New Vendor</div>
                  <div style={{ display:"grid", gap:"10px" }}>
                    <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                      <input value={newVendor.name} onChange={e => setNewVendor({...newVendor, name:e.target.value})} placeholder="Company name *"
                        style={{ flex:"2 1 160px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"8px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                      <select value={newVendor.type} onChange={e => setNewVendor({...newVendor, type:e.target.value})}
                        style={{ flex:"1 1 160px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"8px 10px", fontFamily:"Georgia,serif", fontSize:"12px", cursor:"pointer" }}>
                        {VENDOR_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                      <input value={newVendor.quote} onChange={e => setNewVendor({...newVendor, quote:e.target.value})} placeholder="Quote amount (e.g. $1,200)"
                        style={{ flex:"1 1 140px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"8px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                      <input value={newVendor.contact} onChange={e => setNewVendor({...newVendor, contact:e.target.value})} placeholder="Contact (phone or email)"
                        style={{ flex:"2 1 180px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"8px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                    </div>
                    <input value={newVendor.notes} onChange={e => setNewVendor({...newVendor, notes:e.target.value})} placeholder="Notes (optional)"
                      style={{ background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"8px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                    <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
                      <button onClick={() => setShowAddVendor(false)} style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.5)", padding:"7px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px" }}>Cancel</button>
                      <button onClick={addVendor} style={{ background:"#5b8db8", border:"none", color:"#fff", padding:"7px 20px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", letterSpacing:"1px" }}>Save Vendor</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor cards */}
              {vendors.length === 0 && !showAddVendor ? (
                <div style={{ textAlign:"center", padding:"32px", color:"rgba(255,255,255,0.35)", fontSize:"13px" }}>
                  No vendors yet — add your movers, car shippers, broker, and more
                </div>
              ) : (
                <div style={{ display:"grid", gap:"10px" }}>
                  {vendors.map(v => (
                    <div key={v.id} style={{ background:"#111", border:"1px solid "+(statusColor[v.status]||"#2a2a3a")+"33", borderLeft:"3px solid "+(statusColor[v.status]||"#2a2a3a"), padding:"16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"10px", marginBottom:"10px" }}>
                        <div>
                          <div style={{ fontSize:"15px", fontFamily:"Georgia,serif", color:"#fff", marginBottom:"3px" }}>{v.name}</div>
                          <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>{v.type}</div>
                        </div>
                        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                          <select value={v.status} onChange={e => updateVendorStatus(v.id, e.target.value)}
                            style={{ background:"#0a0a14", border:"1px solid "+(statusColor[v.status]||"#2a2a3a")+"44", color:statusColor[v.status]||"#fff", padding:"4px 8px", fontFamily:"Georgia,serif", fontSize:"11px", cursor:"pointer" }}>
                            {VENDOR_STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                          <button onClick={() => removeVendor(v.id)} style={{ background:"transparent", border:"1px solid #3a3a4a", color:"rgba(255,255,255,0.4)", width:"24px", height:"24px", borderRadius:"50%", cursor:"pointer", fontSize:"12px" }}>×</button>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:"20px", flexWrap:"wrap", fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>
                        {v.quote && <span>💰 {v.quote}</span>}
                        {v.contact && <span>📞 {v.contact}</span>}
                        {v.notes && <span>📝 {v.notes}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vendor Suggestions */}
              <div style={{ marginTop:"32px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"20px" }}>Suggested Services</div>
                {VENDOR_TYPES.filter(t => t !== "Custom").map(type => {
                  const suggestions = VENDOR_SUGGESTIONS[type] || [];
                  if (!suggestions.length) return null;
                  return (
                    <div key={type} style={{ marginBottom:"28px" }}>
                      <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.7)", fontFamily:"Georgia,serif", marginBottom:"12px", paddingBottom:"8px", borderBottom:"1px solid #1a1a2a" }}>{type}</div>
                      <div style={{ display:"grid", gap:"8px" }}>
                        {suggestions.map((s,i) => (
                          <div key={i} style={{ background:"#0d0f18", border:"1px solid #1e1e2e", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", flexWrap:"wrap" }}>
                            <div style={{ flex:1, minWidth:"200px" }}>
                              <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"4px" }}>
                                <span style={{ fontSize:"14px", color:"#fff", fontFamily:"Georgia,serif" }}>{s.name}</span>
                                <span style={{ fontSize:"10px", padding:"2px 7px", background:"#5b8db822", color:"#5b8db8", border:"1px solid #5b8db833" }}>{s.price}</span>
                                <span style={{ fontSize:"10px", color:"#ff9800" }}>★ {s.rating}</span>
                              </div>
                              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", marginBottom:"4px" }}>{s.desc}</div>
                              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)" }}>Best for: {s.best}</div>
                            </div>
                            <div style={{ display:"flex", gap:"8px", alignItems:"center", flexShrink:0 }}>
                              <a href={s.url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize:"11px", padding:"6px 14px", background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.6)", textDecoration:"none", letterSpacing:"1px", transition:"all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor="#5b8db8"; e.currentTarget.style.color="#5b8db8"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a3a"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
                                Visit →
                              </a>
                              <button onClick={() => {
                                setVendors([...vendors, { id:Date.now(), name:s.name, type, quote:"", contact:"", notes:s.best, status:"Comparing" }]);
                              }}
                                style={{ fontSize:"11px", padding:"6px 14px", background:"#5b8db822", border:"1px solid #5b8db855", color:"#5b8db8", cursor:"pointer", fontFamily:"Georgia,serif", letterSpacing:"1px", transition:"all 0.15s" }}
                                onMouseEnter={e => e.currentTarget.style.background="#5b8db844"}
                                onMouseLeave={e => e.currentTarget.style.background="#5b8db822"}>
                                + Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}


// ── Supabase ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

async function sbAuth(endpoint, body) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const res = await fetch(SUPABASE_URL + "/auth/v1/" + endpoint, {
    method: "POST",
    headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error || data.error_description) throw new Error(data.error_description || data.error || data.msg);
  return data;
}

async function getSession() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) return null;
    const token = localStorage.getItem("relo_token");
    if (!token) return null;
    const res = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) { localStorage.removeItem("relo_token"); return null; }
    const user = await res.json();
    return { user, token };
  } catch { return null; }
}

async function saveUserData(token, key, value) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    const userRes = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    const user = await userRes.json();
    const checkRes = await fetch(SUPABASE_URL + "/rest/v1/saved_data?user_id=eq." + user.id + "&key=eq." + encodeURIComponent(key) + "&select=id", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    const existing = await checkRes.json();
    const method = existing?.length > 0 ? "PATCH" : "POST";
    const url = existing?.length > 0
      ? SUPABASE_URL + "/rest/v1/saved_data?id=eq." + existing[0].id
      : SUPABASE_URL + "/rest/v1/saved_data";
    await fetch(url, {
      method,
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(existing?.length > 0 ? { value, updated_at: new Date().toISOString() } : { user_id: user.id, key, value })
    });
  } catch(e) { console.error("Save error:", e); }
}

async function loadAllUserData(token) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const userRes = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    const user = await userRes.json();
    const res = await fetch(SUPABASE_URL + "/rest/v1/saved_data?user_id=eq." + user.id + "&select=key,value", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    const rows = await res.json();
    return rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
  } catch { return null; }
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
const AuthModal = (props) => {
var {onAuth, onClose} = props;
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const endpoint = mode === "login" ? "token?grant_type=password" : "signup";
      const data = await sbAuth(endpoint, { email, password });
      if (!data) throw new Error("No response from server");
      // Both signup and login return an access_token now that email confirm is off
      const token = data.access_token;
      if (!token) throw new Error("Login failed — please try again");
      localStorage.setItem("relo_token", token);
      onAuth({ user: data.user, token });
    } catch(e) { setError(e.message || "Something went wrong"); }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={onClose}>
      <div style={{ background:"#0a0c14", border:"1px solid #2a2a3a", width:"100%", maxWidth:"380px", padding:"32px" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"4px" }}>Relo</div>
            <div style={{ fontSize:"22px", fontFamily:"Georgia,serif", color:"#fff" }}>{mode === "login" ? "Welcome back" : "Create account"}</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.5)", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"16px" }}>×</button>
        </div>

        {error && <div style={{ background:"#f4433622", border:"1px solid #f4433644", color:"#f44336", padding:"10px 14px", fontSize:"12px", marginBottom:"16px", borderRadius:"2px" }}>{error}</div>}
        {success && <div style={{ background:"#4caf5022", border:"1px solid #4caf5044", color:"#4caf50", padding:"10px 14px", fontSize:"12px", marginBottom:"16px", borderRadius:"2px" }}>{success}</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginBottom:"20px" }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"6px" }}>Email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && handle()}
              placeholder="you@example.com"
              style={{ width:"100%", background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"11px 12px", fontFamily:"Georgia,serif", fontSize:"13px", boxSizing:"border-box", outline:"none" }} />
          </div>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"6px" }}>Password</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handle()}
              placeholder="••••••••"
              style={{ width:"100%", background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"11px 12px", fontFamily:"Georgia,serif", fontSize:"13px", boxSizing:"border-box", outline:"none" }} />
          </div>
        </div>

        <button onClick={handle} disabled={loading}
          style={{ width:"100%", background:"#5b8db8", border:"none", color:"#fff", padding:"13px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"13px", letterSpacing:"2px", textTransform:"uppercase", opacity:loading?0.7:1 }}>
          {loading ? "..." : mode === "login" ? "Log In" : "Create Account & Sign In"}
        </button>

        <div style={{ textAlign:"center", marginTop:"16px", fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode==="login"?"signup":"login"); setError(""); setSuccess(""); }}
            style={{ background:"transparent", border:"none", color:"#5b8db8", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", textDecoration:"underline" }}>
            {mode === "login" ? "Sign up free" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Global Nav Bar ────────────────────────────────────────────────────────────
const NavBar = (props) => {
var {onShowDashboard, onShowCoL} = props;
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    getSession().then(s => setSession(s));
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAuth = (s) => { setSession(s); setShowAuth(false); };
  const handleLogout = () => { localStorage.removeItem("relo_token"); setSession(null); setShowDropdown(false); };
  const initials = session?.user?.email ? session.user.email[0].toUpperCase() : "?";

  return (
    <>
      {showAuth && <AuthModal onAuth={handleAuth} onClose={() => setShowAuth(false)} />}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:"52px", background:"rgba(8,8,16,0.85)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div style={{ fontFamily:"Georgia,serif", fontSize:"18px", color:"#fff", letterSpacing:"2px", fontWeight:"400" }}>
          relo<span style={{ color:"#5b8db8" }}>.</span>
        </div>

        {/* Center links */}
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          <button onClick={onShowDashboard}
            style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.6)", padding:"6px 14px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", letterSpacing:"1px", transition:"color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color="#fff"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}>
            📋 My Move
          </button>
          <button onClick={onShowCoL}
            style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.6)", padding:"6px 14px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", letterSpacing:"1px", transition:"color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color="#fff"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}>
            💰 Cost of Living
          </button>
        </div>

        {/* Right — auth */}
        <div style={{ position:"relative" }} ref={dropdownRef}>
          {!session ? (
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={() => setShowAuth(true)}
                style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", padding:"6px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", letterSpacing:"1px", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.5)"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}>
                Log in
              </button>
              <button onClick={() => setShowAuth(true)}
                style={{ background:"#5b8db8", border:"none", color:"#fff", padding:"6px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"12px", letterSpacing:"1px", transition:"opacity 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                Sign up
              </button>
            </div>
          ) : (
            <button onClick={() => setShowDropdown(!showDropdown)}
              style={{ width:"36px", height:"36px", borderRadius:"50%", background:"#5b8db8", border:"2px solid #5b8db888", color:"#fff", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"14px", fontWeight:"bold", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {initials}
            </button>
          )}

          {/* Profile Dropdown */}
          {showDropdown && session && (
            <div style={{ position:"absolute", top:"44px", right:0, background:"#0d1117", border:"1px solid #2a2a3a", minWidth:"200px", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", zIndex:200 }}>
              <div style={{ padding:"14px 16px", borderBottom:"1px solid #2a2a3a" }}>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", marginBottom:"2px" }}>Signed in as</div>
                <div style={{ fontSize:"13px", color:"#fff", fontFamily:"Georgia,serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{session.user.email}</div>
              </div>
              <button onClick={() => { setShowDropdown(false); onShowDashboard(); }}
                style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1px solid #1a1a2a", color:"rgba(255,255,255,0.7)", padding:"12px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"13px", textAlign:"left", display:"flex", alignItems:"center", gap:"10px" }}
                onMouseEnter={e => e.currentTarget.style.background="#1a1a2a"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                📋 My Move Dashboard
              </button>
              <button onClick={() => { setShowDropdown(false); onShowCoL(); }}
                style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1px solid #1a1a2a", color:"rgba(255,255,255,0.7)", padding:"12px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"13px", textAlign:"left", display:"flex", alignItems:"center", gap:"10px" }}
                onMouseEnter={e => e.currentTarget.style.background="#1a1a2a"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                💰 Cost of Living
              </button>
              <button onClick={handleLogout}
                style={{ width:"100%", background:"transparent", border:"none", color:"rgba(255,255,255,0.5)", padding:"12px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"13px", textAlign:"left", display:"flex", alignItems:"center", gap:"10px" }}
                onMouseEnter={e => e.currentTarget.style.background="#1a1a2a"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                ↩ Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("entry");
  const [showCoL, setShowCoL] = useState(false);
  return (
    <>
      <NavBar onShowDashboard={() => setScreen("dashboard")} onShowCoL={() => setShowCoL(true)} />
      {showCoL && <CostOfLivingTool onClose={() => setShowCoL(false)} cities={CITIES} />}
      <div style={{ paddingTop:"52px" }}>
        {screen === "entry" && <SplitEntry onKnow={() => setScreen("know")} onExplore={() => setScreen("explore")} />}
        {screen === "know" && <KnowPath onBack={() => setScreen("entry")} />}
        {screen === "explore" && <ExplorePath onBack={() => setScreen("entry")} />}
        {screen === "dashboard" && <RelocationDashboard onBack={() => setScreen("entry")} cities={CITIES} />}
      </div>
    </>
  );
}
