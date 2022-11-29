import React from 'react';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import Layout from 'antd/lib/layout';
import Button from 'antd/lib/button';
//import MenuBlock from '@/modules/menu/components/index';

const { Header } = Layout;

let title = 'Header'; //process.main.title
const TopMenu = ({ location }) => {
  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Link
        to="/"
        style={{
          background: '#ffFfff',
          borderRadius: '5px',
          float: 'left',
          height: '63px',
          marginRight: '5px',
        }}
      ></Link>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <h2 style={{ color: '#FFFFFF', margin: 0 }}>{title}</h2>
        <div style={{ color: '#FFF' }}>Пример меню</div>
      </div>
    </Header>
  );
};

TopMenu.propTypes = {
  location: object.isRequired,
};

TopMenu.defaultProps = {
  location: {
    pathname: '/user',
  },
};

export default TopMenu;
