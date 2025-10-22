export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Digital Tower',
  url: 'https://digitaltower.agency',
  logo: 'https://digitaltower.agency/og/logo.svg',
  sameAs: [
    'https://www.instagram.com/digitaltower',
    'https://www.linkedin.com/company/digitaltower'
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'hello@digitaltower.agency',
      contactType: 'customer service',
      availableLanguage: ['Italian', 'English']
    }
  ]
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Marketing & Creative Direction',
  provider: {
    '@type': 'Organization',
    name: 'Digital Tower'
  },
  areaServed: 'Worldwide',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      priceCurrency: 'EUR'
    }
  }
};
