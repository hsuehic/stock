import React, { Component } from 'react';
import { Button, Tabs, Menu } from 'antd';
import '../style/App.less';

const TabPane = Tabs.TabPane;

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
        </div>
        <div className="App-slider"></div>
        <div className="App-content">
            <div className="nav">
                <Tabs type="card">
                    <TabPane tab="二元期商品" key="1">Content of Tab Pane 1</TabPane>
                </Tabs>
            </div>
            <div className="main"></div>
        </div>
        <div className="App-footer">
            <Tabs>
                <TabPane tab="二元期订单" key="1">Content of Tab Pane 1</TabPane>
                <TabPane tab="日志" key="2">Content of Tab Pane 1</TabPane>
                <TabPane tab="账户" key="3">Content of Tab Pane 1</TabPane>
            </Tabs>
        </div>
      </div>
    );
  }
}

export default App;
