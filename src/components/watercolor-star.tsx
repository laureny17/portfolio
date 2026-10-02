"use client";

import { useEffect, useId, useRef } from "react";

export const STAR_PATH =
  "M151.1,131.7c12.6-2.2,23.3-10.7,31.3-20.6,8-9.9,13.8-21.3,20.7-32.1,11.3-17.6,25.5-33.4,41.9-46.5,7.8-6.2,16.7-12.1,26.7-12.4,14.4-.4,18.5,5.1,24.4,18.1,5.9,13,10.1,35.4,12.9,49.8,4.7,24.6,11.9,53.7,14.6,64.3.3,1.1,9,15.9,11,17.4,12.2,8.8,20.7,10.4,27,12.4,25.4,8.2,26.9,9.9,52.8,20.5,4.2,1.7,24.2,12.2,26.6,16,4.2,6.4,13.4,14.6,11.7,22-3.9,16.6-20.7,34.1-35.5,41.2-19.9,9.6-46.5,17.6-59.2,32.3-9.5,11.1-6.7,27.3-8.2,41.8-1.5,14.5,1.7,36.8-1.9,53.6-5.3,24.8-11.4,34.6-26,36.4-17.9,2.2-51-36.4-63.3-49.4-21.9-23.1-29-45-61-46.2-16.8-.6-45.9,23.2-61.9,28.2-18.6,5.9-34.2,12.5-53.5,15.3-11.3,1.6-26.3-1.2-35.3-8.1-9.4-7.2-2-29.3,2.2-40.3,6.4-16.8,6.9-16.4,15.4-31.4,7.2-12.7,10.9-18.9,18.8-34.1,2.5-4.8,10.7-17.2,8.9-22.2-6-16.4-28.3-33.6-31.2-37.2-14.5-18.4-39.3-36.8-40.6-54-.3-4.6-1.1-12.5-.2-17,1.5-7.3,15.1-15.9,22.4-17.7,41.6-10,81,4.7,108.3,0h0Z";

type WatercolorStarProps = {
  size?: number;
  className?: string;
  seed?: number;
  color?: string; // pigment
  edgeColor?: string; // pooled pigment at the rim
  /** Bloom in like wet paint on mount, then let the edges keep shifting slowly. */
  animate?: boolean;
};

/**
 * The site star, run through an SVG filter that fakes a watercolor wash:
 * turbulence-displaced edges, a soft body, darker pigment pooling at the rim,
 * and paper grain. Multiply-blended so it sits "in" the white page.
 */
export default function WatercolorStar({
  size = 160,
  className = "",
  seed = 4,
  color = "#b3c6fa",
  edgeColor = "#7894e6",
  animate = false,
}: WatercolorStarProps) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animate) return;
    const svg = svgRef.current;
    if (!svg) return;
    // Reduced motion: leave the filter at its settled values (the fade-in is
    // already neutralized by the global reduced-motion rule).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    svg
      .querySelectorAll<SVGAnimationElement>("animate")
      .forEach((a) => a.beginElement());
  }, [animate]);

  const settledScale = 22;
  const settledBlur = 1.2;

  return (
    <svg
      ref={svgRef}
      viewBox="-40 -40 553 546"
      width={size}
      height={size}
      className={className}
      style={{ mixBlendMode: "multiply", overflow: "visible" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id={`wc-${id}`}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          {/* Wobbly outline: big, slow distortion of the shape */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves={3}
            seed={seed}
            result="noise"
          >
            {animate && (
              <animate
                attributeName="baseFrequency"
                values="0.012;0.0145;0.011;0.012"
                dur="18s"
                begin="indefinite"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={settledScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="shapeWobble"
          >
            {animate && (
              <animate
                attributeName="scale"
                values={`90;${settledScale}`}
                keyTimes="0;1"
                keySplines="0.22 1 0.36 1"
                calcMode="spline"
                dur="2.6s"
                begin="indefinite"
                fill="freeze"
              />
            )}
          </feDisplacementMap>

          {/* Fine fringes where the paint bled into the paper */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045"
            numOctaves={2}
            seed={seed + 3}
            result="fringeNoise"
          />
          <feDisplacementMap
            in="shapeWobble"
            in2="fringeNoise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="shape"
          />
          <feGaussianBlur in="shape" stdDeviation={settledBlur} result="soft">
            {animate && (
              <animate
                attributeName="stdDeviation"
                values={`18;${settledBlur}`}
                keyTimes="0;1"
                keySplines="0.22 1 0.36 1"
                calcMode="spline"
                dur="2.6s"
                begin="indefinite"
                fill="freeze"
              />
            )}
          </feGaussianBlur>

          {/* Body: uneven, blotchy pigment density */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007"
            numOctaves={2}
            seed={seed + 11}
            result="mottleNoise"
          />
          <feColorMatrix
            in="mottleNoise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.3"
            result="mottle"
          />
          <feComposite in="soft" in2="mottle" operator="in" result="mottled" />
          <feComposite
            in="mottled"
            in2="soft"
            operator="arithmetic"
            k2="0.55"
            k3="0.22"
            result="body"
          />

          {/* Pigment pooling at the rim, thicker in some places than others */}
          <feMorphology in="soft" operator="erode" radius="5" result="core" />
          <feGaussianBlur in="core" stdDeviation="5" result="coreSoft" />
          <feComposite in="soft" in2="coreSoft" operator="out" result="rim" />
          <feColorMatrix
            in="fringeNoise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 2.2 0 0 -0.55"
            result="rimMask"
          />
          <feComposite in="rim" in2="rimMask" operator="in" result="rimUneven" />
          <feFlood floodColor={edgeColor} result="edgeInk" />
          <feComposite in="edgeInk" in2="rimUneven" operator="in" result="edgeTinted" />
          <feComponentTransfer in="edgeTinted" result="edge">
            <feFuncA type="linear" slope="0.75" />
          </feComponentTransfer>

          {/* Paper grain / granulation */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves={2}
            seed={seed + 7}
            result="grainNoise"
          />
          <feColorMatrix
            in="grainNoise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.35"
            result="grainMask"
          />
          <feComposite in="edgeInk" in2="grainMask" operator="in" result="grainInk" />
          <feComposite in="grainInk" in2="soft" operator="in" result="grainClipped" />
          <feComponentTransfer in="grainClipped" result="grain">
            <feFuncA type="linear" slope="0.14" />
          </feComponentTransfer>

          <feMerge>
            <feMergeNode in="body" />
            <feMergeNode in="grain" />
            <feMergeNode in="edge" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter={`url(#wc-${id})`}
        style={animate ? { opacity: 0, animation: "wc-in 1.6s ease forwards" } : undefined}
      >
        <path
          d={STAR_PATH}
          fill={color}
          stroke={color}
          strokeWidth={40}
          strokeLinejoin="round"
        />
      </g>
      {animate && (
        <style>{`@keyframes wc-in { to { opacity: 1; } }`}</style>
      )}
    </svg>
  );
}
