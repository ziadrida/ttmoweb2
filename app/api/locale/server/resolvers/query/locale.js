import { ApolloError } from 'apollo-server-express';
import en from '/app/intl/locales/en';
//import fr from '/app/intl/locales/fr';
import ar from '/app/intl/locales/ar'

const locales = { en,ar};

const locale = (root, args) => {
  console.log('=>query locale ')
  const { locale: lc, section } = args;
  console.log('locale:',lc)
  console.log('section:',section)
  const messages = locales[lc][section];

  if (!messages) {
    throw new ApolloError(`Locale ${locale}/${section} not found`);
  }

  return { locale: lc, messages };
};

export default locale;
