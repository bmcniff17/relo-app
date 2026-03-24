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
  denver: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Rocky Mountains backdrop */}
      <polygon points="0,200 80,100 160,150 240,80 320,130 400,60 480,120 560,90 640,140 720,100 800,160 800,300 0,300" fill={accent} opacity="0.12" />
      <polygon points="0,230 100,160 180,190 260,140 340,170 420,120 500,155 580,135 660,165 740,145 800,180 800,300 0,300" fill={accent} opacity="0.08" />
      {/* Stars */}
      {[[60,40],[150,25],[280,55],[420,20],[560,45],[700,30],[740,70]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={accent} opacity="0.6" />
      ))}
      {/* Colorado State Capitol dome */}
      <rect x="355" y="170" width="90" height="90" fill={accent} opacity="0.5" />
      <ellipse cx="400" cy="170" rx="45" ry="35" fill={accent} opacity="0.55" />
      <ellipse cx="400" cy="148" rx="18" ry="24" fill={accent} opacity="0.6" />
      <rect x="397" y="126" width="6" height="22" fill={accent} opacity="0.7" />
      {/* Downtown towers */}
      <rect x="100" y="185" width="38" height="77" fill={accent} opacity="0.42" />
      <rect x="148" y="195" width="30" height="67" fill={accent} opacity="0.38" />
      <rect x="188" y="175" width="44" height="87" fill={accent} opacity="0.45" />
      <rect x="242" y="200" width="28" height="62" fill={accent} opacity="0.35" />
      <rect x="280" y="188" width="34" height="74" fill={accent} opacity="0.4" />
      <rect x="460" y="182" width="40" height="80" fill={accent} opacity="0.43" />
      <rect x="510" y="195" width="32" height="67" fill={accent} opacity="0.38" />
      <rect x="552" y="178" width="36" height="84" fill={accent} opacity="0.41" />
      <rect x="598" y="200" width="28" height="62" fill={accent} opacity="0.35" />
      <rect x="636" y="190" width="34" height="72" fill={accent} opacity="0.39" />
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  nashville: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Stars */}
      {[[50,30],[140,20],[270,50],[400,15],[530,40],[660,25],[740,60]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={accent} opacity="0.6" />
      ))}
      {/* AT&T Building (Batman Building) */}
      <rect x="355" y="120" width="90" height="140" fill={accent} opacity="0.55" />
      <rect x="365" y="110" width="70" height="15" fill={accent} opacity="0.55" />
      <rect x="375" y="95" width="50" height="18" fill={accent} opacity="0.6" />
      {/* Twin spires */}
      <rect x="378" y="60" width="8" height="38" fill={accent} opacity="0.65" />
      <rect x="414" y="60" width="8" height="38" fill={accent} opacity="0.65" />
      {/* Downtown buildings */}
      <rect x="90" y="190" width="38" height="72" fill={accent} opacity="0.4" />
      <rect x="138" y="178" width="32" height="84" fill={accent} opacity="0.43" />
      <rect x="180" y="195" width="44" height="67" fill={accent} opacity="0.38" />
      <rect x="234" y="185" width="30" height="77" fill={accent} opacity="0.41" />
      <rect x="274" y="200" width="36" height="62" fill={accent} opacity="0.36" />
      <rect x="470" y="188" width="38" height="74" fill={accent} opacity="0.42" />
      <rect x="518" y="175" width="32" height="87" fill={accent} opacity="0.45" />
      <rect x="560" y="193" width="40" height="69" fill={accent} opacity="0.39" />
      <rect x="610" y="185" width="28" height="77" fill={accent} opacity="0.41" />
      <rect x="648" y="198" width="34" height="64" fill={accent} opacity="0.37" />
      {/* Cumberland River */}
      <rect x="0" y="256" width="800" height="6" fill={accent} opacity="0.18" />
      {/* Music notes */}
      <text x="740" y="110" fontSize="20" fill={accent} opacity="0.25" fontFamily="serif">♪</text>
      <text x="30" y="90" fontSize="16" fill={accent} opacity="0.22" fontFamily="serif">♫</text>
      <text x="680" y="160" fontSize="14" fill={accent} opacity="0.2" fontFamily="serif">♩</text>
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  miami: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Ocean/sky gradient */}
      <rect x="0" y="0" width="800" height="300" fill={accent} opacity="0.03" />
      {/* Stars */}
      {[[80,25],[200,15],[350,40],[500,18],[640,35],[730,55]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill={accent} opacity="0.5" />
      ))}
      {/* Moon over ocean */}
      <circle cx="700" cy="50" r="22" fill={accent} opacity="0.2" />
      {/* Biscayne Bay water */}
      <ellipse cx="400" cy="285" rx="450" ry="25" fill={accent} opacity="0.1" />
      {/* Tall Miami towers */}
      <rect x="340" y="80" width="55" height="180" fill={accent} opacity="0.55" />
      <rect x="345" y="75" width="45" height="10" fill={accent} opacity="0.6" />
      <rect x="355" y="65" width="25" height="12" fill={accent} opacity="0.6" />
      <rect x="403" y="100" width="50" height="160" fill={accent} opacity="0.5" />
      <rect x="408" y="93" width="40" height="10" fill={accent} opacity="0.55" />
      {/* Downtown towers */}
      <rect x="80" y="160" width="36" height="102" fill={accent} opacity="0.38" />
      <rect x="126" y="145" width="32" height="117" fill={accent} opacity="0.42" />
      <rect x="168" y="170" width="40" height="92" fill={accent} opacity="0.36" />
      <rect x="218" y="155" width="28" height="107" fill={accent} opacity="0.4" />
      <rect x="256" y="168" width="38" height="94" fill={accent} opacity="0.37" />
      <rect x="462" y="155" width="42" height="107" fill={accent} opacity="0.43" />
      <rect x="514" y="148" width="34" height="114" fill={accent} opacity="0.45" />
      <rect x="558" y="165" width="38" height="97" fill={accent} opacity="0.4" />
      <rect x="606" y="158" width="30" height="104" fill={accent} opacity="0.38" />
      <rect x="646" y="172" width="36" height="90" fill={accent} opacity="0.36" />
      {/* Palm trees */}
      {[[50,262],[160,258],[640,260],[750,255]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y-30} width="3" height="30" fill={accent} opacity="0.4" />
          <ellipse cx={x+1} cy={y-32} rx="12" ry="6" fill={accent} opacity="0.3" />
        </g>
      ))}
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  nyc: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Stars */}
      {[[40,20],[120,35],[220,15],[380,28],[510,18],[650,32],[760,22]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill={accent} opacity="0.5" />
      ))}
      {/* Empire State Building */}
      <rect x="370" y="80" width="60" height="180" fill={accent} opacity="0.6" />
      <rect x="378" y="68" width="44" height="16" fill={accent} opacity="0.62" />
      <rect x="385" y="55" width="30" height="16" fill={accent} opacity="0.65" />
      <rect x="391" y="42" width="18" height="14" fill={accent} opacity="0.68" />
      <rect x="398" y="22" width="4" height="22" fill={accent} opacity="0.75" />
      {/* Chrysler-like spire */}
      <rect x="190" y="110" width="48" height="150" fill={accent} opacity="0.52" />
      <rect x="198" y="98" width="32" height="14" fill={accent} opacity="0.55" />
      <rect x="206" y="78" width="16" height="22" fill={accent} opacity="0.6" />
      <rect x="212" y="62" width="4" height="18" fill={accent} opacity="0.65" />
      {/* One WTC */}
      <rect x="560" y="60" width="52" height="200" fill={accent} opacity="0.55" />
      <rect x="560" y="60" width="52" height="200" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" />
      <rect x="582" y="42" width="8" height="20" fill={accent} opacity="0.6" />
      {/* Dense Manhattan towers */}
      <rect x="60" y="175" width="28" height="87" fill={accent} opacity="0.35" />
      <rect x="98" y="160" width="32" height="102" fill={accent} opacity="0.38" />
      <rect x="140" y="150" width="36" height="112" fill={accent} opacity="0.41" />
      <rect x="248" y="155" width="34" height="107" fill={accent} opacity="0.4" />
      <rect x="292" y="165" width="30" height="97" fill={accent} opacity="0.37" />
      <rect x="332" y="145" width="28" height="117" fill={accent} opacity="0.42" />
      <rect x="440" y="148" width="32" height="114" fill={accent} opacity="0.43" />
      <rect x="482" y="158" width="38" height="104" fill={accent} opacity="0.4" />
      <rect x="530" y="142" width="22" height="120" fill={accent} opacity="0.44" />
      <rect x="622" y="152" width="34" height="110" fill={accent} opacity="0.42" />
      <rect x="666" y="165" width="30" height="97" fill={accent} opacity="0.38" />
      <rect x="706" y="148" width="38" height="114" fill={accent} opacity="0.43" />
      <rect x="754" y="170" width="28" height="92" fill={accent} opacity="0.36" />
      {/* Hudson River */}
      <rect x="0" y="256" width="800" height="6" fill={accent} opacity="0.18" />
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  la: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Hollywood Hills silhouette */}
      <polygon points="0,220 60,170 120,190 180,155 240,175 300,145 360,165 420,140 480,170 540,150 600,175 660,155 720,180 800,160 800,300 0,300" fill={accent} opacity="0.1" />
      {/* Stars */}
      {[[50,30],[160,18],[300,42],[450,22],[600,38],[730,28]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.3" fill={accent} opacity="0.55" />
      ))}
      {/* Hollywood sign (tiny) */}
      <text x="350" y="148" fontSize="8" fill={accent} opacity="0.3" fontFamily="sans-serif" fontWeight="bold" letterSpacing="2">HOLLYWOOD</text>
      {/* Wilshire towers */}
      <rect x="340" y="130" width="50" height="130" fill={accent} opacity="0.55" />
      <rect x="348" y="120" width="34" height="12" fill={accent} opacity="0.58" />
      <rect x="400" y="150" width="44" height="110" fill={accent} opacity="0.5" />
      {/* Downtown LA */}
      <rect x="80" y="175" width="38" height="87" fill={accent} opacity="0.4" />
      <rect x="128" y="160" width="32" height="102" fill={accent} opacity="0.43" />
      <rect x="170" y="178" width="40" height="84" fill={accent} opacity="0.38" />
      <rect x="220" y="168" width="30" height="94" fill={accent} opacity="0.41" />
      <rect x="260" y="182" width="36" height="80" fill={accent} opacity="0.37" />
      <rect x="454" y="168" width="38" height="94" fill={accent} opacity="0.42" />
      <rect x="502" y="155" width="34" height="107" fill={accent} opacity="0.45" />
      <rect x="546" y="172" width="40" height="90" fill={accent} opacity="0.4" />
      <rect x="596" y="165" width="28" height="97" fill={accent} opacity="0.38" />
      <rect x="634" y="178" width="36" height="84" fill={accent} opacity="0.36" />
      {/* Palm trees */}
      {[[40,260],[130,256],[680,258],[770,253]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y-35} width="3" height="35" fill={accent} opacity="0.4" />
          <ellipse cx={x+1} cy={y-37} rx="14" ry="7" fill={accent} opacity="0.3" />
        </g>
      ))}
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  portland: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Mt Hood in background */}
      <polygon points="580,80 620,20 660,80" fill={accent} opacity="0.25" />
      <polygon points="575,82 660,82 680,120 555,120" fill={accent} opacity="0.1" />
      {/* Stars / overcast */}
      {[[40,35],[130,22],[250,48],[390,25],[530,42],[720,30]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill={accent} opacity="0.45" />
      ))}
      {/* Portland downtown */}
      <rect x="340" y="150" width="55" height="112" fill={accent} opacity="0.52" />
      <rect x="348" y="138" width="39" height="14" fill={accent} opacity="0.55" />
      <rect x="355" y="124" width="25" height="16" fill={accent} opacity="0.58" />
      <rect x="362" y="112" width="11" height="14" fill={accent} opacity="0.6" />
      {/* Downtown towers */}
      <rect x="85" y="185" width="36" height="77" fill={accent} opacity="0.38" />
      <rect x="131" y="172" width="30" height="90" fill={accent} opacity="0.41" />
      <rect x="171" y="188" width="38" height="74" fill={accent} opacity="0.37" />
      <rect x="219" y="178" width="32" height="84" fill={accent} opacity="0.4" />
      <rect x="261" y="192" width="36" height="70" fill={accent} opacity="0.36" />
      <rect x="403" y="168" width="40" height="94" fill={accent} opacity="0.43" />
      <rect x="453" y="180" width="32" height="82" fill={accent} opacity="0.39" />
      <rect x="495" y="172" width="36" height="90" fill={accent} opacity="0.41" />
      <rect x="541" y="188" width="28" height="74" fill={accent} opacity="0.37" />
      <rect x="579" y="178" width="34" height="84" fill={accent} opacity="0.4" />
      {/* Willamette River */}
      <rect x="0" y="254" width="800" height="8" fill={accent} opacity="0.18" />
      {/* Bridges (Portland is famous for them) */}
      <line x1="150" y1="254" x2="150" y2="262" stroke={accent} strokeWidth="8" opacity="0.25" />
      <line x1="100" y1="254" x2="200" y2="254" stroke={accent} strokeWidth="3" opacity="0.3" />
      <line x1="450" y1="254" x2="450" y2="262" stroke={accent} strokeWidth="8" opacity="0.25" />
      <line x1="400" y1="254" x2="500" y2="254" stroke={accent} strokeWidth="3" opacity="0.3" />
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  phoenix: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Desert mountains */}
      <polygon points="0,240 70,180 140,220 210,170 280,205 350,160 420,195 490,165 560,200 630,172 700,210 800,185 800,300 0,300" fill={accent} opacity="0.1" />
      {/* Stars (clear desert sky) */}
      {[[45,20],[110,35],[200,12],[310,28],[430,15],[550,32],[670,20],[750,42]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={accent} opacity="0.65" />
      ))}
      {/* Bright moon */}
      <circle cx="720" cy="45" r="24" fill={accent} opacity="0.22" />
      {/* Chase Tower */}
      <rect x="355" y="140" width="55" height="122" fill={accent} opacity="0.55" />
      <rect x="362" y="128" width="41" height="14" fill={accent} opacity="0.58" />
      <rect x="370" y="115" width="25" height="15" fill={accent} opacity="0.6" />
      {/* Downtown towers */}
      <rect x="80" y="185" width="38" height="77" fill={accent} opacity="0.4" />
      <rect x="128" y="172" width="32" height="90" fill={accent} opacity="0.43" />
      <rect x="170" y="188" width="40" height="74" fill={accent} opacity="0.38" />
      <rect x="220" y="178" width="28" height="84" fill={accent} opacity="0.41" />
      <rect x="258" y="192" width="36" height="70" fill={accent} opacity="0.37" />
      <rect x="420" y="175" width="42" height="87" fill={accent} opacity="0.42" />
      <rect x="472" y="188" width="32" height="74" fill={accent} opacity="0.39" />
      <rect x="514" y="170" width="38" height="92" fill={accent} opacity="0.43" />
      <rect x="562" y="185" width="30" height="77" fill={accent} opacity="0.38" />
      <rect x="602" y="178" width="36" height="84" fill={accent} opacity="0.4" />
      {/* Saguaro cacti */}
      {[[40,262],[720,258],[760,260]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y-40} width="5" height="40" fill={accent} opacity="0.35" />
          <rect x={x-8} y={y-25} width="8" height="3" fill={accent} opacity="0.35" />
          <rect x={x-8} y={y-25} width="3" height="10" fill={accent} opacity="0.35" />
          <rect x={x+5} y={y-20} width="8" height="3" fill={accent} opacity="0.35" />
          <rect x={x+10} y={y-20} width="3" height="12" fill={accent} opacity="0.35" />
        </g>
      ))}
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
    </svg>
  ),
  atlanta: ({ accent, opacity = 0.18 }) => (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity }}>
      {/* Stars */}
      {[[55,28],[145,18],[265,45],[400,20],[540,38],[680,25],[750,50]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill={accent} opacity="0.55" />
      ))}
      {/* Bank of America Plaza (distinctive) */}
      <rect x="358" y="100" width="52" height="162" fill={accent} opacity="0.58" />
      <rect x="365" y="88" width="38" height="14" fill={accent} opacity="0.6" />
      <rect x="372" y="72" width="24" height="18" fill={accent} opacity="0.63" />
      <rect x="382" y="55" width="4" height="19" fill={accent} opacity="0.7" />
      {/* Westin Peachtree */}
      <rect x="418" y="130" width="44" height="132" fill={accent} opacity="0.52" />
      <rect x="424" y="118" width="32" height="14" fill={accent} opacity="0.55" />
      {/* Downtown towers */}
      <rect x="78" y="180" width="36" height="82" fill={accent} opacity="0.38" />
      <rect x="124" y="165" width="32" height="97" fill={accent} opacity="0.42" />
      <rect x="166" y="178" width="40" height="84" fill={accent} opacity="0.38" />
      <rect x="216" y="168" width="30" height="94" fill={accent} opacity="0.41" />
      <rect x="256" y="182" width="36" height="80" fill={accent} opacity="0.37" />
      <rect x="472" y="158" width="38" height="104" fill={accent} opacity="0.43" />
      <rect x="520" y="172" width="32" height="90" fill={accent} opacity="0.4" />
      <rect x="562" y="165" width="40" height="97" fill={accent} opacity="0.42" />
      <rect x="612" y="178" width="28" height="84" fill={accent} opacity="0.38" />
      <rect x="650" y="168" width="36" height="94" fill={accent} opacity="0.41" />
      {/* Peachtree trees */}
      {[[45,258],[740,255]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y-28} width="4" height="28" fill={accent} opacity="0.35" />
          <ellipse cx={x+2} cy={y-30} rx="10" ry="14" fill={accent} opacity="0.25" />
        </g>
      ))}
      {/* Ground */}
      <rect x="0" y="262" width="800" height="38" fill={accent} opacity="0.08" />
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

// ── Neighborhood Google Map ──────────────────────────────────────────────────
function NeighborhoodGoogleMap({ neighborhood, city, selectedPlace }) {
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
        content: `<div style="font-family:sans-serif;padding:4px;color:#111"><strong>${selectedPlace.name}</strong></div>`,
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

// ── Place Detail Panel (inline expanded) ─────────────────────────────────────
const detailCache = {};

function PlaceDetailPanel({ item, placeType, neighborhood, city, onClose }) {
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
      const m = raw.match(/\{[\s\S]*\}/);
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
function JobsTab({ jobs, city }) {
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
function SchoolsTab({ schools, city }) {
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
function CommunityTab({ community, city }) {
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

function CostOfLivingTool({ onClose, cities }) {
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
        <div style={{ background: diff > 0 ? "#f4433611" : "#4caf5011", border:`1px solid ${diff > 0 ? "#f4433633" : "#4caf5033"}`, padding:"14px 16px", fontSize:"13px", color:"rgba(255,255,255,0.8)", lineHeight:"1.6" }}>
          {cityBInfo?.name} is <strong style={{ color: diff > 0 ? "#f44336" : "#4caf50" }}>{Math.abs(pct)}% {diff > 0 ? "more" : "less"} expensive</strong> than {cityAInfo?.name} per month (${Math.abs(diff).toLocaleString()} difference). {leftoverB > leftoverA ? `You'd have $${(leftoverB-leftoverA).toLocaleString()} more per month in ${cityBInfo?.name}.` : `You'd have $${(leftoverA-leftoverB).toLocaleString()} less per month in ${cityBInfo?.name}.`}
        </div>
      </div>
    </div>
  );
}

// ── Apartments Tab ────────────────────────────────────────────────────────────
function ApartmentsTab({ apartments, stats, neighborhood, city }) {
  const [minBeds, setMinBeds] = useState(0);
  const [maxRent, setMaxRent] = useState(10000);
  const [tierFilter, setTierFilter] = useState("all");

  const rentNum = r => parseInt((r||"$0").replace(/[^0-9]/g,"")) || 0;

  const filtered = (apartments||[]).filter(a => {
    if (minBeds > 0 && a.beds < minBeds) return false;
    if (rentNum(a.rent) > maxRent) return false;
    if (tierFilter !== "all" && a.tier !== tierFilter) return false;
    return true;
  });

  const tierColor = { budget: "#4caf50", mid: city.accent, luxury: "#c9a84c" };
  const tierLabel = { budget: "Budget", mid: "Mid-Range", luxury: "Luxury" };

  const zillow = `https://www.zillow.com/homes/${encodeURIComponent(neighborhood.name+", "+city.name)}_rb/`;
  const aptsCom = `https://www.apartments.com/${neighborhood.name.toLowerCase().replace(/\s+/g,"-")}-${city.name.toLowerCase()}/`;

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
          <div key={i} style={{ background:city.card, border:`1px solid ${city.cardBorder}`, borderLeft:`3px solid ${tierColor[apt.tier]||city.accent}`, padding:"16px 18px" }}
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

function NeighborhoodPage({ neighborhood, city, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("food");
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const v = useMount();
  const Skyline = SKYLINES[city.id];

  useEffect(() => {
    setLoading(true); setData(null); setError(null);
    const prompt = `You are a local expert on ${city.name}. Generate a detailed neighborhood guide for "${neighborhood.name}" in JSON only (no markdown, no backticks).

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

Include 8-10 real items per category. For apartments, generate 10 realistic rental listings for ${neighborhood.name} with varied bedroom counts (studios, 1br, 2br, 3br) and price tiers (budget/mid/luxury). For jobs include 6-8 top industries and 5-6 major employers. For schools include real public, private, and universities near ${neighborhood.name}. For community include real subreddit, Facebook groups, and Discord servers for ${city.name}. Mark the top 2 must-visit food spots with must:true.`;

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
        max_tokens: 6000,
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
                        <div style={{ height:"100%", width:`${((s.v||0)/s.max)*100}%`, background:safetyColor, borderRadius:"2px" }} />
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

function RelocationDashboard({ onClose, cities }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const [moveDate, setMoveDate] = useLocalStorage("relo_moveDate", "");
  const [moveCity, setMoveCity] = useLocalStorage("relo_moveCity", "");
  const [checklist, setChecklist] = useLocalStorage("relo_checklist", DEFAULT_CHECKLIST);
  const [savedNeighborhoods, setSavedNeighborhoods] = useLocalStorage("relo_neighborhoods", []);
  const [savedApartments, setSavedApartments] = useLocalStorage("relo_apartments", []);
  const [budget, setBudget] = useLocalStorage("relo_budget", { total: 10000, expenses: [] });
  const [newExpense, setNewExpense] = useState({ label:"", category: BUDGET_CATEGORIES[0], amount:"" });
  const [newTask, setNewTask] = useState("");

  const daysUntilMove = moveDate ? Math.ceil((new Date(moveDate) - new Date()) / (1000*60*60*24)) : null;
  const checkDone = checklist.filter(c => c.done).length;
  const totalSpent = budget.expenses.reduce((a,b) => a + (b.amount||0), 0);
  const remaining = budget.total - totalSpent;

  const toggleCheck = id => setChecklist(checklist.map(c => c.id === id ? {...c, done:!c.done} : c));
  const addTask = () => {
    if (!newTask.trim()) return;
    setChecklist([...checklist, { id: Date.now().toString(), category:"Custom", task:newTask.trim(), done:false }]);
    setNewTask("");
  };
  const addExpense = () => {
    if (!newExpense.label || !newExpense.amount) return;
    setBudget({ ...budget, expenses: [...budget.expenses, { ...newExpense, amount: parseFloat(newExpense.amount), id: Date.now() }] });
    setNewExpense({ label:"", category:BUDGET_CATEGORIES[0], amount:"" });
  };
  const removeExpense = id => setBudget({ ...budget, expenses: budget.expenses.filter(e => e.id !== id) });
  const removeNeighborhood = name => setSavedNeighborhoods(savedNeighborhoods.filter(n => n.name !== name));
  const removeApartment = id => setSavedApartments(savedApartments.filter(a => a.id !== id));

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
  ];

  const checklistByCategory = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }} onClick={onClose}>
      <div style={{ background:"#0a0c14", border:"1px solid #2a2a3a", width:"100%", maxWidth:"780px", maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"20px 24px 0", borderBottom:"1px solid #1a1a2a", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
            <div>
              <div style={{ fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"4px" }}>My Relocation</div>
              <div style={{ fontSize:"22px", fontFamily:"Georgia,serif", color:"#fff" }}>
                {moveCity ? `Moving to ${moveCity}` : "Relocation Planner"}
              </div>
              {daysUntilMove !== null && (
                <div style={{ fontSize:"12px", color: daysUntilMove <= 7 ? "#f44336" : daysUntilMove <= 30 ? "#ff9800" : "#4caf50", marginTop:"4px" }}>
                  {daysUntilMove <= 0 ? "Move day is here!" : `${daysUntilMove} days until move`}
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
              {/* Quick stats */}
              <div style={{ textAlign:"center", background:"#111", border:"1px solid #2a2a3a", padding:"8px 14px" }}>
                <div style={{ fontSize:"16px", fontFamily:"Georgia,serif", color:"#4caf50" }}>{checkDone}/{checklist.length}</div>
                <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)", letterSpacing:"1px" }}>TASKS</div>
              </div>
              <div style={{ textAlign:"center", background:"#111", border:"1px solid #2a2a3a", padding:"8px 14px" }}>
                <div style={{ fontSize:"16px", fontFamily:"Georgia,serif", color: remaining >= 0 ? "#4caf50" : "#f44336" }}>${remaining.toLocaleString()}</div>
                <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)", letterSpacing:"1px" }}>LEFT</div>
              </div>
              <button onClick={onClose} style={{ background:"transparent", border:"1px solid #2a2a3a", color:"rgba(255,255,255,0.5)", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"16px" }}>×</button>
            </div>
          </div>

          {/* Move Setup Bar */}
          <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
            <select value={moveCity} onChange={e => setMoveCity(e.target.value)}
              style={{ background:"#111", border:"1px solid #2a2a3a", color: moveCity ? "#fff" : "rgba(255,255,255,0.4)", padding:"7px 10px", fontFamily:"Georgia,serif", fontSize:"12px", cursor:"pointer", flex:"1 1 140px" }}>
              <option value="">Select destination city...</option>
              {cities.map(c => <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>)}
            </select>
            <input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)}
              style={{ background:"#111", border:"1px solid #2a2a3a", color:"#fff", padding:"7px 10px", fontFamily:"Georgia,serif", fontSize:"12px", flex:"1 1 140px" }} />
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:"0" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ background:"transparent", border:"none", borderBottom: activeTab===t.id ? "2px solid #5b8db8" : "2px solid transparent", color: activeTab===t.id ? "#fff" : "rgba(255,255,255,0.4)", padding:"10px 16px", fontSize:"11px", cursor:"pointer", fontFamily:"Georgia,serif", whiteSpace:"nowrap", transition:"color 0.15s" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ overflowY:"auto", flex:1, padding:"20px 24px 24px" }}>

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
                      <div style={{ width:"28px", height:"28px", borderRadius:"50%", background: m.done ? "#4caf50" : "#1a1a2e", border:`2px solid ${m.done ? "#4caf50" : "#2a2a3a"}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", zIndex:1 }}>
                        {m.done ? "✓" : ""}
                      </div>
                      <div style={{ background:"#111", border:`1px solid ${m.done ? "#4caf5033" : "#2a2a3a"}`, padding:"12px 16px", flex:1 }}>
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
                <div style={{ height:"100%", width:`${(checkDone/checklist.length)*100}%`, background:"#4caf50", borderRadius:"2px", transition:"width 0.3s" }} />
              </div>
              {Object.entries(checklistByCategory).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom:"20px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"8px" }}>{cat}</div>
                  <div style={{ display:"grid", gap:"6px" }}>
                    {items.map(item => (
                      <div key={item.id} onClick={() => toggleCheck(item.id)}
                        style={{ display:"flex", alignItems:"center", gap:"12px", background:"#111", border:`1px solid ${item.done ? "#4caf5033" : "#2a2a3a"}`, padding:"10px 14px", cursor:"pointer", transition:"all 0.15s" }}>
                        <div style={{ width:"18px", height:"18px", borderRadius:"3px", border:`2px solid ${item.done ? "#4caf50" : "#3a3a4a"}`, background: item.done ? "#4caf50" : "transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", color:"#fff" }}>
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
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>{a.address} · {a.beds === 0 ? "Studio" : `${a.beds}BR`} · {a.rent}</div>
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
              {/* Total Budget Setting */}
              <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"16px", marginBottom:"20px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"6px" }}>Total Relocation Budget</div>
                <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                  <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"16px" }}>$</span>
                  <input type="number" value={budget.total} onChange={e => setBudget({...budget, total: parseFloat(e.target.value)||0})}
                    style={{ background:"transparent", border:"none", borderBottom:"1px solid #3a3a4a", color:"#fff", fontSize:"22px", fontFamily:"Georgia,serif", width:"140px", padding:"4px 0" }} />
                </div>
                <div style={{ marginTop:"12px", height:"6px", background:"#1a1a2a", borderRadius:"3px" }}>
                  <div style={{ height:"100%", width:`${Math.min(100,(totalSpent/budget.total)*100)}%`, background: remaining < 0 ? "#f44336" : remaining < budget.total*0.2 ? "#ff9800" : "#4caf50", borderRadius:"3px", transition:"width 0.3s" }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"8px", fontSize:"12px" }}>
                  <span style={{ color:"rgba(255,255,255,0.4)" }}>Spent: ${totalSpent.toLocaleString()}</span>
                  <span style={{ color: remaining >= 0 ? "#4caf50" : "#f44336" }}>Remaining: ${remaining.toLocaleString()}</span>
                </div>
              </div>

              {/* Add Expense */}
              <div style={{ background:"#111", border:"1px solid #2a2a3a", padding:"14px 16px", marginBottom:"20px" }}>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"10px" }}>Add Expense</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  <input value={newExpense.label} onChange={e => setNewExpense({...newExpense, label:e.target.value})}
                    placeholder="Description"
                    style={{ flex:"2 1 120px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"7px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                  <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category:e.target.value})}
                    style={{ flex:"1 1 120px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"7px 8px", fontFamily:"Georgia,serif", fontSize:"12px", cursor:"pointer" }}>
                    {BUDGET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount:e.target.value})}
                    placeholder="Amount $"
                    style={{ flex:"1 1 80px", background:"#0a0a14", border:"1px solid #2a2a3a", color:"#fff", padding:"7px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />
                  <button onClick={addExpense} style={{ background:"#5b8db8", border:"none", color:"#fff", padding:"7px 16px", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"11px", letterSpacing:"1px", whiteSpace:"nowrap" }}>+ Add</button>
                </div>
              </div>

              {/* Expense List */}
              {budget.expenses.length === 0 ? (
                <div style={{ textAlign:"center", padding:"32px", color:"rgba(255,255,255,0.35)", fontSize:"13px" }}>No expenses tracked yet</div>
              ) : (
                <div style={{ display:"grid", gap:"6px" }}>
                  {budget.expenses.map(e => (
                    <div key={e.id} style={{ display:"flex", alignItems:"center", gap:"12px", background:"#111", border:"1px solid #2a2a3a", padding:"10px 14px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"13px", color:"#fff" }}>{e.label}</div>
                        <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", marginTop:"2px" }}>{e.category}</div>
                      </div>
                      <div style={{ fontSize:"15px", color:"#fff", fontFamily:"Georgia,serif" }}>${(e.amount||0).toLocaleString()}</div>
                      <button onClick={() => removeExpense(e.id)} style={{ background:"transparent", border:"1px solid #3a3a4a", color:"rgba(255,255,255,0.4)", width:"24px", height:"24px", borderRadius:"50%", cursor:"pointer", fontSize:"12px" }}>×</button>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"flex-end", padding:"10px 14px", borderTop:"1px solid #2a2a3a", marginTop:"4px" }}>
                    <span style={{ fontSize:"15px", color:"#fff", fontFamily:"Georgia,serif" }}>Total: ${totalSpent.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("entry");
  const [showCoL, setShowCoL] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  return (
    <>
      {showCoL && <CostOfLivingTool onClose={() => setShowCoL(false)} cities={CITIES} />}
      {showDashboard && <RelocationDashboard onClose={() => setShowDashboard(false)} cities={CITIES} />}

      {/* Floating Buttons */}
      <div style={{ position:"fixed", bottom:"24px", right:"24px", zIndex:50, display:"flex", flexDirection:"column", gap:"10px", alignItems:"flex-end" }}>
        <button onClick={() => setShowDashboard(true)}
          style={{ background:"#1a2a1a", border:"1px solid #3a5a3a", color:"#fff", padding:"10px 16px", cursor:"pointer", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"Georgia,serif", backdropFilter:"blur(8px)", boxShadow:"0 4px 20px rgba(0,0,0,0.4)", display:"flex", alignItems:"center", gap:"8px" }}>
          📋 My Move
        </button>
        <button onClick={() => setShowCoL(true)}
          style={{ background:"#1a1a2e", border:"1px solid #3a3a5a", color:"#fff", padding:"10px 16px", cursor:"pointer", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"Georgia,serif", backdropFilter:"blur(8px)", boxShadow:"0 4px 20px rgba(0,0,0,0.4)", display:"flex", alignItems:"center", gap:"8px" }}>
          💰 Cost of Living
        </button>
      </div>

      {screen === "entry" && <SplitEntry onKnow={() => setScreen("know")} onExplore={() => setScreen("explore")} />}
      {screen === "know" && <KnowPath onBack={() => setScreen("entry")} />}
      {screen === "explore" && <ExplorePath onBack={() => setScreen("entry")} />}
    </>
  );
}
