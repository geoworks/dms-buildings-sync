import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AsyncComponent from 'deql/helpers/components/AsyncComponent';
import NoMatch from 'deql/helpers/components/NoMatch';
import { searchRuleInRoles } from '@/helpers';
import NotWork from './NotWork';
import InProgress from './inProgress';
import './style.less';

import MainLayout from './vsweb/Layout';
// import Layout from './common/Layout';

// Маршруты вынесены не просто так =)
// const routes = [
//   <Route
//     key="vsweb"
//     path="/vsweb"
//     component={AsyncComponent(() => {
//       return System.import(/* webpackChunkName: "vsweb" */ './vsweb/Layout');
//     })}
//   />,
// ];

const LayoutWrapper = ({ user, defaultRoute, location, match }) => {
  defaultRoute = 'main/';
  return (
    <Switch key="general">
      {/* {user.isElevated
        ? searchRuleInRoles(user.roles, 'ui:showAdminEntrance')
          ? routes
          : routes.map(item => {
            if (item.key !== 'admin') {
              return item;
            }
          })
        : routes.map(item => {
          if (
            item.key !== 'user' &&
              item.key !== 'admin' &&
              item.key !== 'reports'
          ) {
            return item;
          }
        })} */}
      <Route
        key="default"
        exact
        path="/"
        render={() => <Redirect to={'/' + defaultRoute} />}
      />
      <MainLayout />
      <Route key="notfound" path="/*" component={NoMatch} />
    </Switch>
  );
};
export default LayoutWrapper;
