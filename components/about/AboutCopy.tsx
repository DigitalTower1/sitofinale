'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { AboutChapter } from './types';

type AboutCopyProps = {
  chapters: AboutChapter[];
  activeIndex: number;
  onRegisterChapter?: (index: number, element: HTMLElement | null) => void;
  reducedMotion: boolean;
};

const lineVariants = {
  hidden: { y: '105%', opacity: 0, filter: 'blur(8px)' },
  visible: { y: '0%', opacity: 1, filter: 'blur(0px)' }
};

const paragraphVariants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: { opacity: 1, clipPath: 'inset(0 0 0% 0)' }
};

export function AboutCopy({ chapters, activeIndex, onRegisterChapter, reducedMotion }: AboutCopyProps) {
  const prefersReduced = useReducedMotion();
  const shouldReduce = reducedMotion || prefersReduced;

  return (
    <div className="about-copy">
      <header className="about-copy__header">
        <p className="about-copy__eyebrow">Chi Siamo</p>
        <motion.h2
          id="about-heading"
          className="about-copy__title"
          initial={shouldReduce ? false : { opacity: 0, y: 40 }}
          animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Studio / DNA
        </motion.h2>
      </header>
      <div className="about-copy__chapters">
        {chapters.map((chapter, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.article
              key={chapter.id}
              ref={(node) => onRegisterChapter?.(index, node)}
              className="about-copy__chapter"
              data-active={isActive}
              data-about-chapter={chapter.id}
              initial={false}
              animate={isActive ? 'active' : 'inactive'}
              variants={{
                active: shouldReduce
                  ? { opacity: 1 }
                  : { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
                inactive: shouldReduce
                  ? { opacity: 0 }
                  : { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }
              }}
            >
              <motion.p
                className="about-copy__label"
                data-about-line
                initial={false}
                animate={isActive ? 'visible' : 'hidden'}
                variants={lineVariants}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {chapter.label}
              </motion.p>
              <motion.h3
                className="about-copy__chapter-title"
                data-about-line
                initial={false}
                animate={isActive ? 'visible' : 'hidden'}
                variants={lineVariants}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                {chapter.title}
              </motion.h3>
              <motion.p
                className="about-copy__subtitle"
                data-about-line
                initial={false}
                animate={isActive ? 'visible' : 'hidden'}
                variants={lineVariants}
                transition={{ duration: 0.7, ease: 'easeOut', delay: shouldReduce ? 0 : 0.08 }}
              >
                {chapter.subtitle}
              </motion.p>
              <div className="about-copy__body">
                {chapter.paragraphs.map((paragraph, paragraphIndex) => (
                  <motion.p
                    key={paragraph}
                    className="about-copy__paragraph"
                    data-about-line
                    initial={false}
                    animate={isActive ? 'visible' : 'hidden'}
                    variants={paragraphVariants}
                    transition={{
                      duration: 0.8,
                      ease: 'easeInOut',
                      delay: shouldReduce ? 0 : 0.12 + paragraphIndex * 0.08
                    }}
                  >
                    <span className="about-copy__paragraph-inner">
                      <motion.span
                        initial={false}
                        animate={isActive ? 'visible' : 'hidden'}
                        variants={lineVariants}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: shouldReduce ? 0 : 0.1 + paragraphIndex * 0.06 }}
                      >
                        {paragraph}
                      </motion.span>
                    </span>
                  </motion.p>
                ))}
              </div>
              <ul className="about-copy__highlights">
                {chapter.highlights.map((highlight, highlightIndex) => {
                  const segments = highlight.split('|');
                  return (
                    <motion.li
                      key={`${chapter.id}-highlight-${highlightIndex}`}
                      className="about-copy__highlight"
                      data-about-line
                      initial={false}
                      animate={isActive ? 'visible' : 'hidden'}
                      variants={paragraphVariants}
                      transition={{
                        duration: 0.7,
                        ease: 'easeOut',
                        delay: shouldReduce ? 0 : 0.16 + highlightIndex * 0.06
                      }}
                    >
                      {segments.map((chunk, chunkIndex) => (
                        <span key={`${chapter.id}-chunk-${chunkIndex}`} className="about-copy__highlight-chunk">
                          {chunk}
                        </span>
                      ))}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
