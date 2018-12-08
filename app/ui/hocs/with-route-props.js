import { withHandlers } from 'recompose';
import { primaryLocale, otherLocales } from '/app/intl';

export const urlWithLocale = (locale, url) => ((locale === primaryLocale) ? url : `/${locale}${url}`);

// switch locals for a URL
export const toUrlWithlocale = (newLocale, location) => {
  console.log('=> toUrlWithlocale')
  const parts = location.pathname.split('/');

  if (otherLocales.includes(parts[1])) {
    // We have a URL in the form /locale/...
    if (newLocale === primaryLocale) {
      // Remove the locale for the primary Locale
      return `/${parts.slice(2).join('/')}${location.search}${location.hash}`;
    }

    // Replace the locale
    parts[1] = newLocale;
    return `${parts.join('/')}${location.search}${location.hash}`;
  }

  // We have a URL without a locale (must be the primary locale)
  if (newLocale === primaryLocale) return `${location.pathname}${location.search}${location.hash}`;

  return `/${newLocale}${location.pathname}${location.search}${location.hash}`;
};

// Provides functions to get the url of a given route.
// Requires `injectIntl` as a HOC for most functions, and withRouter for `toUrlWithlocale`


// withHandlers allows you to create "handlers," which are functions that do things in response to DOM
// synthetic events.
// A handler function accept your base component's props as their first argument and
//  can accept the event argument (which represents the data collected from the triggered event)
// as well as multiple values passed to the handler from your onEvent property.
// withHandlers({
//   handleClick: props => event => {
//     console.log(event)
//     alert('<div> was clicked!')
//     props.doSomething()
//   },
// })
const withRouteProps = withHandlers(
  // pass base component props
  {
  toUrlWithlocale: ({ location }) => newLocale => toUrlWithlocale(newLocale, location),
  urlWithLocale: ({ intl: { locale } }) => url => urlWithLocale(locale, url),
  homeUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/'),
  loginUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/login'),
  signupUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/signup'),
  verifyEmailUrl: ({ intl: { locale } }) => token => urlWithLocale(locale, `/verify-email/${token || ':token'}`),
  verifyEmailExpiredUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/link-expired'),
  resetPasswordUrl: ({ intl: { locale } }) => token => urlWithLocale(locale, `/reset-password/${token || ':token'}`),
  forgotPasswordUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/forgot-password'),
  dataTestUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/data-test'),
  adminUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/admin'),
  quotationsUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/admin/quotations'),
  orderDetailsUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/admin/order-details'),
  vendorPurchaseUrl: ({ intl: { locale } }) => () => urlWithLocale(locale, '/admin/vendor-purchase'),

});

export default withRouteProps;
