import styles from "./airmail-stamp.module.css";

export function AirmailStamp() {
  return (
    <svg x="418" y="81" width="124" height="198" viewBox="133 72 254 346" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="paper-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".7" fill="#193d37" opacity=".25" />
        </pattern>
      </defs>
      <g>
          <rect x="59" y="52" width="402" height="388" fill="#e6dab8"/>
          <circle cx="343" cy="202" r="102" fill="#ee663c"/>
          <g className={styles.cloud} fill="none" stroke="#fff6dc" strokeWidth="5" strokeLinecap="round">
            <path d="M47 169h72m-40 12h65m244-49h88m-63 12h36"/>
          </g>
          <path d="M45 370 175 278 220 303 329 169 477 339v105H45Z" fill="#719888"/>
          <path d="m277 232 52-63 49 57-30-16-12 10-14-17-20 23 1-13Z" fill="#fff7df"/>
          <path d="m45 360 102-53 61 18 82-41 65 27 121-50v186H45Z" fill="#35655a"/>
          <path d="M48 348q85-36 175 8t248-29v120H48Z" fill="#163e36"/>
          <rect x="59" y="52" width="402" height="388" fill="url(#paper-dots)" />
          <path className={styles.trail} d="M71 330q80 10 72-31t-33-6q-9 33 64 12t47-59" fill="none" stroke="#fff3cc" strokeWidth="2" strokeDasharray="5 6"/>
          <g transform="translate(79 60) scale(.78)">
          <g className={styles.parcel} stroke="#173b32" strokeWidth="2.4" strokeLinejoin="round">
            <path d="m130 168 64 99 43-10 34-109m-113 15 45 101m30-111-11 104" fill="none"/>
            <path d="M130 168c-3-90 116-124 141-20q-20-11-38 5-22-11-40 6-19-8-35 4-15-7-28 5Z" fill="#ffae52"/>
            <path d="M158 163q-1-68 35-86-19 27 0 82m40-6q-6-58-40-76 57 13 78 71" fill="#e97a39"/>
            <path d="m183 263 36-15 32 11-35 18Z" fill="#ffe0a4"/>
            <path d="m183 263 33 14v38l-33-15Z" fill="#e6a851"/>
            <path d="m216 277 35-18v38l-35 18Z" fill="#bf7b39"/>
            <path d="m195 258 33 13 9-5-32-12Z" fill="#fff5d8" stroke="none"/>
            <path d="m228 271 9-5v13l-9 4Z" fill="#f6dfae" stroke="none"/>
          </g>
          </g>
          <text x="260" y="377" textAnchor="middle" fill="#fff4d5" fontFamily="Georgia, serif" fontSize="11" letterSpacing="2">VIET NAM · JAPAN</text>
      </g>
    </svg>
  );
}
