import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { FormattedMessage as T, injectIntl } from 'react-intl';
import { compose, setDisplayName } from 'recompose';
import { withRouteProps } from '/app/ui/hocs';

// set title in App Bar (not very useful!)
const HeaderTitle = ({
  homeUrl,
  loginUrl,
  signupUrl,
  verifyEmailUrl,
  verifyEmailExpiredUrl,
  forgotPasswordUrl,
  resetPasswordUrl,
  dataTestUrl,
  adminUrl,
  quotationsUrl,
  orderDetailsUrl,
  vendorPurchaseUrl,
}) => (
  <Switch>
    <Route path={homeUrl()} exact render={() => <T id="homeHeaderTitle" />} />
    <Route path={loginUrl()} render={() => <T id="loginTitle" />} />
    <Route path={signupUrl()} render={() => <T id="signupTitle" />} />
    <Route path={verifyEmailUrl()} render={() => <T id="verifyEmailTitle" />} />
    <Route path={verifyEmailExpiredUrl()} render={() => <T id="verifyEmailTitle" />} />
    <Route path={forgotPasswordUrl()} render={() => <T id="forgotPasswordTitle" />} />
    <Route path={resetPasswordUrl()} render={() => <T id="resetPasswordTitle" />} />
    <Route path={dataTestUrl()} render={() => <T id="dataTestTitle" />} />
    <Route path={adminUrl()} render={() => <T id="adminHeaderTitle" />} />
    <Route path={quotationsUrl()} render={() => <T id="quotationsHeaderTitle" />} />
    <Route path={orderDetailsUrl()} render={() => <T id="orderDetailsHeaderTitle" />} />
    <Route path={vendorPurchaseUrl()} render={() => <T id="vendorPurchaseHeaderTitle" />} />
    <Route render={() => <T id="notFoundTitle" />} />
  </Switch>
);

HeaderTitle.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};


export default compose(
  injectIntl,
  withRouteProps, // fix url based on locale
  withRouter, // withRouter provides access to location.pathname
  setDisplayName('HeaderTitle'), //Assigns to the propTypes property on the base component.
)(HeaderTitle);
