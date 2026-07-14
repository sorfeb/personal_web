import { useEffect, useState } from 'react';

/**
 * Tracks which page section currently occupies the middle of the viewport.
 *
 * Observes the elements matching `sectionIds` with an IntersectionObserver
 * whose active band is a thin horizontal strip near the viewport center, so
 * exactly one section is "current" while scrolling. Sections hidden with
 * `display: none` never intersect and are simply ignored.
 *
 * Pass a module-level constant (or otherwise stable) array for `sectionIds`.
 */
export function useScrollSpy(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // Active band: a strip from 40% to 55% of viewport height
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
