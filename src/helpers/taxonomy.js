export function hasTaxonomyItem(responseData) {
  return Array.isArray(responseData) && responseData.length > 0;
}

export function getTaxonomyItemURL({ taxonomy, slug, fields, country }) {
  const apiURL = getApiURLForCountry(country);
  const apiPath = `/${taxonomy}?slug=/${slug}&_fields=${fields.join(',')}`;

  return apiURL + apiPath;
}

/**
 * finder.com and finder.com.au are two WP-powered websites
 */

const supportedCountries = ['au', 'us', 'uk', 'ca', 'nz', 'sg'];

function getApiURLForCountry(country) {
  if (!supportedCountries.includes(country)) {
    throw Error(
      `Unsupported country: ${country}. Try using any of these ${supportedCountries.join(
        ', ',
      )}.`,
    );
  }

  if (country === 'au') {
    return 'https://finder.com.au/wp-json/wp/v2';
  }

  return `https://finder.com/${country}/wp-json/wp/v2`;
}
