module.exports = {
    "type": "OPENORDER",
    "code": 2073,
    "data": {
        "flag": -5812525
    }
};


/*
type "OPENORDER"(String) 获取账户信息命令的结果

code 0(int) 命令执行结果0，代表成功,其他code含义请查看附件

data {object}服务器返回的消息结果，code为0时才会有data数据。

Open_price: 开仓价
Digits 货币的小数点精度
Open_time 开仓时间戳
Win 盈利百分比
Loss 亏损百分比
Flag:客户端自定义标志s

*/
