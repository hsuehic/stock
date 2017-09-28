/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/28.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import { Button, notification, Select, message } from 'antd';

import BO_RET from '../error';
import {login} from '../api';
import logo from '../assets/clm3-logo.png';
import { FormattedMessage, IntlProvider, addLocaleData } from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

import ModalChangePassword from './ChangePassword';

import { LANGUAGES, getMessages, getLocaleInfo } from '../constant';
import { getBrowserLanguage, getQueryParam } from '../lib/util';

addLocaleData([...zh, ...en]);

const { Option } = Select;

const openNotificationWithIcon = ({type, message, description}) => {
    notification[type]({
        message,
        description
    });
};


export default class Login extends React.Component {

    constructor(props) {
        super(props);

        let language = getQueryParam('lng') || getBrowserLanguage();
        let { locale, messages } = getLocaleInfo(language);
        this.state = {
            loginError: false,
            errorMessage: '',
            isFetching: false,
			messages,
            locale,
            account: '',
            isModalChangePasswordVisible: false
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    getErrorMessage(code) {
        return this.state.messages[`error${code}`] || this.state.messages['text.unknown_error'];
    }

    setLocale (locale) {
        let localeInfo = getLocaleInfo(locale);
        this.setState(localeInfo);
    }

    onSelectLanguage(value) {
        this.setLocale(value)
    }

    onHideChangePassword(value) {
        if (value) {
            let { locale } = this.state;
            window.location.href = `index.php?lng=${locale}`;
        }
        this.setState({
            isModalChangePasswordVisible: false
        });
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
            isFetching: true,
            account: username
        });
        promise.then(this.processResponse.bind(this)).then((res) => {
            this.setState({
                isFetching: false
            });
            if (res.code === 0) {
                if (password !== 'aa8888') {
                    this.goMain();
                } else {
                    message.warning(this.state.messages['text.need_to_change_password']);
                    this.setState({
                        isModalChangePasswordVisible: true
                    });
                }
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
                message: this.state.messages['text.network_error'],
                description: this.state.messages['text.response_format_error']
            });
        });
    }

    goMain() {
        let { locale } = this.state;
        window.location.href = `index.php?lng=${locale}`;
    }

    render() {
        let { locale, messages } = this.state
        return <IntlProvider locale={ locale } messages={ messages }>
        <div className="center-wrapper">
            <div className="login-row logo-wrap">
                <a href="#" target="_blank"><img className="logo" src={logo} /></a>
            </div>
            <div className="login-row header-row">
                <div className="header"></div>
            </div>

            <form id="loginModel" className="login-form" action="/" method="post">
                <div className="login-row">
                    <Select defaultValue={locale} onSelect={this.onSelectLanguage.bind(this)}>
                        {
                            LANGUAGES.map(item => <Option value={item.value}>{item.label}</Option>)
                        }
                    </Select>
                </div>
                <div className="login-row">
                    <FormattedMessage {...{id: 'accountNumber', defaultMessage: '账户号'}} >
                        {
                            txt => (
                                <input id="username" name="login" type="text" placeholder= { txt } />
                            )
                        }
                    </FormattedMessage>
                </div>
                <div className="login-row">
                    <FormattedMessage {...{id: 'password', defaultMessage: '密码'}}>
                        {
                            (txt) => (
                                <input id="password" name="password" type="password" placeholder={txt} />
                            )
                        }
                    </FormattedMessage>
                </div>
                {
                    this.state.loginError &&
                    <div className="login-error">
                        { this.state.errorMessage }
                    </div>
                }

                <div className="login-row login-button-row">
                    <Button disabled={this.state.isFetching} loading={this.state.isFetching} type="button" id="login-button" onClick={this.onLogin.bind(this)} className="btn"><FormattedMessage id="login" defaultMessage="Login"/></Button>
                </div>
                
            </form>

            <div className="login-row footer">
                <a href="http://web.money-bo.com/" target="_blank">web.money-bo.com</a>
            </div>

            <ModalChangePassword login={this.state.account} visible={this.state.isModalChangePasswordVisible} onClose={this.onHideChangePassword.bind(this)} />
        </div>
        </IntlProvider>
    }
}
/*
<div className="login-row register-demouser-href-row">
                    <a className="btn" href="http://web.money-bo.com/demo-account/" target="_blank">Create Account</a>
                </div>
*/