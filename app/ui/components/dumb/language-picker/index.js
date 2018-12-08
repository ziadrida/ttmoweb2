import React from 'react';
import { compose, setDisplayName } from 'recompose';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import styled from 'styled-components';
import { withRouteProps } from '/app/ui/hocs';

const StyledLink = styled(Link)`
  color: white;
  :hover {
      color: red;
    }
  font-variant: small-caps;
  background: ${props => {
    //console.log('props:',props);
     return ( props.linklang==props.to)? "orange" : ''}};

`;


const LanguagePicker = ({ className, toUrlWithlocale }) => (
  <div className={className}>
    <StyledLink linklang={location.pathname} to={toUrlWithlocale('en')}><T id="langsEn" /> </StyledLink>
    &nbsp;|&nbsp;
    <StyledLink linklang={location.pathname} to={toUrlWithlocale('ar')}><T id="langsAr" /> </StyledLink>
  </div>
);

const StyledLanguagePicker = styled(LanguagePicker)`
  padding: 0 20px;
`;

export default compose(
  withRouter,
  withRouteProps,
  setDisplayName('LanguagePicker'),
)(StyledLanguagePicker);
