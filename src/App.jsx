import { useState, useEffect, useRef } from "react";

// ── Fonts loaded via index.html ──────────────────────────────────────────────

// ── SVG Skylines ──────────────────────────────────────────────────────────────
const SKYLINES = {
  austin: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <defs>
        <linearGradient id="sky-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Moon */}
      <circle cx="680" cy="60" r="28" fill={accent} opacity="0.25" />
      <circle cx="693" cy="53" r="22" fill="#1C0F08" />
      {/* Stars */}
      {[[50,40],[120,25],[200,55],[350,20],[500,45],[600,30],[720,70],[160,70],[440,60]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={accent} opacity="0.6" />
      ))}
      {/* Hills */}
      <ellipse cx="150" cy="300" rx="220" ry="80" fill={accent} opacity="0.06" />
      <ellipse cx="650" cy="300" rx="200" ry="70" fill={accent} opacity="0.05" />
      {/* Congress Ave Bridge */}
      <rect x="0" y="262" width="800" height="4" fill={accent} opacity="0.15" />
      {/* Texas Capitol dome */}
      <rect x="370" y="160" width="60" height="100" fill={accent} opacity="0.55" />
      <rect x="350" y="185" width="100" height="75" fill={accent} opacity="0.45" />
      <ellipse cx="400" cy="160" rx="32" ry="45" fill={accent} opacity="0.55" />
      <ellipse cx="400" cy="132" rx="12" ry="18" fill={accent} opacity="0.6" />
      <rect x="397" y="115" width="6" height="20" fill={accent} opacity="0.7" />
      {/* Downtown towers */}
      <rect x="80" y="200" width="35" height="62" fill={accent} opacity="0.4" />
      <rect x="85" y="195" width="25" height="10" fill={accent} opacity="0.4" />
      <rect x="130" y="210" width="28" height="52" fill={accent} opacity="0.35" />
      <rect x="170" y="195" width="40" height="67" fill={accent} opacity="0.45" />
      <rect x="175" y="188" width="30" height="10" fill={accent} opacity="0.45" />
      <rect x="225" y="220" width="32" height="42" fill={accent} opacity="0.3" />
      <rect x="270" y="205" width="22" height="57" fill={accent} opacity="0.38" />
      <rect x="480" y="198" width="38" height="64" fill={accent} opacity="0.42" />
      <rect x="484" y="190" width="28" height="10" fill={accent} opacity="0.42" />
      <rect x="530" y="212" width="30" height="50" fill={accent} opacity="0.35" />
      <rect x="572" y="200" width="42" height="62" fill={accent} opacity="0.4" />
      <rect x="576" y="193" width="32" height="10" fill={accent} opacity="0.4" />
      <rect x="628" y="218" width="26" height="44" fill={accent} opacity="0.32" />
      <rect x="665" y="205" width="34" height="57" fill={accent} opacity="0.38" />
      <rect x="710" y="215" width="28" height="47" fill={accent} opacity="0.3" />
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
      {/* Music notes */}
      <text x="740" y="120" fontSize="18" fill={accent} opacity="0.25" fontFamily="serif">♪</text>
      <text x="30" y="100" fontSize="14" fill={accent} opacity="0.2" fontFamily="serif">♫</text>
    </svg>
  ),
  boston: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <defs>
        <linearGradient id="sky-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Overcast sky wash */}
      <rect x="0" y="0" width="800" height="200" fill={accent} opacity="0.06" />
      {/* Stars */}
      {[[80,30],[200,20],[320,45],[450,15],[580,35],[700,25],[140,55],[620,60]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill={accent} opacity="0.5" />
      ))}
      {/* Charles River */}
      <ellipse cx="400" cy="280" rx="420" ry="30" fill={accent} opacity="0.08" />
      {/* Hancock Tower (tall glass) */}
      <rect x="340" y="80" width="48" height="182" fill={accent} opacity="0.55" />
      <polygon points="364,80 340,90 388,90" fill={accent} opacity="0.65" />
      <rect x="344" y="85" width="8" height="170" fill={accent} opacity="0.15" />
      <rect x="356" y="85" width="8" height="170" fill={accent} opacity="0.15" />
      <rect x="368" y="85" width="8" height="170" fill={accent} opacity="0.15" />
      {/* Prudential Tower */}
      <rect x="420" y="110" width="42" height="152" fill={accent} opacity="0.5" />
      <rect x="428" y="100" width="26" height="15" fill={accent} opacity="0.5" />
      <rect x="435" y="90" width="12" height="14" fill={accent} opacity="0.55" />
      <rect x="440" y="80" width="2" height="14" fill={accent} opacity="0.65" />
      {/* Old State House / historic spire */}
      <rect x="220" y="175" width="50" height="87" fill={accent} opacity="0.42" />
      <polygon points="245,145 220,180 270,180" fill={accent} opacity="0.48" />
      <rect x="242" y="130" width="6" height="18" fill={accent} opacity="0.55" />
      {/* Trinity Church towers */}
      <rect x="130" y="190" width="30" height="72" fill={accent} opacity="0.38" />
      <polygon points="145,168 130,195 160,195" fill={accent} opacity="0.44" />
      <rect x="170" y="195" width="30" height="67" fill={accent} opacity="0.38" />
      <polygon points="185,173 170,200 200,200" fill={accent} opacity="0.44" />
      {/* Other downtown */}
      <rect x="510" y="195" width="35" height="67" fill={accent} opacity="0.38" />
      <rect x="558" y="185" width="28" height="77" fill={accent} opacity="0.42" />
      <rect x="600" y="200" width="40" height="62" fill={accent} opacity="0.35" />
      <rect x="655" y="190" width="32" height="72" fill={accent} opacity="0.4" />
      <rect x="700" y="205" width="28" height="57" fill={accent} opacity="0.35" />
      <rect x="60" y="205" width="36" height="57" fill={accent} opacity="0.32" />
      {/* Ground */}
      <rect x="0" y="258" width="800" height="42" fill={accent} opacity="0.1" />
    </svg>
  ),
  seattle: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <defs>
        <linearGradient id="sky-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Misty sky */}
      <rect x="0" y="0" width="800" height="300" fill="url(#sky-s)" />
      {/* Mt. Rainier silhouette far back */}
      <polygon points="600,50 520,220 680,220" fill={accent} opacity="0.1" />
      <polygon points="600,70 545,220 655,220" fill={accent} opacity="0.07" />
      {/* Puget Sound water */}
      <ellipse cx="400" cy="290" rx="500" ry="40" fill={accent} opacity="0.1" />
      {/* Space Needle */}
      <rect x="376" y="175" width="12" height="87" fill={accent} opacity="0.65" />
      <ellipse cx="382" cy="160" rx="38" ry="10" fill={accent} opacity="0.65" />
      <ellipse cx="382" cy="155" rx="26" ry="18" fill={accent} opacity="0.6" />
      <rect x="380" y="100" width="4" height="58" fill={accent} opacity="0.7" />
      <circle cx="382" cy="98" r="5" fill={accent} opacity="0.8" />
      {/* Needle legs */}
      <line x1="382" y1="172" x2="355" y2="220" stroke={accent} strokeWidth="2" opacity="0.6" />
      <line x1="382" y1="172" x2="409" y2="220" stroke={accent} strokeWidth="2" opacity="0.6" />
      <line x1="382" y1="172" x2="382" y2="225" stroke={accent} strokeWidth="2" opacity="0.6" />
      {/* Columbia Center */}
      <rect x="470" y="110" width="44" height="152" fill={accent} opacity="0.52" />
      <polygon points="492,98 470,118 514,118" fill={accent} opacity="0.56" />
      <rect x="475" y="115" width="8" height="140" fill={accent} opacity="0.12" />
      <rect x="489" y="115" width="8" height="140" fill={accent} opacity="0.12" />
      {/* 1201 Third */}
      <rect x="524" y="148" width="36" height="114" fill={accent} opacity="0.45" />
      <polygon points="542,136 524,152 560,152" fill={accent} opacity="0.5" />
      {/* Other towers */}
      <rect x="570" y="168" width="32" height="94" fill={accent} opacity="0.4" />
      <rect x="614" y="178" width="28" height="84" fill={accent} opacity="0.36" />
      <rect x="655" y="185" width="36" height="77" fill={accent} opacity="0.4" />
      <rect x="703" y="195" width="30" height="67" fill={accent} opacity="0.32" />
      <rect x="270" y="188" width="36" height="74" fill={accent} opacity="0.38" />
      <rect x="220" y="198" width="30" height="64" fill={accent} opacity="0.34" />
      <rect x="170" y="205" width="34" height="57" fill={accent} opacity="0.3" />
      <rect x="120" y="198" width="28" height="64" fill={accent} opacity="0.34" />
      <rect x="75" y="210" width="30" height="52" fill={accent} opacity="0.28" />
      {/* Ground */}
      <rect x="0" y="260" width="800" height="40" fill={accent} opacity="0.1" />
      {/* Rain streaks */}
      {Array.from({length:18},(_,i) => (
        <line key={i} x1={40+i*42} y1={0} x2={36+i*42} y2={30} stroke={accent} strokeWidth="0.8" opacity="0.12" />
      ))}
    </svg>
  ),
  chicago: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <defs>
        <linearGradient id="sky-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="300" fill="url(#sky-c)" />
      {/* Lake Michigan */}
      <rect x="0" y="255" width="800" height="45" fill={accent} opacity="0.1" />
      {/* Willis Tower (Sears) */}
      <rect x="310" y="60" width="52" height="202" fill={accent} opacity="0.6" />
      <rect x="318" y="60" width="18" height="160" fill={accent} opacity="0.55" />
      <rect x="338" y="60" width="18" height="145" fill={accent} opacity="0.55" />
      <rect x="310" y="58" width="10" height="5" fill={accent} opacity="0.7" />
      <rect x="352" y="58" width="10" height="5" fill={accent} opacity="0.7" />
      <rect x="311" y="45" width="2" height="18" fill={accent} opacity="0.75" />
      <rect x="361" y="45" width="2" height="18" fill={accent} opacity="0.75" />
      {/* 875 N Michigan (John Hancock) */}
      <polygon points="430,90 415,262 445,262" fill={accent} opacity="0.55" />
      <rect x="416" y="90" width="28" height="172" fill={accent} opacity="0.5" />
      {/* X braces */}
      <line x1="416" y1="100" x2="444" y2="160" stroke={accent} strokeWidth="2" opacity="0.35" />
      <line x1="444" y1="100" x2="416" y2="160" stroke={accent} strokeWidth="2" opacity="0.35" />
      <line x1="416" y1="160" x2="444" y2="220" stroke={accent} strokeWidth="2" opacity="0.35" />
      <line x1="444" y1="160" x2="416" y2="220" stroke={accent} strokeWidth="2" opacity="0.35" />
      <rect x="428" y="75" width="2" height="18" fill={accent} opacity="0.7" />
      <rect x="434" y="75" width="2" height="18" fill={accent} opacity="0.7" />
      {/* Aon Center */}
      <rect x="460" y="120" width="38" height="142" fill={accent} opacity="0.48" />
      <polygon points="479,108 460,124 498,124" fill={accent} opacity="0.52" />
      {/* Two Prudential */}
      <rect x="508" y="150" width="32" height="112" fill={accent} opacity="0.42" />
      <polygon points="524,140 508,154 540,154" fill={accent} opacity="0.46" />
      {/* Marina City corn cobs */}
      <rect x="220" y="165" width="28" height="97" fill={accent} opacity="0.44" />
      <ellipse cx="234" cy="163" rx="14" ry="8" fill={accent} opacity="0.5" />
      <rect x="255" y="165" width="28" height="97" fill={accent} opacity="0.44" />
      <ellipse cx="269" cy="163" rx="14" ry="8" fill={accent} opacity="0.5" />
      {/* Other buildings */}
      <rect x="556" y="160" width="34" height="102" fill={accent} opacity="0.4" />
      <rect x="603" y="170" width="30" height="92" fill={accent} opacity="0.37" />
      <rect x="646" y="155" width="38" height="107" fill={accent} opacity="0.42" />
      <rect x="697" y="175" width="28" height="87" fill={accent} opacity="0.35" />
      <rect x="160" y="180" width="32" height="82" fill={accent} opacity="0.37" />
      <rect x="115" y="192" width="28" height="70" fill={accent} opacity="0.33" />
      <rect x="70" y="200" width="30" height="62" fill={accent} opacity="0.3" />
      <rect x="30" y="210" width="25" height="52" fill={accent} opacity="0.28" />
      {/* Chicago River */}
      <rect x="0" y="252" width="800" height="6" fill={accent} opacity="0.2" />
      {/* Ground */}
      <rect x="0" y="258" width="800" height="42" fill={accent} opacity="0.08" />
    </svg>
  ),
};


function NeighborhoodMap({ city, scored, selectedNeighborhood, onSelectNeighborhood }) {
  // Project lat/lng to SVG coords
  const W = 600, H = 360;
  const lats = scored.map(n => n.lat), lngs = scored.map(n => n.lng);
  const minLat = Math.min(...lats) - 0.025;
  const maxLat = Math.max(...lats) + 0.025;
  const minLng = Math.min(...lngs) - 0.035;
  const maxLng = Math.max(...lngs) + 0.035;

  function project(lat, lng) {
    const x = ((lng - minLng) / (maxLng - minLng)) * (W - 80) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (H - 80) + 40;
    return [x, y];
  }

  const maxScore = Math.max(...scored.map(n => n.score));
  const minScore = Math.min(...scored.map(n => n.score));

  // Generate pseudo-street grid lines for visual richness
  const gridLines = [];
  for (let i = 0; i <= 8; i++) {
    const y = 40 + (i / 8) * (H - 80);
    gridLines.push(<line key={`h${i}`} x1={40} y1={y} x2={W - 40} y2={y} stroke={city.accent} strokeWidth="0.4" opacity="0.08" />);
  }
  for (let i = 0; i <= 12; i++) {
    const x = 40 + (i / 12) * (W - 80);
    gridLines.push(<line key={`v${i}`} x1={x} y1={40} x2={x} y2={H - 40} stroke={city.accent} strokeWidth="0.4" opacity="0.08" />);
  }

  // Diagonal accent streets
  const diagonals = [];
  for (let i = 0; i < 3; i++) {
    const x0 = 40 + (i * 180);
    diagonals.push(<line key={`d${i}`} x1={x0} y1={40} x2={x0 + 120} y2={H - 40} stroke={city.accent} strokeWidth="0.6" opacity="0.06" />);
  }

  return (
    <div style={{ position: "relative", border: `1px solid ${city.cardBorder}`, background: city.bg, overflow: "hidden" }}>
      {/* Map label */}
      <div style={{ position: "absolute", top: "10px", left: "12px", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: city.accentLight, opacity: 0.6, fontFamily: city.bodyFont, zIndex: 2 }}>
        {city.name} · Neighborhood Map
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {/* Background */}
        <rect x="0" y="0" width={W} height={H} fill={city.bg} />
        <rect x="40" y="40" width={W - 80} height={H - 80} fill={city.card} opacity="0.6" rx="2" />

        {/* Grid */}
        {gridLines}
        {diagonals}

        {/* Water body hint (decorative) */}
        <ellipse cx={W * 0.85} cy={H * 0.5} rx="50" ry="80" fill={city.accent} opacity="0.04" />

        {/* Connection lines between neighborhoods */}
        {scored.map((n, i) => {
          if (i === scored.length - 1) return null;
          const [x1, y1] = project(n.lat, n.lng);
          const [x2, y2] = project(scored[i + 1].lat, scored[i + 1].lng);
          return <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={city.accent} strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />;
        })}

        {/* Neighborhood pins */}
        {scored.map((n, i) => {
          const [x, y] = project(n.lat, n.lng);
          const isTop = n.score === maxScore;
          const isLeast = n.score === minScore && minScore < maxScore;
          const isSelected = selectedNeighborhood === n.name;
          const color = isTop ? city.accent : isLeast ? "#4a4a6a" : city.accentLight;
          const pinSize = isTop ? 22 : isLeast ? 14 : 18;
          const opacity = isLeast ? 0.45 : 1;

          return (
            <g key={n.name} style={{ cursor: "pointer" }} onClick={() => onSelectNeighborhood(isSelected ? null : n.name)} opacity={opacity}>
              {/* Pulse ring for top match */}
              {isTop && (
                <>
                  <circle cx={x} cy={y} r={pinSize + 12} fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
                  <circle cx={x} cy={y} r={pinSize + 6} fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
                </>
              )}
              {/* Selection ring */}
              {isSelected && (
                <circle cx={x} cy={y} r={pinSize + 8} fill="none" stroke={city.accentLight} strokeWidth="2" opacity="0.8" />
              )}
              {/* Pin circle */}
              <circle cx={x} cy={y} r={pinSize} fill={color} opacity={isTop ? 0.9 : 0.75} />
              <circle cx={x} cy={y} r={pinSize} fill="none" stroke="#fff" strokeWidth={isTop ? 2 : 1} opacity={isTop ? 0.5 : 0.2} />
              {/* Rank number */}
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={isTop ? "11" : "9"} fontWeight="700" fontFamily="sans-serif" opacity="0.95">{i + 1}</text>
              {/* Label */}
              <text x={x} y={y + pinSize + 13} textAnchor="middle" fill={isTop ? city.accentLight : city.textMuted || "#aaa"} fontSize="9" fontFamily="'Source Serif 4', Georgia, serif" opacity={isLeast ? 0.5 : 0.85}>{n.name.split(" ")[0]}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: "10px", right: "12px", background: `${city.bg}dd`, border: `1px solid ${city.cardBorder}`, padding: "8px 12px", backdropFilter: "blur(4px)" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: city.textMuted, marginBottom: "6px", fontFamily: city.bodyFont }}>Match Rank</div>
        {[
          { color: city.accent, label: "#1 Best match", opacity: 0.9 },
          { color: city.accentLight, label: "Mid matches", opacity: 0.75 },
          { color: "#4a4a6a", label: "Least match", opacity: 0.5 },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: item.color, opacity: item.opacity, flexShrink: 0 }} />
            <span style={{ fontSize: "10px", color: city.textMuted, fontFamily: city.bodyFont }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Compass */}
      <div style={{ position: "absolute", top: "12px", right: "14px", width: "28px", height: "28px", opacity: 0.3 }}>
        <svg viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="13" fill="none" stroke={city.accent} strokeWidth="1" />
          <polygon points="14,3 11,14 17,14" fill={city.accent} />
          <polygon points="14,25 11,14 17,14" fill={city.accent} opacity="0.4" />
          <text x="14" y="8" textAnchor="middle" fontSize="5" fill={city.accent} fontFamily="sans-serif" fontWeight="bold">N</text>
        </svg>
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
    ],
    tips: [
      { category: "Transit", icon: "🚇", tip: "Get a Ventra card day one. Driving downtown is a special kind of punishment." },
      { category: "Weather", icon: "🧥", tip: "Invest in a real parka — not a fashion one. Layering is a lifestyle." },
      { category: "Food", icon: "🍕", tip: "Deep dish is a special occasion. Real Chicagoans eat thin crust tavern-style." },
    ],
    questions: [{ q: "Best neighborhoods to start in as a newcomer?", a: "Logan Square for creative vibes. Lincoln Park if you want polished. Pilsen for culture and value.", author: "Tom N.", time: "2 weeks ago" }],
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
function CityCardBg({ city, hovered }) {
  const Skyline = SKYLINES[city.id];
  return Skyline ? <Skyline accent={city.accent} opacity={hovered ? 0.28 : 0.16} /> : null;
}

// ── Split Entry ───────────────────────────────────────────────────────────────
function SplitEntry({ onKnow, onExplore }) {
  const [hover, setHover] = useState(null);
  const v = useMount(20);

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'EB Garamond', Georgia, serif", overflow: "hidden", opacity: v ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, display: "flex", justifyContent: "center", paddingTop: "28px", pointerEvents: "none" }}>
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
function KnowPath({ onBack }) {
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
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${c.accent}, ${c.accentLight})`, width: `${(quizStep / QUIZ.length) * 100}%`, transition: "width 0.4s ease" }} />
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
                          <div style={{ height: "100%", width: `${maxScore > 0 ? (n.score / maxScore) * 100 : 0}%`, background: isLeast ? "#4a4a6a" : c.accent, borderRadius: "2px" }} />
                        </div>
                        <div style={{ fontSize: "18px", fontFamily: c.displayFont, color: isLeast ? c.textMuted : c.accent, opacity: isLeast ? 0.5 : 1, minWidth: "22px", textAlign: "right" }}>{n.score}</div>
                      </div>
                    </div>
                    {/* Deep dive button */}
                    <div style={{ borderTop: `1px solid ${c.cardBorder}`, padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `${c.accent}08` }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {(n.tags || []).slice(0,3).map(t => <span key={t} style={{ fontSize: "9px", padding: "1px 7px", border: `1px solid ${c.accent}33`, color: c.accentLight, opacity: 0.7 }}>{t}</span>)}
                      </div>
                      <button
                        onClick={() => setNeighborhoodPage(n.name)}
                        style={{ background: "transparent", border: `1px solid ${c.accent}55`, color: c.accentLight, padding: "5px 14px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: c.bodyFont, transition: "all 0.15s", whiteSpace: "nowrap" }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}22`; e.currentTarget.style.borderColor = c.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${c.accent}55`; }}
                      >Full Guide →</button>
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
function ExplorePath({ onBack }) {
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
          <div style={{ height: "100%", background: "linear-gradient(90deg,#2E7D6B,#5DB8A4)", width: `${(step / EXPLORE_STEPS.length) * 100}%`, transition: "width 0.4s ease" }} />
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

// ── Neighborhood Google Map with pins ────────────────────────────────────────
function NeighborhoodGoogleMap({ neighborhood, city, places, activeSection }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        if (!mapRef.current) return;
        const center = { lat: neighborhood.lat, lng: neighborhood.lng };
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          styles: [
            { elementType:"geometry", stylers:[{ color: city.bg.replace("#","") === "080A0F" ? "#0a0d18" : city.bg }] },
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

        // Neighborhood center marker
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
      })
      .catch(() => setMapError(true));
  }, [neighborhood.lat, neighborhood.lng]);

  // Add/update place pins when places or activeSection changes
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (!places || places.length === 0) return;

    const sectionEmojis = { food:"🍽",bars:"🍸",coffee:"☕",shopping:"🛍",gyms:"💪",landmarks:"📍",parks:"🌿" };
    const service = new window.google.maps.places.PlacesService(mapInstance.current);
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: neighborhood.lat, lng: neighborhood.lng });

    places.slice(0, 6).forEach((place) => {
      const req = { query: `${place.name} ${neighborhood.name} ${city.name}`, fields: ["geometry","name","place_id"] };
      service.findPlaceFromQuery(req, (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results?.[0]?.geometry) return;
        const pos = results[0].geometry.location;
        bounds.extend(pos);
        const marker = new window.google.maps.Marker({
          position: pos,
          map: mapInstance.current,
          title: place.name,
          label: {
            text: sectionEmojis[activeSection] || "📍",
            fontSize: "14px",
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: city.accent,
            fillOpacity: place.must ? 1 : 0.7,
            strokeColor: place.must ? "#fff" : city.accentLight,
            strokeWeight: place.must ? 2 : 1,
          },
        });
        const iw = new window.google.maps.InfoWindow({
          content: `<div style="font-family:sans-serif;padding:4px 2px;color:#111"><strong style="font-size:13px">${place.name}</strong>${place.must ? '<span style="margin-left:6px;background:#e67e22;color:#fff;font-size:9px;padding:1px 5px;border-radius:2px">Must Visit</span>' : ""}<br/><span style="font-size:12px;color:#555">${place.desc||""}</span></div>`,
        });
        marker.addListener("click", () => iw.open(mapInstance.current, marker));
        markersRef.current.push(marker);
        if (markersRef.current.length > 1) mapInstance.current.fitBounds(bounds);
      });
    });
  }, [places, activeSection]);

  if (mapError) return null;
  return (
    <div style={{ position:"relative", borderRadius:0, overflow:"hidden", border:`1px solid ${city.cardBorder}` }}>
      <div ref={mapRef} style={{ width:"100%", height:"320px" }} />
      <div style={{ position:"absolute", top:"10px", left:"12px", background:`${city.bg}dd`, border:`1px solid ${city.cardBorder}`, padding:"5px 10px", backdropFilter:"blur(8px)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.accentLight }}>
        {neighborhood.name} · Live Map
      </div>
    </div>
  );
}

// ── Place Photo Card (Unsplash) ───────────────────────────────────────────────
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const photoCache = {};

function PlacePhoto({ placeName, placeType, neighborhood, city, style }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!UNSPLASH_KEY) return;
    setPhotoUrl(null);

    // Build a search query focused on interior/food shots
    const typeMap = {
      food: "restaurant interior food",
      bars: "bar interior cocktails",
      coffee: "coffee shop cafe interior",
      shopping: "boutique shop interior",
      gyms: "gym fitness studio",
      landmarks: "landmark architecture",
      parks: "park nature outdoor",
    };
    const typeQuery = typeMap[placeType] || "restaurant interior";
    const query = `${typeQuery} ${city}`;
    const cacheKey = query;

    if (photoCache[cacheKey]) {
      setPhotoUrl(photoCache[cacheKey]);
      return;
    }

    fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`)
      .then(r => r.json())
      .then(d => {
        if (d?.urls?.regular) {
          photoCache[cacheKey] = d.urls.regular;
          setPhotoUrl(d.urls.regular);
        }
      })
      .catch(() => {});
  }, [placeName, placeType, city]);

  return (
    <div style={style}>
      {photoUrl && (
        <img src={photoUrl} alt={placeName} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block", opacity:0.88 }} />
      )}
    </div>
  );
}

// ── AI-Powered Neighborhood Page ─────────────────────────────────────────────
const SECTION_ICONS = { food:"🍽",bars:"🍸",coffee:"☕",shopping:"🛍",gyms:"💪",landmarks:"📍",parks:"🌿" };
const SECTION_LABELS = { food:"Food & Dining",bars:"Bars & Nightlife",coffee:"Coffee",shopping:"Shopping",gyms:"Fitness & Outdoors",landmarks:"Landmarks & Culture",parks:"Parks & Green Space" };

function NeighborhoodPage({ neighborhood, city, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("food");
  const v = useMount();
  const Skyline = SKYLINES[city.id];

  useEffect(() => {
    setLoading(true); setData(null); setError(null);
    const prompt = `You are a local expert on ${city.name}. Generate a detailed neighborhood guide for "${neighborhood.name}" in JSON only (no markdown, no backticks).

Return this exact structure:
{
  "headline": "short punchy tagline (max 10 words)",
  "about": "2-3 sentence neighborhood overview",
  "stats": { "walkScore": 0-100, "transitScore": 0-100, "bikeScore": 0-100, "avgRent1br": "$X,XXX", "avgRent2br": "$X,XXX", "bestFor": "who lives here" },
  "food": [{"name":"...","type":"cuisine","desc":"1 sentence","must":true}],
  "bars": [{"name":"...","desc":"1 sentence"}],
  "coffee": [{"name":"...","desc":"1 sentence"}],
  "shopping": [{"name":"...","desc":"1 sentence"}],
  "gyms": [{"name":"...","desc":"1 sentence"}],
  "landmarks": [{"name":"...","desc":"1 sentence"}],
  "parks": [{"name":"...","desc":"1 sentence"}]
}

Include 3-5 real items per category. Mark the single best must-visit food spot with must:true.`;

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.error) throw new Error(d.error.message);
      const raw = (d.content || []).map(i => i.text || "").join("");
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      setData(JSON.parse(jsonMatch[0]));
      setLoading(false);
    })
    .catch(err => { setError(err.message); setLoading(false); });
  }, [neighborhood.name, city.id]);

  const sections = data ? Object.keys(SECTION_LABELS).filter(s => data[s]?.length > 0) : [];
  // Safety: if activeSection has no data in new load, reset to first available
  useEffect(() => {
    if (sections.length > 0 && !sections.includes(activeSection)) {
      setActiveSection(sections[0]);
    }
  }, [sections.join(",")]);

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
          {[{l:"Walk Score",v:data.stats.walkScore,max:100},{l:"Transit",v:data.stats.transitScore,max:100},{l:"Bike Score",v:data.stats.bikeScore,max:100},{l:"1BR Rent",v:data.stats.avgRent1br},{l:"2BR Rent",v:data.stats.avgRent2br}].map(s => (
            <div key={s.l} style={{ minWidth:"72px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>{s.l}</div>
              {s.max
                ? <div><div style={{ fontSize:"18px", fontFamily:city.displayFont, color:city.accent }}>{s.v}</div><div style={{ width:"52px", height:"3px", background:city.cardBorder, borderRadius:"2px", marginTop:"3px" }}><div style={{ height:"100%", width:`${((s.v||0)/s.max)*100}%`, background:city.accent, borderRadius:"2px" }} /></div></div>
                : <div style={{ fontSize:"16px", fontFamily:city.displayFont, color:city.accentLight }}>{s.v}</div>
              }
            </div>
          ))}
          {data.stats.bestFor && <div style={{ flex:1, minWidth:"130px" }}><div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:city.textMuted, marginBottom:"4px" }}>Best For</div><div style={{ fontSize:"12px", color:city.textMuted, fontStyle:"italic", lineHeight:1.4 }}>{data.stats.bestFor}</div></div>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", gap:"16px" }}>
          <div style={{ fontSize:"28px" }}>🔍</div>
          <div style={{ fontSize:"13px", color:city.textMuted, fontStyle:"italic" }}>Building your guide for {neighborhood.name}…</div>
          <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
          <div style={{ display:"flex", gap:"6px" }}>{[0,1,2].map(i => <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:city.accent, animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding:"32px", textAlign:"center" }}>
          <p style={{ fontSize:"13px", color:city.textMuted, marginBottom:"12px" }}>Couldn't load guide — {error}</p>
          <button onClick={() => { setLoading(true); setError(null); }} style={{ background:city.accent, border:"none", color:"#fff", padding:"8px 20px", cursor:"pointer", fontFamily:city.bodyFont, fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase" }}>Try Again</button>
        </div>
      )}

      {/* Map */}
      {neighborhood.lat && (
        <div style={{ maxWidth:"860px", margin:"0 auto", padding:"20px 32px 0" }}>
          <NeighborhoodGoogleMap
            neighborhood={neighborhood}
            city={city}
            places={data ? (data[activeSection] || []) : []}
            activeSection={activeSection}
          />
        </div>
      )}

      {/* Tabs */}
      {data && sections.length > 0 && (
        <>
          <div style={{ borderBottom:`1px solid ${city.cardBorder}`, position:"sticky", top:0, zIndex:15, background:`${city.bg}f8`, backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", overflowX:"auto", padding:"0 20px" }}>
              {sections.map(s => (
                <button key={s} onClick={() => setActiveSection(s)}
                  style={{ background:"transparent", border:"none", borderBottom:activeSection===s?`2px solid ${city.accent}`:"2px solid transparent", color:activeSection===s?city.textPrimary:city.textMuted, padding:"13px 14px", fontSize:"11px", cursor:"pointer", fontFamily:city.bodyFont, whiteSpace:"nowrap", transition:"color 0.15s" }}>
                  {SECTION_ICONS[s]} {SECTION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ maxWidth:"860px", margin:"0 auto", padding:"24px 32px 80px" }}>
            <div style={{ display:"grid", gap:"9px" }}>
              {(data[activeSection]||[]).map((item,i) => (
                <div key={`${activeSection}-${i}`}
                  style={{ background:city.card, border:`1px solid ${item.must?city.accent+"55":city.cardBorder}`, borderLeft:`3px solid ${item.must?city.accent:city.cardBorder}`, transition:"transform 0.15s", position:"relative", overflow:"hidden" }}
                  onMouseEnter={e => e.currentTarget.style.transform="translateX(3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform="none"}
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
                    <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:item.desc?"5px":0 }}>
                      <span style={{ fontSize:"15px", fontFamily:city.displayFont, color:city.textPrimary }}>{item.name}</span>
                      {item.type && <span style={{ fontSize:"9px", padding:"2px 7px", border:`1px solid ${city.accent}33`, color:city.accentLight }}>{item.type}</span>}
                    </div>
                    {item.desc && <p style={{ margin:0, fontSize:"13px", color:city.textMuted, lineHeight:"1.65" }}>{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("entry");
  if (screen === "entry") return <SplitEntry onKnow={() => setScreen("know")} onExplore={() => setScreen("explore")} />;
  if (screen === "know") return <KnowPath onBack={() => setScreen("entry")} />;
  if (screen === "explore") return <ExplorePath onBack={() => setScreen("entry")} />;
  return null;
}
