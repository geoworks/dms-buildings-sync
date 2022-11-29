import React, { Component, Fragment } from 'react';
import Center from 'deql/helpers/components/Center';
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

export default class NotWork extends Component<any> {



  render() {
    return (<Center style={{ position: 'absolute', flexDirection: 'column' }}>
      <p>Раздел находится в процессе наполнения</p>
      <p><Button type="primary" onClick={() => {
        this.props.history.goBack()
      }}>Назад</Button></p>
    </Center>)
  }
}