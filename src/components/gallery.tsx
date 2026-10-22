"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Product photos. Desktop: one large image with thumbnails that crossfade.
 * Mobile: a swipeable row so the buy controls stay close to the top.
 */
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const alt = (i: number) => (i === 0 ? name : `${name}, photo ${i + 1}`);

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none]">
          {images.map((src, i) => (
            <div
              key={src}
              className={`frame aspect-[4/5] shrink-0 snap-center ${images.length > 1 ? "w-[86%]" : "w-full"}`}
            >
              <Image src={src} alt={alt(i)} fill preload={i === 0} sizes="86vw" className="object-cover" />
            </div>
          ))}
        </div>
        {images.length > 1 && <p className="meta mt-3">{images.length} photos — swipe to see more</p>}
      </div>

      {/* Desktop */}
      <div className="hidden gap-4 md:grid md:grid-cols-[4.5rem_1fr] lg:gap-6">
        {images.length > 1 ? (
          <ul className="space-y-3" aria-label="Choose a photo">
            {images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  aria-label={`Show photo ${i + 1}`}
                  className="frame block aspect-[4/5] w-full opacity-55 transition-opacity hover:opacity-100 aria-pressed:opacity-100 aria-pressed:outline aria-pressed:outline-1 aria-pressed:outline-offset-2 aria-pressed:outline-ink"
                >
                  <Image src={src} alt="" fill sizes="72px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div />
        )}
        <div className="frame aspect-[4/5]">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={alt(i)}
              fill
              preload={i === 0}
              sizes="(min-width: 1440px) 760px, 52vw"
              aria-hidden={i !== active}
              className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
