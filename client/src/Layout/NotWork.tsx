import React, { Component, Fragment } from 'react';
import Center from 'deql/helpers/components/Center';
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

export default class NotWork extends Component<any> {



  render() {
    return (<Center style={{ position: 'absolute', flexDirection: 'column' }}>
      <p><Icon type="loading" style={{ fontSize: '30px' }}></Icon></p>
      <p>Подсистема поиска метаданных временно не доступна. Ведется индексация базы данных.</p>
      <p><Button type="primary" onClick={() => {
        this.props.history.goBack()
      }}>Назад</Button></p>
    </Center>)
  }
}