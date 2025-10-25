'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';
import { blogPosts } from '../../content/blog';

gsap.registerPlugin(ScrollTrigger);

export function BlogSection() {
  const container = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = container.current;
    const rail = railRef.current;
    if (!section || !rail || reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(rail, { '--blog-progress': 0 });

      gsap.to(rail, {
        '--blog-progress': blogPosts.length - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const next = Math.round(self.progress * (blogPosts.length - 1));
            setActiveIndex(next);
          },
        },
      });

      gsap.to('.blog-carousel__item', {
        boxShadow: '0 0 60px rgba(216, 187, 125, 0.25)',
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { amount: 1.2, repeat: -1 },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={container}
      className="story-panel blog-panel"
      aria-labelledby="blog-heading"
      data-guided-section="blog"
      data-story-panel
    >
      <div className="story-panel__inner">
        <div className="story-panel__header">
          <p className="story-panel__eyebrow">Capitolo · Journal</p>
          <h2 id="blog-heading">Dietro le quinte del nostro laboratorio.</h2>
          <p className="story-panel__lead">
            Pensieri, processi e breakdown tecnici per condividere il metodo. Ogni articolo è una scena del nostro reel in
            continua evoluzione.
          </p>
        </div>
        <div className="blog-panel__carousel" ref={railRef}>
          {blogPosts.map((post, index) => (
            <article
              key={post.slug}
              className={clsx('blog-carousel__item', 'card--carbon')}
              data-active={activeIndex === index ? 'true' : 'false'}
              style={{ '--item-index': index, '--item-count': blogPosts.length } as CSSProperties}
            >
              <div className="blog-carousel__meta">
                <span>{post.category}</span>
                <span>{post.readingTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="blog-carousel__link">
                Leggi l&apos;articolo
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
