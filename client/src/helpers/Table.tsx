import React, { Component } from 'react';
import Table from 'antd/lib/table';

export default class CommonTable extends Component<{
  columns: any[],
  dataSource: any[],
  loading?: boolean,
  subscribeToChanges: Function
}> {
  componentDidMount() {
    this.props.subscribeToChanges();
  }

  render() {
    const { columns, dataSource, loading } = this.props;
    return (
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        loading={loading ? loading : false}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
          showSizeChanger: true,
          locale: { items_per_page: '/ строк' },
        }}
        size="small"
      />
    );
  }
}
