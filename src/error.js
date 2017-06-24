/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/24.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description: 错误码
 */

export default {
    BO_RET_OK: {
        code: 0,
        msg: '执行命令成功'
    },
    BO_RET_OK_NONE: {
        code: 1,
        msg: '命令执行成功，但无影响'
    },
    BO_RET_ERROR: {
        code: 2,
        msg: '一般错误'
    },
    BO_RET_INVALID_DATA: {
        code: 3,
        msg: '无效的数据'
    },
    BO_RET_TECH_PROBLEM: {
        code: 4,
        msg: '服务器技术问题'
    },
    BO_RET_OLD_VERSION: {
        code: 5,
        msg: '客户端版本太老'
    },
    BO_RET_NO_CONNECT: {
        code: 6,
        msg: '没有连接'
    },
    BO_RET_NOT_ENOUGH_RIGHTS: {
        code: 7,
        msg: '权限不足'
    },
    BO_RET_TOO_FREQUENT: {
        code: 8,
        msg: '访问服务器过于频繁，请过一会儿重试'
    },
    BO_RET_MALFUNCTION: {
        code: 9,
        msg: '多重操作'
    },
    BO_RET_GENERATE_KEY: {
        code: 10,
        msg: '需要生成RSA公钥'
    },
    BO_RET_SECURITY_SESSION: {
        code: 11,
        msg: '安全加密授权'
    },
    BO_RET_PUBLIC_KEY_MISSING: {
        code: 12,
        msg: '需要RSA公钥'
    },
    BO_RET_ACCOUNT_DISABLED: {
        code: 64,
        msg: '账户被禁用'
    },
    BO_RET_BAD_ACCOUNT_INFO: {
        code: 65,
        msg: '错误的账户信息'
    },
    BO_RET_TRADE_TIMEOUT: {
        code: 128,
        msg: '价格错误'
    },
    BO_RET_TRADE_BAD_PRICES: {
        code: 129,
        msg: '账户被禁用'
    },
    BO_RET_TRADE_BAD_STOPS: {
        code: 130,
        msg: '止盈止损错误'
    },
    BO_RET_TRADE_BAD_VOLUME: {
        code: 131,
        msg: '手数错误'
    },
    BO_RET_TRADE_MARKET_CLOSED: {
        code: 132,
        msg: '市场已关闭'
    },
    BO_RET_TRADE_DISABLE: {
        code: 133,
        msg: '交易被禁止'
    },
    BO_RET_TRADE_NO_MONEY: {
        code: 134,
        msg: '金额不足'
    },
    BO_RET_TRADE_PRICE_CHANGED: {
        code: 135,
        msg: '价格已更改'
    },
    BO_RET_TRADE_OFFQUOTES: {
        code: 136,
        msg: '无报价'
    },
    BO_RET_TRADE_BROKER_BUSY: {
        code: 137,
        msg: '交易商繁忙'
    },
    BO_RET_TRADE_REQUOTE: {
        code: 138,
        msg: '重新请求报价'
    },
    BO_RET_TRADE_ORDER_LOCKED: {
        code: 139,
        msg: '订单被交易员挂起'
    },
    BO_RET_TRADE_LONG_ONLY: {
        code: 140,
        msg: '禁止下卖单'
    },
    BO_RET_TRADE_TOO_MANY_REQ: {
        code: 141,
        msg: '客户端发起的连接数过多'
    },
    BO_RET_TRADE_ACCEPTED: {
        code: 142,
        msg: '订单已发送至服务器订单队列，请稍等'
    },
    BO_RET_TRADE_PROCESS: {
        code: 143,
        msg: '订单已被交易员接受'
    },
    BO_RET_TRADE_USER_CANCEL: {
        code: 144,
        msg: '订单已被客户端取消'
    },
    BO_RET_TRADE_MODIFY_DENIED: {
        code: 145,
        msg: '订单修改被拒绝'
    },
    BO_RET_TRADE_CONTEXT_BUSY: {
        code: 146,
        msg: '交易文本正忙'
    },
    BO_RET_TRADE_EXPIRATION_DENIED: {
        code: 147,
        msg: '错误的交易周期'
    },
    BO_RET_TRADE_TOO_MANY_ORDERS: {
        code: 148,
        msg: '过多的订单'
    },
    BO_RET_TRADE_HEDGE_PROHIBITED: {
        code: 149,
        msg: '禁止对冲'
    },
    BO_RET_TRADE_PROHIBITED_BY_FIFO: {
        code: 150,
        msg: '已被FIFO规则禁止'
    },
    BO_RET_TRADE_GET_OPENPRICE_ERR: {
        code: 2048,
        msg: '获取开仓价失败'
    },
    BO_RET_TRADE_GET_USERINFO_FAILED: {
        code: 2049,
        msg: '获取用户信息失败'
    },
    BO_RET_TRADE_GET_GROUPINFO_FAILED: {
        code: 2050,
        msg: '获取用户组信息失败'
    },
    BO_RET_TRADE_GET_SYMBOL_FAILED: {
        code: 2051,
        msg: '获取货币信息失败'
    },
    BO_RET_TRADE_CLOSE_ORDER_ONLY: {
        code: 2052,
        msg: '只允许平仓操作'
    },
    BO_RET_TRADE_MARKET_CLOSE_OR_TRADE_DISABLED: {
        code: 2053,
        msg: '已停盘或交易被禁止'
    },
    BO_RET_TRADE_UNKNOW_ERROR: {
        code: 2054,
        msg: '未知错误'
    },
    BO_RET_TRADE_UNKNOW_TYPE: {
        code: 2055,
        msg: '未知的交易类型'
    },
    BO_RET_LOGIN_CHECK_ERROR: {
        code: 2056,
        msg: '登录检查失败，服务器内部错误'
    },
    BO_RET_CLOSEPRICE_NOUPDATED: {
        code: 2057,
        msg: '平仓价无更新'
    },
    BO_RET_CLOSEPRICE_ORDER_INVALID: {
        code: 2058,
        msg: '无效的价格'
    },
    BO_RET_CLOSEPRICE_ORDER_NOTFOUND: {
        code: 2059,
        msg: '订单未找到'
    },
    BO_RET_GLOBAL_SESSION_ID_INVALID: {
        code: 2060,
        msg: '会话无效'
    },
    BO_RET_GLOBAL_CLIENT_IP_CHANGED: {
        code: 2061,
        msg: '客户端IP已更改，请重新登录'
    },
    BO_RET_GLOBAL_INTERNAL_ERROR: {
        code: 2062,
        msg: '服务器内部错误'
    },
    BO_RET_GLOBAL_UNKNOW_COMMAND: {
        code: 2063,
        msg: '未知的命令'
    },
    BO_RET_GLOBAL_LOGIN_INVALID: {
        code: 2064,
        msg: '账户无效'
    },
    BO_RET_GLOBAL_TERMINAL_TYPE_INVALID: {
        code: 2065,
        msg: '终端类型无效'
    },
    BO_RET_GLOBAL_SESSION_EXPIRED: {
        code: 2066,
        msg: '会话已过期'
    },
    BO_RET_GLOBAL_LOGIN_INCORRENT: {
        code: 2067,
        msg: '账户不正确'
    },
    BO_RET_GLOBAL_NEED_SERCUITY_CONNECTION: {
        code: 2068,
        msg: '服务器需要安全连接'
    },
    BO_RET_SYMBOLS_CANT_FIND_LOGIN: {
        code: 2069,
        msg: '找不到用户'
    },
    BO_RET_SYMBOLS_CANT_FIND_GROUP: {
        code: 2070,
        msg: '找不到用户组'
    },
    BO_RET_SYMBOLS_GROUP_DISBALED: {
        code: 2071,
        msg: '用户组被禁用'
    },
    BO_RET_SYMBOLS_NO_SYMBOLS: {
        code: 2072,
        msg: '没有货币'
    },
    BO_RET_GET_OPENORDER_NO_ORDERS: {
        code: 2073,
        msg: '没有订单'
    },
    BO_RET_GROUP_DISABLED: {
        code: 2074,
        msg: '账户组被禁用'
    },
    BO_RET_ACCOUNT_READONLY: {
        code: 2075,
        msg: '账户只读'
    },
    BO_RET_OK_INVESTOR_PASSWORD: {
        code: 2076,
        msg: '投资密码'
    },
    BO_RET_GET_HISTORYORDER_NO_ORDERS: {
        code: 2077,
        msg: '无历史订单'
    },
    BO_RET_GET_HISTORYORDER_INVAILD_TIME: {
        code: 2078,
        msg: '错误的时间范围'
    },
    BO_RET_ASYMMETRIC_DECRYPTION_FAILED: {
        code: 2079,
        msg: '公钥无效或者已过期'
    },
    BO_RET_SYMMETRIC_DECRYPTION_FAILED: {
        code: 2080,
        msg: '秘钥无效或者已过期'
    },
    BO_RET_PROHIBIT_DEMO_ACCOUNT_REGISTER: {
        code: 2081,
        msg: '禁止模拟账户注册'
    },
    BO_RET_DEMO_ACCOUNT_CREATE_FAILED: {
        code: 2082,
        msg: '模拟账户创建失败'
    },
    BO_RET_QUOTES_HISTORY_NO_HISTORY: {
        code: 2083,
        msg: '无历史数据'
    },
    BO_RET_AUTHORIZATION_TERMINATION: {
        code: 2084,
        msg: '授权终止'
    },
    BO_RET_AUTHORIZATION_EXPIRED: {
        code: 2085,
        msg: '授权过期'
    },
    BO_RET_MASTER_PASSWORD_INCORRECT: {
        code: 2086,
        msg: '主密码错误'
    },
    BO_RET_UNAUTHORIZED_IP: {
        code: 2087,
        msg: '未授权的IP'
    },
    BO_RET_COMMAND_EMPTY: {
        code: 2088,
        msg: '空命令'
    }
}
