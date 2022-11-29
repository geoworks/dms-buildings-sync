import React, { Component } from 'react';
//import { ChangePass } from '@/modules/profile/components/ChangePassword';
//import Profile from '@/modules/profile/components';
import Layout from 'antd/lib/layout';
import { Route, Switch } from 'react-router-dom';
import RemoteComponent from 'deql/helpers/components/RemoteComponent';
import Center from 'deql/helpers/components/Center';

const { Content } = Layout;
let isMobile = window.mobilecheck();
const CONTENT_STYLE = {
  height: 'calc(100% -64px)',
  marginTop: '60px',
  padding: isMobile ? '0px' : '0 50px',
  position: 'absolute' as const,
  width: '100%',
  overflow: 'auto',
  top: '0px',
  left: '0px',
  color: '#000',
  background: 'none',
};
const DIV_STYLE = {
  background: '#fff',
  padding: isMobile ? 5 : 24,
  minHeight: 380,
};

// Маршруты вынесены не просто так =)
// const routes = [
//   <Route
//     key="vsweb"
//     path="/vsweb"
//     component={AsyncComponent(() => {
//       return System.import(
//         /* webpackChunkName: "vswebmain" */ './../../../modules/main/index'
//       );
//     })}
//   />,
// ];
let remoteUrl = '/static/modules/example/index.js';
let route = (
  <Route
    key="main"
    path="/main/"
    component={
      RemoteComponent(remoteUrl, module => {
        return module.default.component;
      })}
  />
);
export default class extends Component {
  render() {
    return (<Center style={{ position: 'absolute' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Загрузка удаленного компонента {remoteUrl} </h3>
        <Content style={CONTENT_STYLE}> {route} </Content>
      </div>
    </Center>
    );
  }
}
