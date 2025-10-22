'use client';

import { useState, type FormEvent } from 'react';
import clsx from 'clsx';

const topics = [
  { label: 'Social Media Management', value: 'social-media' },
  { label: 'Web Design & Branding', value: 'web-design' },
  { label: 'Advertising', value: 'advertising' },
  { label: 'SEO', value: 'seo' }
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(form)),
        headers: { 'Content-Type': 'application/json' }
      });
      setSubmitted(true);
    } catch (error) {
      console.error('[contact:error]', error);
      alert('Impossibile inviare la richiesta in questo momento.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} aria-label="Contact form">
      <div className="form__grid">
        <label>
          <span>Nome *</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label>
          <span>Email *</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>Azienda</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>
        <label>
          <span>Budget stimato</span>
          <input name="budget" type="text" placeholder="Es. 50K€/anno" />
        </label>
      </div>
      <fieldset className="form__fieldset">
        <legend>Servizio di interesse *</legend>
        <div className="form__chips" role="radiogroup">
          {topics.map((topic) => (
            <label key={topic.value} className={clsx('form__chip')}>
              <input type="radio" name="topic" value={topic.value} required />
              <span>{topic.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        <span>Raccontaci la sfida *</span>
        <textarea name="message" rows={5} required />
      </label>
      <button type="submit" className="form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Invio…' : 'Invia richiesta'}
      </button>
      {submitted && <p className="form__success">Richiesta inviata. Ti risponderemo entro 24h.</p>}
    </form>
  );
}
