/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/28.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import { Button, notification } from 'antd';

import {login} from '../api';
import logo from '../assets/clm3-logo.png';
import enUs from '../locales/en-US';
import BO_RET from '../error'


const openNotificationWithIcon = ({type, message, description}) => {
    notification[type]({
        message,
        description
    });
};

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            errorMessage: '',
            isFetching: false,
            messages: enUs
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    getErrorMessage(code) {
        return this.state.messages[`error${code}`] || 'Unknown error!';
    }

    processResponse (res) {
        if (res.ok && res.status === 200) {
            return res.json().then((json) => {
                let code = json.code;
                switch (code) {
                    case BO_RET.BO_RET_OK.code:
                        return json;
                    default:
                        json.message = this.getErrorMessage(code);
                        openNotificationWithIcon({
                            type: 'error',
                            message: this.state.messages['title.error'],
                            description: `${code}: ${json.message}`
                        });
                        return json;
                }
            });
        }
        else {
            let code = res.status;
            let message = `Network error: ${res.status} ${res.statusText}`
            openNotificationWithIcon({
                type: 'error',
                message: this.state.messages['title.error'],
                description: message
            });
            return {
                code,
                message
            };
        }

    }

    onLogin () {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let promise = login({
            login: username,
            password
        });

        this.setState({
            isFetching: true
        });
        promise.then(this.processResponse.bind(this)).then((res) => {
            this.setState({
                isFetching: false
            });
            if (res.code === 0) {
                window.location.href = 'index.html';
            } else {
                this.setState({
                    loginError: true,
                    errorMessage: res.message
                })
            }
        }).catch((ex) => {
            this.setState({
                isFetching: false
            });
            notification.error({
                message: '网络请求出错了！',
                description: '返回的数据格式不正确！'
            });
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
                    <input id="username" name="login" type="text" placeholder="Account Number" />
                </div>
                <div className="login-row">
                    <input id="password" name="password" type="password" placeholder="Password" />
                </div>
                {
                    this.state.loginError &&
                    <div className="login-error">
                        { this.state.errorMessage }
                    </div>
                }

                <div className="login-row login-button-row">
                    <Button disabled={this.state.isFetching} loading={this.state.isFetching} type="button" id="login-button" onClick={this.onLogin.bind(this)} className="btn">Login</Button>
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