"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = text.split(" ");
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block word-span">${w}</span></span>`,
      )
      .join(" ");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".word-span",
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return <h2 ref={ref} className={className} />;
}
