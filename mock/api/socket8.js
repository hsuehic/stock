module.exports = {
    "type": "OPENORDER",
    "code": 0,
    "data": {
        "position": "12341434333", // 订单号
        "symbol": "EURCHFbo", // 货币
        "type": 1, //-1代表看跌DOWN，1代表看涨 UP
        "open_price": 5, /// 开仓价
        "open_time": 1498258796, //开仓时间
        "investment": 100, //投资金额
        "expiration": 5, //过期时间（分钟）。
        "win": 50, //盈利百分比
        "digits": 2 //报价的精度
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

