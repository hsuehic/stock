import React, { Component } from 'react';
import { Button } from 'antd';

import logo from '../assets/logo.svg';
import '../style/App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
            <Button type="primary">Button</Button>
        </p>
      </div>
    );
  }
}

export default App;
