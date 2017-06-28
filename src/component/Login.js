/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/28.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import {login} from '../api';
import logo from '../assets/clm3-logo.png';

const FormItem = Form.Item;

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            errorMessage: ''
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onLogin () {
        let username = document.getElementById('username');
        let password = document.getElementById('password');
        let promise = login({
            username,
            password
        });

        promise.then((res) => {
            if (res) {
                window.location.href = 'index.html';
            } else {
                this.setState({
                    loginError: true,
                    errorMessage: '用户名或密码错误!'
                })
            }
        }).catch((ex) => {
            console.log(ex);
        });
    }

    render() {
        return <div className="center-wrapper">
            <div className="login-row logo-wrap">
                <a href="#" target="_blank"><img className="logo" src={logo} /></a>
            </div>
            <div className="login-row header-row">
                <div className="header"></div>
            </div>

            <form id="loginModel" className="login-form" action="/index.html" method="post">
                <div className="login-row">
                    <input id="username" name="username" type="text" value="" placeholder="Account Number" autoCapitalize="off" autoCorrect="off" />
                </div>
                <div className="login-row">
                    <input id="password" name="password" type="password" value="" placeholder="Password" />
                </div>
                {
                    this.state.loginError &&
                    <div className="login-error">
                        { this.state.errorMessage }
                    </div>
                }

                <div className="login-row login-button-row">
                    <input type="button" id="login-button" onClick={this.onLogin.bind(this)} value="Login" name="login" className="btn" />
                </div>
                <div className="login-row register-demouser-href-row">
                    <a className="btn" href="http://www.clmforex.com/demo-account/" target="_blank">Create Account</a>
                </div>
            </form>

            <div className="login-row footer">
                <a href="http://www.clmforex.com/" target="_blank">www.clmforex.com</a>
            </div>
        </div>;
    }
}