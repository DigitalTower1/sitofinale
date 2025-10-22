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

export const kpiDatasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Digital Tower Growth Benchmarks',
  description:
    'Metriche sintetiche dei progetti Digital Tower: revenue lift medio 3.8x, go-live 45 giorni, +214% lead qualificati, INP 98ms.',
  creator: {
    '@type': 'Organization',
    name: 'Digital Tower'
  },
  inLanguage: ['it', 'en'],
  license: 'https://creativecommons.org/licenses/by/4.0/',
  variableMeasured: [
    {
      '@type': 'PropertyValue',
      name: 'Revenue lift medio',
      value: '3.8',
      unitText: 'X'
    },
    {
      '@type': 'PropertyValue',
      name: 'Tempo di go-live',
      value: '45',
      unitText: 'Giorni'
    },
    {
      '@type': 'PropertyValue',
      name: 'Incremento lead qualificati',
      value: '214',
      unitText: 'Percent'
    },
    {
      '@type': 'PropertyValue',
      name: 'INP mediano monitorato',
      value: '98',
      unitText: 'Millisecond'
    }
  ]
};
