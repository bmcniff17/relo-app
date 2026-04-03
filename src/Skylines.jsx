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

export default SKYLINES;
