/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/28.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;


export default class Account extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return <div className="center-wrapper">
            <div className="login-row logo-wrap">
                <a href="#" target="_blank"><img className="logo" src="../assets/clm3-logo.png" style="" onerror="this.style.display='none'" /></a>
            </div>
            <div className="login-row header-row">
                <div className="header"></div>
            </div>

            <form id="loginModel" className="login-form" action="desktop.html" method="post">
                <div className="login-row">
                    <input id="username" name="username" type="text" value="" placeholder="Account Number" autocapitalize="off" autocorrect="off" />
                </div>
                <div className="login-row">
                    <input id="password" name="password" type="password" value="" placeholder="Password" />
                </div>
                <div className="login-row login-button-row">
                    <input type="submit" id="login-button" value="Login" name="login" className="btn" />
                </div>
                <div className="login-row register-demouser-href-row">
                    <a className="create-demouser-href" href="http://www.clmforex.com/demo-account/" target="_blank">Create Account</a>
                </div>
            </form>

            <div className="login-row footer">
                <a href="http://www.clmforex.com/" target="_blank">www.clmforex.com</a>
            </div>
        </div>;
    }
}