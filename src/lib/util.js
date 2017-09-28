/**
 * Copyright(c) Richard
 * Created by Richard on 17/9/24.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


/**
 * 获取浏览览器语言
 * @returns {string|*}
 */
export function getBrowserLanguage() {
    return window.navigator.language || window.navigator.browserLanguage;
}

/**
 * 获取URL中的查询参数
 * @returns {Object}
 */
export function getQueryParams() {
    let params = {};
    let search = window.location.search;
    if (search) {
        let queryString = search.substr(1);
        let keyValues = queryString.split('&');
        if (keyValues.length > 0) {
            keyValues.forEach(kv => {
                let keyValue = kv.split('=');
                if (keyValue.length > 1) {
                    params[keyValue[0]] = keyValue[1];
                }
            })
        }
    }
    return params
}

/**
 * 获取URL key 为name 的特定参数值
 * @param name
 * @returns {*}
 */
export function getQueryParam(name) {
    let params = getQueryParams();
    return params[name]
}

/**
 * 判断是否是符合条件的密码，数字和字母的组合，且长度至少5位，不超过15位
 * @param value
 * @return bool
 */
export function isValidPassword(value) {
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{5,15}$/g;
    return reg.test(value);
}
