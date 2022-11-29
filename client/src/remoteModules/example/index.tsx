import React, { Component, Fragment } from 'react';
import Center from 'deql/helpers/components/Center';

class NotWork extends Component {
  render() {
    return (
      <Center
        style={{
          position: 'absolute',
          flexDirection: 'column',
          color: '#F0F',
        }}
      >
        Я удаленный компонент
      </Center>
    );
  }
}

export default { component: NotWork };
