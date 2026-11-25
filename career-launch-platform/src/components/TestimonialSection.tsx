import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, MessageSquare, Pause, Play, Star } from 'lucide-react';

import afraa from '../assets/images/testimonials/afraa.png';
import jennifer from '../assets/images/testimonials/jennifer.png';
import arushi from '../assets/images/testimonials/arushi.png';
import tanki from '../assets/images/testimonials/tanki.png';
import tsireletso from '../assets/images/testimonials/tsireletso.png';
import karina from '../assets/images/testimonials/karina.png';
import lineo from '../assets/images/testimonials/lineo.png';
import bipana from '../assets/images/testimonials/bipana.png';

type Source = 'Email' | 'Message' | 'Public review';

type Testimonial = {
  image: string;
  /** Widest the screenshot is shown, in px. The image files are saved at about 2x this size so the text stays sharp. */
  width: number;
  /** What the screenshot says — read out by screen readers. */
  alt: string;
  name: string;
  /** Shown under the name. Leave '' to show the name only. */
  role: string;
  source: Source;
};

/* ─────────────────────────────────────────────────────────────────────────
   TO ADD A TESTIMONIAL
   1. Crop the screenshot (no email address, no internal details) and save it
      in src/assets/images/testimonials/
   2. Add an `import` line for it above
   3. Add one entry to this list
   Order here = order on the page.
   ───────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS: Testimonial[] = [
  {
    image: afraa,
    width: 1130,
    alt: 'Email thanking the team for their guidance and support throughout the internship, calling it a valuable learning opportunity.',
    name: 'Afraa Siraj',
    role: 'Team Head, former intern',
    source: 'Email',
  },
  {
    image: tanki,
    width: 1130,
    alt: 'Email expressing sincere appreciation for a twelve-week internship, describing it as an important milestone that provided technical knowledge, industry experience and a deeper understanding of teamwork.',
    name: 'Tanki Rapulungoane',
    role: 'IT Tech Support Intern, Team Leader',
    source: 'Email',
  },
  {
    image: tsireletso,
    width: 1115,
    alt: 'Email thanking the team for guidance, feedback and the opportunity to learn and grow during a virtual internship, including encouragement to explore new areas and become more confident.',
    name: 'Tsireletso Thatho',
    role: 'Virtual intern, Computer Science & IT student',
    source: 'Email',
  },
  {
    image: jennifer,
    width: 1125,
    alt: 'Email saying thank you for the opportunity to be part of the team over the past year, working on accessibility and front-end development and mentoring contributors.',
    name: 'Jennifer',
    role: 'Accessibility & front-end contributor',
    source: 'Email',
  },
  {
    image: arushi,
    width: 860,
    alt: 'Email giving sincere thanks for the opportunity to learn in a professional environment and to be involved in something meaningful.',
    name: 'Arushi Singhi',
    role: '',
    source: 'Email',
  },
  {
    image: karina,
    width: 470,
    alt: 'Message saying she really enjoyed her time with the team, learned so much and truly appreciated it.',
    name: 'Karina De Santiago',
    role: '',
    source: 'Message',
  },
  {
    image: bipana,
    width: 1000,
    alt: 'Five-star review from a former intern describing the passion and dedication of the team she worked closely with.',
    name: 'Bipana Tripathi',
    role: 'Former intern',
    source: 'Public review',
  },
  {
    image: lineo,
    width: 1000,
    alt: 'Five-star review saying the project has been a great experience to work on.',
    name: 'Lineo Mahlakeng',
    role: '',
    source: 'Public review',
  },
];

/** Milliseconds each testimonial stays on screen before sliding to the next. */
const AUTO_MS = 6000;

const SOURCE_ICON: Record<Source, React.ReactNode> = {
  Email: <Mail className="w-4 h-4" aria-hidden="true" />,
  Message: <MessageSquare className="w-4 h-4" aria-hidden="true" />,
  'Public review': <Star className="w-4 h-4" aria-hidden="true" />,
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const TestimonialSection: React.FC = () => {
  const count = TESTIMONIALS.length;
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false); // mouse over / keyboard focus inside
  const [stopped, setStopped] = useState(false); // visitor pressed Pause

  const go = (i: number) => setIndex((i + count) % count);

  // Auto-slide. Pauses on hover/focus, when Pause is pressed, and for visitors
  // whose device is set to "reduce motion".
  useEffect(() => {
    if (count < 2 || hovering || stopped) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [index, hovering, stopped, count]);

  if (count === 0) return null;
  const t = TESTIMONIALS[index];

  return (
    <section aria-labelledby="testimonials-heading" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#ea580c] uppercase mb-2">
            In their own words
          </p>
          <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-bold text-[#102a43] tracking-tight text-balance">
            From people who have worked with us
          </h2>
        </div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          <figure
            key={index}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 bg-[#f8fafc] border-b border-slate-200 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                {SOURCE_ICON[t.source]}
                {t.source}
              </span>
              {count > 1 && (
                <span className="tabular-nums">
                  {index + 1} / {count}
                </span>
              )}
            </div>

            {/* Fixed minimum height so the page below does not jump between slides. */}
            <div className="px-5 sm:px-6 py-6 overflow-x-auto min-h-[190px] flex items-center">
              <img
                src={t.image}
                alt={t.alt}
                loading="lazy"
                className="block h-auto mx-auto"
                style={{ width: '100%', maxWidth: t.width, minWidth: Math.min(t.width, 760) }}
              />
            </div>

            <figcaption className="flex items-center gap-3 px-5 sm:px-6 py-4 border-t border-slate-200">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-full bg-[#102a43] text-white text-sm font-bold flex items-center justify-center shrink-0"
              >
                {initials(t.name)}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#102a43]">{t.name}</span>
                {t.role && <span className="block text-xs text-slate-600">{t.role}</span>}
              </span>
            </figcaption>
          </figure>

          {count > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="w-11 h-11 rounded-full border border-slate-300 text-[#102a43] hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="flex items-center">
                {TESTIMONIALS.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show testimonial ${i + 1} of ${count}`}
                    aria-current={i === index ? 'true' : undefined}
                    className="w-6 h-11 flex items-center justify-center cursor-pointer"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all ${
                        i === index ? 'w-5 bg-[#ea580c]' : 'w-2 bg-slate-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="w-11 h-11 rounded-full border border-slate-300 text-[#102a43] hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setStopped((s) => !s)}
                aria-label={stopped ? 'Resume automatic sliding' : 'Pause automatic sliding'}
                className="w-11 h-11 rounded-full text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                {stopped ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
