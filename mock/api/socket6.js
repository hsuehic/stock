module.exports = {
    "type": "ACCOUNTDETAILS",
    "code": 0,
    "data": {
        "balance": 10355.3,
        "credit": 0,
        "currency": "USD",
        "name_base64": "VGVzdCBBY2NvdW50",
        "name": "Test Account"
    }
};

/*
 *  type "ACCOUNTDETAILS"(String) 获取账户信息命令的结果
 *
 *   code 0(int) 命令执行结果0，代表成功,其他code含义请查看附件
 *
 *   data {object}服务器返回的消息结果，code为0时才会有data数据。
 *
 *   balance 账户余额。
 *
 *   credit 账户信用额。
 *
 *   currency 账户货币类型。
 *
 *   name_base64 BASE64的姓名，GBK编码
 *
 *   name 姓名
*/