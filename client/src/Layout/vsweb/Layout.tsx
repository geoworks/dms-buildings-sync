import React from 'react';
import { object } from 'prop-types';
import Layout from 'antd/lib/layout';
import { ErrorBoundary } from 'deql/helpers/components/ErrorBoundary';
import Content from './Content';
import Header from './Header';

const ProfileLayout = ({ location }) => {
  return (
    <ErrorBoundary>
      <Layout key="common">
        <Header location={location} />
        <Content />
      </Layout>
    </ErrorBoundary>
  );
};

ProfileLayout.propTypes = {
  location: object.isRequired,
};

ProfileLayout.defaultProps = {
  location: {
    pathname: '/user',
  },
};

export default ProfileLayout;
