/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/24.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description: 自定义常量
 */

import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';
import enUS from './locales/en-US';

const apiServer = `https://web.money-bo.com`;

export const API_URL = {
    LOGIN: `${apiServer}/api/socket2`, // 登录
    LOGOUT: `${apiServer}/api/socket12`, // 退出登录
    GET_SERVER_INFO: `${apiServer}/api/socket3`, // 获取服务器信息
    SYMBOL_GROUP: `${apiServer}/api/socket4`, // 获取货币信息
    GET_OPEN_ORDER: `${apiServer}/api/socket5`, // 获取持仓单
    ACCOUNT_DETAILS: `${apiServer}/api/socket6`, // 获取账户信息
    GET_HISTORY_ORDER: `${apiServer}/api/socket7`, // 获取历史订单
    OPEN_ORDER: `${apiServer}/api/socket8`, // 下单
    PRICE_REQUEST: `${apiServer}/api/socket9`, // 获取货币报价
    QUOTES_HISTORY: `${apiServer}/api/socket10`,// 获取K线
    SESSION_CHECK: `${apiServer}/api/socket11`, // 验证Session
    ORDER_INFO: `${apiServer}/api/socket13`, // 订单信息
    CHANGE_PASSWORD: `${apiServer}/api/socket14`, //修改密码
    GET_USERNAME: `https://my.money-bo.com/backoffice/zh/getname.php` // 获取用户名
};

export const COLORS = {
    WIN: '#00ff00',
    LOSS: '#ff0000',
    EQUALS: '#ffffff',
    UP: '#00ff00',
    DOWN: '#ff0000',
    DEFAULT: '#ffffff'
};

export const PERIOD = [{
    label: 'M1',
    key: 1
},{
    label: 'M5',
    key: 5
},{
    label: 'M15',
    key: 15
},{
    label: 'M30',
    key: 30
},{
    label: 'H1',
    key: 60
},{
    label: 'H4',
    key: 240
},{
    label: 'D1',
    key: 1440
},{
    label: 'W1',
    key: 10080
},{
    label: 'MN',
    key: 43200
}];

export const LANGUAGES = [{
    label: '简体中文',
    value: 'zh-CN',
    messages: zhCN
}, {
    label: 'English',
    value: 'en-US',
    messages: enUS
}, {
    label: '繁體中文',
    value: 'zh-TW',
    messages: zhTW
}]

export function getMessages(locale) {
    let messages;
    LANGUAGES.some(item => {
        if (item.value === locale) {
            messages = item.messages;
            return true;
        }
        return false;
    });
    return messages;
}

export function getLocaleInfo (locale) {
    let messages = getMessages(locale);
    if (!messages) {
        locale = LANGUAGES[0].value;
        messages = LANGUAGES[0].messages
    }
    return {
        locale,
        messages
    }
}
