import 'whatwg-fetch';
import React, { Component } from 'react';

import { FormattedMessage, IntlProvider, addLocaleData } from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

import { Button, Dropdown, Menu, Modal, notification, Select, Tabs } from 'antd';
import SymbolList from './SymbolList';
import fecha from 'fecha';
import BO_RET from '../error';


import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import Scrollbars from 'react-custom-scrollbars';
import CountingDown from './CountingDown';
import ModalAbout from './About';
import ModalChangePassword from './ChangePassword';

import { getAccountDetails, getHistoryOrder, openOrder, getOpenOrder, getPrice, getQuotesHistory, getServerInfo, getSymbolGroup, logout, getOrderDetail, getUserName } from '../api';

import { COLORS, PERIOD, LANGUAGES, getLocaleInfo } from '../constant';
import { getBrowserLanguage, getQueryParam } from '../lib/util';

import '../style/App.less';

const Option = Select.Option;
const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;

const CHART_CONTAINER_STYLE = { position: 'relative', marginLeft: '358px', height: '100%', zIndex: 1};
const CHART_CONTAINER_STYLE_FULL_SCREEN = {position: 'fixed', top: '0', left: '0', marginLeft: '0', width: '100%', height: '100%', zIndex: 1049};

const openNotificationWithIcon = ({type, message, description}) => {
    notification[type]({
        message,
        description
    });
};

addLocaleData([...zh, ...en]);

const formatExpiration = (v) => {
    let unit = <FormattedMessage id="unit.minutes" defaultMessage="分钟"/>;
    if (v >= 60) {
        unit = <FormattedMessage id="unit.hours" defaultMessage="小时"/>;
        v = v / 60;
        if (v >= 24) {
            unit = <FormattedMessage id="unit.days" defaultMessage="天"/>;
            v = v / 24
        }
    }
    return <span>{v}{unit}</span>;
};

class App extends Component {
    constructor(props, context) {
        super(props, context);

        let language = getQueryParam('lng') || getBrowserLanguage();
        let { locale, messages } = getLocaleInfo(language);

        this.state = {
            actualName: '',
            locale,
            messages,
            selectedLanguageKeys: [locale],
            account: {
                "balance": 10675.3,
                "credit": 0,
                "currency": "USD",
                "name_base64": "VGVzdCBBY2NvdW50",
                "name": "Test Account",
                "account": ''
            },
            activeKeyFooter: 'open-order',
            orders: [],
            historyOrders: [],
            serverInfo: {},
            symbols:[],
            chartOptions: {
                backgroundColor: '#404141',
                grid: [{
                    top: '10px',
                    left: '10px',
                    bottom: '30px',
                    right: '68px'
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false,
                        type: 'cross',
                        lineStyle: {
                            color: '#376df4',
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#8392A5'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            align: 'center'
                        },
                        inside: false,
                        showMaxLabel: true
                    },
                    splitLine: {
                        show: true
                    }
                },
                yAxis: {
                    position: 'right',
                    scale: true,
                    axisLine: {lineStyle: {color: '#8392A5'}},
                    textStyle: {
                        color: '#65f1f1'
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        inside: false
                    },
                    splitLine: {
                        show: true
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    start: 50,
                    end: 100
                }],
                animation: false,
                series: [
                    {
                        type: 'candlestick',
                        name: 'M1',
                        data: [],
                        itemStyle: {
                            normal: {
                                color0: '#FD1050',
                                color: '#0CF49B',
                                borderColor0: '#FD1050',
                                borderColor: '#0CF49B'
                            }
                        }
                    }
                ]
            },
            loadingOpts: {
                text: messages['text.loading'],
                color: '#c23531',
                textColor: '#fff',
                maskColor: 'rgba(86, 86, 86, 0.6)',
                zlevel: 0
            },
            showLoading: true,
            showChart: false,
            fullScreen: false,
            chartContainerStyle: CHART_CONTAINER_STYLE,
            favorite1: [],
            favorite2: [],
            favorite3: [],
            symbol: 'GBPUSDbo',
            period: 5,
            isLoading: false,
            timeDiff: 0,
            historySpan: 1,// 1 一天， 30 一月， -1 所有
            selectedHistorySpan: ['1'],
            symbolList: {},
            symbolNames: '',
            modalCreateUpOrderVisible: false,
            order: {
                symbol: '',
                type: -1,
                investment: 5,
                expiration: 1,
                expirations: [{
                    key: 1,
                    label: '60秒',
                    win: 80
                }]
            },
            modalCreateOrderVisible: false,
            modalOrderInfoVisible: false,
            modalAboutVisible: false,
            orderInfo: {
                "position": "12341434333", // 订单号
                "symbol": "EURCHFbo", // 货币
                "type": 1, //-1代表看跌DOWN，1代表看涨 UP
                "open_price": 5, /// 开仓价
                "open_time": 1498258796, //开仓时间
                "investment": 100, //投资金额
                "expiration": 5, //过期时间（分钟）。
                "win": 50, //盈利百分比
                "digits": 2 //报价的精度
            },
            pieChartOpts: {
                title: [{
                    text: '30:30',
                    top:'center',
                    left: 'center',
                    textStyle: {
                        fontSize: 30,
                        color: '#ffff00'
                    }
                }],
                color: ['#ffff00', '#cccccc'],
                series: [{
                    name:'访问来源',
                    type:'pie',
                    radius: ['90%', '100%'],
                    avoidLabelOverlap: true,
                    hoverAnimation: false,
                    selectedOffset: 0,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            formatter: function () {
                                return '30:30'
                            }
                        },
                        emphasis: {
                            show: false,
                            formatter: '30:30',
                            textStyle: {
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:600, name:'剩余时间'},
                        {value:310, name:'已过时间'}
                    ]
                }]
            },
            isOpeningOrder: false,
            isModalChangePasswordVisible: false
        };
        this.onChartEvents = {
            dataZoom: this.onDataZoom.bind(this)
        };
        this.dataZoom = {
            type: 'inside',
            start: 50,
            end: 100
        };
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

    watchOrders (){
        if (this.state.orders && this.state.orders.length > 0) {
            let len = this.state.orders.length;
            let now = (new Date()).getTime() - this.state.timeDiff;
            for (let i = 0; i < len; i ++) {
                let order = this.state.orders[i];
                if (now > order.open_time * 1000 + order.expiration * 60 * 1000 ) {
                    this.getHistoryOrders();
                    this.getOpenOrders();
                    break;
                }
            }
        }
    }

    componentDidMount (){
        this.getServerInfo();
        this.getAccountInfo();
        this.getSymbolGroup(() => {
            let getPricesFunc = this.getPrices.bind(this);
            this.getPriceTimer = window.setInterval(getPricesFunc, 1000);
            this.getLatestQuotes();
            this.getOpenOrders();
            this.getHistoryOrders();
        });
        setTimeout(() => {
            if (this.echarts) {
                this.echarts.resize();
            }
        }, 300);
        this.timer = window.setInterval(() => {
            this.getLatestQuotes();
        }, this.state.period * 60 * 1000);

        this.watchOrdersTimer = window.setInterval(this.watchOrders.bind(this), 5000);
    }

    componentWillUnmount () {
        window.clearInterval(this.timer);
        window.clearInterval(this.getPriceTimer);
        window.clearInterval(this.watchOrdersTimer);
    }

    /**
     * 格式化日期
     * @param timestamp
     */
    formatDateTime (timestamp) {
        let v = '';
        if (timestamp) {
            v = fecha.format(new Date(timestamp * 1000 + this.state.timeDiff), 'YYYY/MM/DD HH:mm:ss');
        }
        return v;
    }

    formatExpiration (expiration) {
        let v = '';
        if (1 === expiration) {
            v = <span>60 <FormattedMessage id="unit.seconds" defaultMessage="秒"/></span>;
        } else if (expiration < 60) {
            v = <span>{expiration} <FormattedMessage id="unit.minutes" defaultMessage="分钟" /></span>;
        } else {
            expiration = expiration / 60;
            v = <span>{expiration} <FormattedMessage id="unit.hours" defaultMessage="小时"/></span>;
        }
        return v;
    }

    getAccountInfo() {
        let params = {};
        let promise = getAccountDetails(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
            if (res.code === 0) {
                this.setState({
                    account: res.data
                });
                let { actualName } = this.state
                let { name, account: login } = res.data
                if (name === 'Option Trading' ) {
                    if (actualName) {
                        let { account } = this.state;
                        account.name = actualName;
                        this.setState({account});
                    } else {
                        let p = { login };
                        let d = getUserName(p);
                        d.then((resp) => resp.json()).then((resp) => {
                            actualName = resp.name
                            let { account } = this.state;
                            account.name = actualName;
                            this.setState({account, actualName});
                        });
                    }
                }
            }
        });
        return promise;
    }

    getHistoryOrders () {
        let now = new Date();
        let to = parseInt(((now.getTime()  - this.state.timeDiff) / 1000).toFixed(0), 10);
        let from = 1478000000;
        if (this.state.historySpan > 0) {
            from = to - this.state.historySpan * 24 * 3600;
        }
        let params = {
                from,
                to
            };
        let promise = getHistoryOrder(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
            if (res && res.code === 0) {
                let orders = res.data.orders;
                orders.sort((a, b) => {
                    let c = a.open_time + a.expiration * 60;
                    let d = b.open_time + b.expiration * 60;
                    return d - c;
                });
                this.setState({
                    historyOrders: orders
                });
            }
        });
    }

    getOpenOrders () {
        let params = {};
        let promise = getOpenOrder(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
            if (res && res.code === 0) {
                this.setState({
                    orders: res.data.orders
                });
                this.updateMarkLine();
            }
        });
    }

    getSymbolGroup (callback) {
        let self = this;
        let params = {};
        let promise = getSymbolGroup(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
            if (res && res.code === 0) {
                let symbols = res.data.symbols;
                let symbolList = {};
                symbols.map((symbol) => {
                    let name = symbol.name;
                    symbolList[name] = {
                        direction: 0,
                        ...symbol
                    };
                    return symbol;
                });
                let symbolNames= Object.keys(symbolList).join(',');
                let symbol = symbols[0];
                let chartOptions = this.state.chartOptions;
                chartOptions.yAxis.axisLabel.formatter = (v) => {
                    let digits = symbol.digits;
                    return v.toFixed(digits);
                };
                self.setState({
                    symbol: symbol.name,
                    symbols,
                    symbolList,
                    symbolNames
                });
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
        return promise;
    }

    getOpenOrdersBySymbol () {
        let { orders, symbol } = this.state;
        let v = [];
        if (orders && orders.length > 0) {
            v = orders.filter((item) => {
                return item.symbol === symbol;
            });
        }
        return v;
    }

    updateMarkLine () {
        let chartOptions = this.state.chartOptions;
        let data = chartOptions.series[0].data;


        if (data && data.length > 0) {
            let len = data.length;
            let item = data[len - 1];
            let price = item[1];
            let startIndex = Math.ceil(this.dataZoom.start * len / 100) - 1;
            let lastIndex = Math.floor(this.dataZoom.end * len / 100) - 1;
            let marklineData = [
                [
                    {
                        name: `${price}`,
                        coord: [startIndex, price]
                    },
                    {
                        name: `${price}`,
                        coord: [lastIndex, price]
                    }
                ]
            ];
            let orders = this.getOpenOrdersBySymbol();
            if (orders && orders.length > 0) {
                orders.map((item) => {
                    let { position, open_price } = item;
                    marklineData.push([
                        {
                            name: `#${position}`,
                            coord: [startIndex, open_price],
                            lineStyle: {
                                normal: {
                                    color: '#ff0000'
                                }
                            }
                        },
                        {
                            coord: [lastIndex, open_price]
                        }
                    ]);
                });
            }

            let markLink = {
                symbol: ['none', 'none'],
                data: marklineData
            };
            chartOptions.series[0].markLine = markLink;
            this.setState({
                chartOptions
            });
        }
    }

    getPrices () {
        let params = {
            symbols: this.state.symbolNames
        };
        let promise = getPrice(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
           if (res && res.code === 0) {
               let prices = res.data.quotes;
               let symbolList = this.state.symbolList;
               prices.map((item) => {
                   let name = Object.keys(item)[0];
                   let obj = symbolList[name];
                   if (obj) {
                       let price = item[name];
                       if (obj.price === price) {
                           obj.direction = 0;
                       } else if (obj.price > price) {
                           obj.direction = -1;
                       } else {
                           obj.direction = 1;
                       }
                       obj.price = price;
                       symbolList[name] = Object.assign({}, obj);
                   }
                   return item;
               });
               let chartOptions = this.state.chartOptions;
               let data = chartOptions.series[0].data;
               let index = data.length - 1;
               if (index > 0) {
                   let item = data[index];
                   let symbol = symbolList[this.state.symbol];
                   let price = symbol.price;
                   item[1] = price;
                   if (item[2] > price) {
                       item[2] = price;
                   } else if (item[3] < price) {
                       item[3] = price;
                   }
                   data[index] = item;
                   let len = data.length;
                   let startIndex = Math.ceil(this.dataZoom.start * len / 100) - 1;
                   let lastIndex = Math.floor(this.dataZoom.end * len / 100) - 1;

                   let marklineData = [
                       [
                           {
                               name: `${price}`,
                               coord: [startIndex, price]
                           },
                           {
                               name: `${price}`,
                               coord: [lastIndex, price]
                           }
                       ]
                   ];
                   let orders = this.getOpenOrdersBySymbol();
                   if (orders && orders.length > 0) {
                       orders.map((item) => {
                           let { position, open_price } = item;
                           marklineData.push([
                               {
                                   name: `#${position}`,
                                   coord: [startIndex, open_price],
                                   lineStyle: {
                                       normal: {
                                           color: '#ff0000'
                                       }
                                   }
                               },
                               {
                                   coord: [lastIndex, open_price]
                               }
                           ]);
                       });
                   }

                   let markLink = {
                       symbol: ['none', 'none'],
                       data: marklineData
                   };
                   chartOptions.series[0].markLine = markLink;
                   chartOptions.series[0].data = data;
               }
               this.setState({
                   chartOptions,
                   symbolList
               });
           }

        });
        return promise;
    }

    getSymbolPrice (symbolName) {
        let v = '';
        let symbol = this.state.symbolList[symbolName];
        if (symbol) {
            v = symbol.price;
        }
        return v;
    }

    getSymbolInfo (symbolName) {
        let symbol = this.state.symbolList[symbolName];
        let v = {minimum: 5, maximum: 10, step: 1};
        if (symbol) {
            let minimum = symbol.minimum/100;
            let maximum = symbol.maximum/100;
            let step = symbol.step/100;
            v = {minimum, maximum, step};
        }
        return v;
    }

    getAccountSymbolInfo () {
        let v = {minimum: 5, maximum: 10, step: 1};
        let { symbols } = this.state
        if (symbols.length > 0) {
            let symbol = symbols[0]
            let minimum = symbol.minimum/100;
            let maximum = symbol.maximum/100;
            let step = symbol.step/100;
            v = {minimum, maximum, step};
        }
        return v;
    }

    getServerInfo () {
        let self = this;
        let params = {};
        let promise = getServerInfo(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
            if (res.code === 0) {
                let data = res.data;
                let time = data.server_time;
                let timeDiff = (new Date()).getTime() - time * 1000;
                self.setState({
                    serverInfo: data,
                    timeDiff: timeDiff
                });
            }
        });
        return promise;
    }

    getLatestQuotes (callback) {
        let params = {
            symbol: this.state.symbol,
            period: this.state.period
        };
        this.setState({
            isLoading: true
        });
        let promise = getQuotesHistory(params);
        promise.then(this.processResponse.bind(this)).then((res) => {
            this.setState({
                isLoading: false
            });
            if (res.code === 0) {
                let quotes = res.data.quotes;
                let data = [];
                let times = [];
                let lastC;
                let lastTime;
                let format;
                if (this.state.period >= 240) {
                    format = 'MM/DD';
                } else {
                    format = 'HH:mm';
                }
                let symbol = this.state.symbolList[this.state.symbol];
                let factor = Math.pow(10, symbol.digits);
                quotes.forEach((quote) => {
                    lastTime = quote.t * 1000 + this.state.timeDiff;
                    let timeStr = fecha.format(new Date(lastTime), format);
                    times.push(timeStr);
                    let o = quote.o / factor;
                    let h = (quote.o + quote.h) / factor;
                    let l = (quote.o + quote.l) / factor;
                    lastC = (quote.o + quote.c) / factor;
                    let item = [o, lastC, l, h];
                    data.push(item);
                });
                let lastTimeStr  = fecha.format(new Date(lastTime + this.state.period * 60 * 1000), format);
                let lastCandlestick = [lastC, lastC, lastC, lastC];
                times.push(lastTimeStr);
                data.push(lastCandlestick);
                let chartOptions = this.state.chartOptions;
                chartOptions.xAxis.data = times;
                chartOptions.series[0].data = data;
                chartOptions.dataZoom=[this.dataZoom];
                this.setState({
                    chartOptions
                }, () => {
                    this.updateMarkLine();
                });
            }
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    calculateStatus (order) {
        let symbolName = order.symbol;
        let openPrice = order.open_price;
        let symbol = this.state.symbolList[symbolName];
        let v = 0;

        if (symbol) {
            let price = symbol.price;
            let type = (order.type === 'UP' || order.type ===1) ? 1: -1;
            let d = (price - openPrice) * type;
            if (d > 0) {
                v = 1;
            } else if(d < 0) {
                v = -1;
            }
        }
        return v;
    }

    calculateProfit (order) {
        let v = 0;
        if (order.hasOwnProperty('profit')) {
            v = order.profit;
        } else {
            let status = this.calculateStatus(order);
            if (status > 0) {
                v = order.investment * 0.01 * order.win;
            } else if (status < 0) {
                v = order.investment * -1;
            }
        }
        let str = v + '';
        let index = str.indexOf('.');
        if (index > -1) {
            if (str.length - index > 4) {
                str = v.toFixed(3);
            }
        }

        let node;
        let color = COLORS.DEFAULT;
        if (v > 0) {
            color = COLORS.WIN;
        } else if (v < 0) {
            color = COLORS.LOSS;
        }
        node = <span style={{color}}>{str}</span>

        return node;
    }

    calculateProfitNode (profit) {
        let text = profit;
        let color = COLORS.EQUALS;
        if (profit > 0) {
            color = COLORS.WIN;
        } else if (profit < 0) {
            color = COLORS.LOSS;
        }
        return <span style={{color}}>{text}</span>;
    }

    calculateExpirations (symbolName) {
        let value = [];
        let symbol = this.state.symbolList[symbolName];
        let getKey = (str) => {
            let v = parseInt(str, 10);
            return v;
        };
        let getLabel = (str) => {
            let v = getKey(str);
            return this.formatExpiration(v);
        };
        if (symbol) {
            let expiration = symbol.expiration;
            let arr = expiration.split(',');
            arr.map((str) => {
                if (str) {
                    let tmp = str.split('-');
                    value.push({
                        key: getKey(tmp[0]),
                        win: tmp[1],
                        label: getLabel(tmp[0])
                    });
                }
                return str;
            })
        }
        return value;
    }
    
    calculateStatusNode (order) {
        let s = this.calculateStatus(order);
        let text = <FormattedMessage id="equal" defaultMessage="平盘"/>;
        let color = COLORS.EQUALS;
        switch (s) {
            case 1:
                text = <FormattedMessage id="win" defaultMessage="盈利"/>;
                color = COLORS.WIN;
                break;
            case -1:
                text = <FormattedMessage id="loss" defaultMessage="亏损"/>;
                color = COLORS.LOSS;
                break;
            default:
                break;
        }
        return <span style={{color: color}}>{text}</span>;
    }

    calculateTimeSpan (order) {
        let now = (new Date()).getTime();
        let end = (order.open_time + order.expiration * 60) * 1000 + this.state.timeDiff;
        let v = end - now;
        let value = '00:00:00';
        if (v > 0) {
            let d = new Date(v);
            d.setHours(d.getUTCHours());
            value = fecha.format(d, 'HH:mm:ss');
        }
        return value;
    }

    calculateOrderPriceDirection (orderInfo) {
        let diff = this.getSymbolPrice(orderInfo.symbol) - orderInfo.open_price;
        let v = <span style={{color: COLORS.EQUALS}}>Equal</span>;
        if (diff > 0) {
            v = <span style={{color: COLORS.WIN}}>Up</span>;
        } else if (diff < 0) {
            v = <span style={{color: COLORS.LOSS}}>Down</span>;
        }
        return v;
    }

    getTypeName (type) {
        let v = '';
        if (type) {
            switch (type) {
                case -1:
                    v = 'DOWN';
                    break;
                case 1:
                    v = 'UP';
                    break;
                default:
                    v = '';
                    break;
            }
        }
        return v;
    }

    getHistoryOrderType (order) {
        if (order.cmd === 6 ) {
            return 'balance';
        } else if (order.cmd === 7) {
            return 'credit';
        } else {
            return this.getTypeName(order.type)
        }
    }

    getOrderDetail() {
        let self = this;
        let orderInfo = this.state.orderInfo;
        let expirationTime  = orderInfo.open_time * 1000 + this.state.timeDiff + orderInfo.expiration * 60 * 1000;
        let now = (new Date()).getTime();
        if (now > expirationTime) {
            let promise = getOrderDetail({
                order: orderInfo.position || orderInfo.order
            });
            promise
                .then((res) => {
                    if (res.code === 0) {
                        let data = res.data;
                        if (data && data.hasOwnProperty('profit')) {
                            window.clearInterval(self.getOrderInfoTimer);
                            orderInfo.profit = data.profit;
                            self.setState({
                                orderInfo
                            });
                        }
                    }
                });
        }
    }

    startGetOrderDetail (order) {
        if (this.getOrderInfoTimer) {
            window.clearInterval(this.getOrderInfoTimer);
        }
        this.getOrderInfoTimer = setInterval(this.getOrderDetail.bind(this, order), 1000);
    }

    logout () {
        let promise = logout();
        promise.then(this.processResponse.bind(this)).then(() => {
            window.location.href = 'login.php';
        }).catch(() => {
            window.location.href = 'login.php';
        });
    }

    setLocale (language) {
        let localeInfo = getLocaleInfo(language);
        let { locale, messages } = localeInfo;
        let selectedLanguageKeys = [locale];
        let loadingOpts = this.state.loadingOpts;
        loadingOpts.text = messages['text.loading'];
        this.setState({
            locale,
            loadingOpts,
            messages,
            selectedLanguageKeys
        });
    }

    onChartReady () {
        console.log('Chart ready!')
    }

    onDataZoom (dataZoom) {
        this.dataZoom.start = dataZoom.batch[0].start;
        this.dataZoom.end = dataZoom.batch[0].end;
        this.updateMarkLine();
    }

    onCreateOrder (symbol) {
        let self = this;
        let expirations = this.calculateExpirations(symbol.name);
        this.setState({
            order: {
                symbol: symbol.name,
                expiration: expirations[0].key,
                win: expirations[0].win,
                expirations: expirations
            },
            modalCreateOrderVisible: true
        }, () => {
            window.setTimeout(() => {
                self.investmentInput.focus();
            }, 600);
        });
    }

    onCreateUpOrder (symbol) {
        this.createUpDownOrder(symbol.name, 1);
    }

    onCreateDownOrder (symbol) {
        this.createUpDownOrder(symbol.name, -1);
    }

    onFooterTabClick (key) {
        this.setState({
            activeKeyFooter: key
        });
        if (key === 'account') {
            this.getAccountInfo();
        }
    }

    createUpDownOrder (symbolName, type) {
        let order = this.state.order;
        order.type = type;
        order.symbol = symbolName;
        order.expiration = 1;
        order.investment = 100;
        this.setState({
            order,
            modalCreateUpOrderVisible: true
        });
    }

    onSubmitCreateOrder (type) {
        try {
            let order = this.state.order;
            order.investment = parseFloat(this.investmentInput.value);
            order.type = type;
            order.symbol = this.state.symbol;
            this.setState({
                order,
                modalCreateUpOrderVisible: true,
                modalCreateOrderVisible: false
            });
        } catch (ex) {
            console.log(ex);
        }

    }

    onSubmitCreateOrderUp () {
        this.onSubmitCreateOrder(1);
    }

    onSubmitCreateOrderDown () {
        this.onSubmitCreateOrder(-1);
    }

    onCurrentSymbolChange (symbol) {
        this.setSymbol(symbol.name);
        let chartOptions = this.state.chartOptions;
        chartOptions.yAxis.axisLabel.formatter = (v) => {
            let digits = symbol.digits;
            return v.toFixed(digits);
        };
        this.setState({
            chartOptions
        });
    }

    onExpirationChange (value) {
        value = parseInt(value, 10);
        let order = this.state.order;
        order.expiration = value;
        let len = order.expirations.length;
        for (let i = 0; i < len; i ++) {
            let item = order.expirations[i];
            if (item.key === value) {
                order.win = item.win;
                break;
            }
        }
        this.setState({
            order
        });
    }

    onFavoriteClick (symbol, key) {
        let stateName = `favorite${key}`;
        let favorite = this.state[stateName];
        let name = symbol.name;
        let index = favorite.indexOf(name);
        if (index > -1) {
            favorite.splice(index, 1);
        } else {
            favorite.push(name);
        }
        this.setState({
            [stateName]: favorite
        });
    }

    onFullScreen () {
        let fullScreen = !this.state.fullScreen;
        let chartContainerStyle = fullScreen ? CHART_CONTAINER_STYLE_FULL_SCREEN: CHART_CONTAINER_STYLE;

        this.setState({
            chartContainerStyle,
            fullScreen
        });
    }

    onHideCreateUpOrder() {
        this.setState({
            modalCreateUpOrderVisible: false
        })
    }

    onHideModalOrderInfo () {
        if (this.getOrderInfoTimer) {
            window.clearInterval(this.getOrderInfoTimer);
        }
        this.setState({
            modalOrderInfoVisible: false
        })
    }

    onHideModalCreateOrder () {
        this.setState({
            modalCreateOrderVisible: false
        })
    }

    onHideAbout () {
        this.setState({
            modalAboutVisible: false
        })
    }

    onShowAbout () {
        this.setState({
            modalAboutVisible: true
        })
    }

    onHelpMenuClick ({key}) {
        if (key === '0') {
            this.onShowChangePassword();
        } else if (key === '1') {
            this.onShowAbout();
        }
    }

    onLanguageMenuClick ({key}) {
        this.setLocale(key);
    }

    onHistoryQueryTypeClick ({key}) {
        let historySpan = parseInt(key, 10);
        let selectedHistorySpan = [key];
        this.setState({
            historySpan,
            selectedHistorySpan,
            activeKeyFooter: 'history-order'
        },() => {
            this.getHistoryOrders();
        })
    }

    onOrderClick (order) {
        this.setState({
            orderInfo: order,
            modalOrderInfoVisible: true
        }, () => {
            this.startGetOrderDetail(this.state.orderInfo);
        });
    }

    onPeriodSelect (value, option) {
        let key = parseInt(value, 10);
        let label
        for (let i = 0; i < PERIOD.length; i++) {
            if (PERIOD[i].key === key) {
                label = PERIOD[i].label;
                break;
            }
        }
        let chartOptions = this.state.chartOptions;
        chartOptions.series[0].name = label;
        this.setState({
            period: key,
            chartOptions: chartOptions
        }, () => {
            window.clearInterval(this.timer);
            this.getLatestQuotes();
            this.timer = window.setInterval(this.getLatestQuotes.bind(this), this.state.period * 60 * 1000);
        });
    }

    onSubmitCreateUpDownOrder () {
        this.setState({
            modalCreateUpOrderVisible: false
        });
        this.submitOrder();
    }

    onShowChangePassword() {
        this.setState({
            isModalChangePasswordVisible: true
        });
    }

    onHideChangePassword() {
        this.setState({
            isModalChangePasswordVisible: false
        });
    }

    submitOrder () {
        let self = this;
        let symbolName = this.state.order.symbol;
        let type = this.state.order.type === 1 ? 'UP': 'DOWN';
        let params = {
            symbol: symbolName,
            expiration: this.state.order.expiration,
            type: type,
            volume: this.state.order.investment,
            flag: -5812525,
            time: '',
            msec: ''
        };
        let promise = openOrder(params);
        this.setState({
            isOpeningOrder: true
        });
        promise.then(this.processResponse.bind(this)).then((res) => {
            self.setState({
                isOpeningOrder: false
            });
            if (res && res.code === 0) {
                self.setState({
                    modalOrderInfoVisible: true,
                    orderInfo: res.data,
                    activeKeyFooter: 'open-order'
                }, () => {
                    self.startGetOrderDetail(this.state.orderInfo);
                });
                self.getOpenOrders();
            }
        }).catch(() => {
            this.setState({
                isOpeningOrder: false
            });
        });
    }

    setSymbol (value) {
        this.setState({
            symbol: value,
            isLoading: true
        }, () => {
            this.getLatestQuotes(() => {
                this.setState({
                    isLoading: false
                });
            });
        });
    }

    render() {

        let i18ns = LANGUAGES;
        let i18nMenu = <Menu onClick={this.onLanguageMenuClick.bind(this)} selectedKeys={this.state.selectedLanguageKeys}>
            { i18ns.map((i18n, index) => <MenuItem key={i18n.value}><span>{i18n.label}</span></MenuItem>)}
        </Menu>;

        let helps = [<FormattedMessage id="change_password" defaultMessage="修改密码"/>,<FormattedMessage id="menu.help.about" defaultMessage="关于"/>]
        let helpMenu = <Menu onClick={this.onHelpMenuClick.bind(this)}>
            {helps.map((help,index) => <MenuItem key={index}><span>{help}</span></MenuItem>) }
        </Menu>;

        let historyQueryTypes = [{key: 1, label: <FormattedMessage id="menu.historyOrders.day" defaultMessage="近一天"/>},{key: 7, label: <FormattedMessage id = "menu.historyOrders.week" defaultMessage="近一周" />}, {key: 30, label: <FormattedMessage id="menu.historyOrders.month" defaultMessage="近一月"/>}, {key: -1, label: <FormattedMessage id ="menu.historyOrders.all" defaultMessage="全部"/>}];
        let historyQueryTypeMenu = <Menu onClick={this.onHistoryQueryTypeClick.bind(this)} multiple={false} selectedKeys={this.state.selectedHistorySpan}>
            {historyQueryTypes.map((item,index) => <MenuItem key={item.key}><span>{item.label}</span></MenuItem>) }
        </Menu>;

        let symbols = Object.values(this.state.symbolList);
        let symbols1 = symbols.filter((item) => {
            return this.state.favorite1.indexOf(item.name) > -1;
        });
        let symbols2 = symbols.filter((item) => {
            return this.state.favorite2.indexOf(item.name) > -1;
        });
        let symbols3 = symbols.filter((item) => {
            return this.state.favorite3.indexOf(item.name) > -1;
        });

        return (
            <IntlProvider locale={this.state.locale} messages={this.state.messages}>
                <div className="App">
                    <div className="App-header">
                        <Dropdown overlay = {historyQueryTypeMenu} placement="bottomLeft" ><a href="javascript: void(0);">
                            <FormattedMessage
                                id="menu.historyOrders"
                                defaultMessage = "历史订单"
                            />
                        </a></Dropdown>
                        <Dropdown overlay = {i18nMenu}><a href="javascript: void(0);">
                            <FormattedMessage
                                id="menu.language"
                                defaultMessage = "语言"
                            />
                        </a></Dropdown>
                        <Dropdown overlay = {helpMenu} placement="bottomLeft"><a href="javascript: void(0);">
                            <FormattedMessage
                                id="menu.help"
                                defaultMessage = "帮助"
                            />
                        </a></Dropdown>

                        <div style={{float: 'right'}}>
                            <span><FormattedMessage id="accountNumber" defaultMessage="账户号"/>:{this.state.account.account}</span> &nbsp; &nbsp; <span onClick={this.logout.bind(this)} style={{cursor: 'pointer'}}><FormattedMessage id="menu.logout" defaultMessage="退出" /></span>
                        </div>
                    </div>
                    <div className="App-content">
                        <div className="nav panel">
                            <Tabs type="card">
                                <TabPane tab={<FormattedMessage id="forexOptions" defaultMessage="二元期商品" />} key="1">
                                    <div className="table-header">
                                        <div className="row header">
                                            <div className="cell name"><FormattedMessage id="symbol" defaultMessage="商品"/></div>
                                            <div className="cell price"><FormattedMessage id="price" defaultMessage="价位"/></div>
                                        </div>
                                        <div className="b-symbol-list" style={{position: 'absolute', top: '30px', left: '4px', bottom: '6px', right: '4px'}}>
                                            <Tabs tabPosition="bottom" type="card">
                                                <TabPane tab={<FormattedMessage id="all" defaultMessage="全部"/>} key="0">
                                                    <div className="table-rows">
                                                    <Scrollbars
                                                        autoHide
                                                        autoHideTimeout={1000}
                                                        autoHideDuration={200}>
                                                        <SymbolList
                                                            noItemMessage={<FormattedMessage id="text.noForexOptionsSymbol" message="没有商品信息!"/>}
                                                            symbols={symbols}
                                                            onFavoriteClick={this.onFavoriteClick.bind(this)}
                                                            onCreateOrder={this.onCreateOrder.bind(this)}
                                                            onCreateDownOrder={this.onCreateDownOrder.bind(this)}
                                                            onCreateUpOrder={this.onCreateUpOrder.bind(this)}
                                                            onCurrentSymbolChange={this.onCurrentSymbolChange.bind(this)}
                                                            favorite1={this.state.favorite1}
                                                            favorite2={this.state.favorite2}
                                                            favorite3={this.state.favorite3}
                                                        />
                                                    </Scrollbars>
                                                    </div>
                                                </TabPane>
                                                <TabPane tab="1" key="1">
                                                    <div className="table-rows">
                                                    <Scrollbars
                                                        autoHide
                                                        autoHideTimeout={1000}
                                                        autoHideDuration={200}>
                                                        <SymbolList
                                                            noItemMessage={<FormattedMessage id="text.noForexOptionsSymbol" message="没有商品信息!"/>}
                                                            symbols={symbols1}
                                                            onFavoriteClick={this.onFavoriteClick.bind(this)}
                                                            onCreateOrder={this.onCreateOrder.bind(this)}
                                                            onCreateDownOrder={this.onCreateDownOrder.bind(this)}
                                                            onCreateUpOrder={this.onCreateUpOrder.bind(this)}
                                                            onCurrentSymbolChange={this.onCurrentSymbolChange.bind(this)}
                                                            favorite1={this.state.favorite1}
                                                            favorite2={this.state.favorite2}
                                                            favorite3={this.state.favorite3}
                                                        />
                                                    </Scrollbars>
                                                    </div>
                                                </TabPane>
                                                <TabPane tab="2" key="2">
                                                    <div className="table-rows">
                                                    <Scrollbars
                                                        autoHide
                                                        autoHideTimeout={1000}
                                                        autoHideDuration={200}>
                                                        <SymbolList
                                                            noItemMessage={<FormattedMessage id="text.noForexOptionsSymbol" message="没有商品信息!"/>}
                                                            symbols={symbols2}
                                                            onFavoriteClick={this.onFavoriteClick.bind(this)}
                                                            onCreateOrder={this.onCreateOrder.bind(this)}
                                                            onCreateDownOrder={this.onCreateDownOrder.bind(this)}
                                                            onCreateUpOrder={this.onCreateUpOrder.bind(this)}
                                                            onCurrentSymbolChange={this.onCurrentSymbolChange.bind(this)}
                                                            favorite1={this.state.favorite1}
                                                            favorite2={this.state.favorite2}
                                                            favorite3={this.state.favorite3}
                                                        />
                                                    </Scrollbars>
                                                    </div>
                                                </TabPane>
                                                <TabPane tab="3" key="3">
                                                    <div className="table-rows">
                                                    <Scrollbars
                                                        autoHide
                                                        autoHideTimeout={1000}
                                                        autoHideDuration={200}>
                                                        <SymbolList
                                                            noItemMessage={<FormattedMessage id="text.noForexOptionsSymbol" message="没有商品信息!"/>}
                                                            symbols={symbols3}
                                                            onFavoriteClick={this.onFavoriteClick.bind(this)}
                                                            onCreateOrder={this.onCreateOrder.bind(this)}
                                                            onCreateDownOrder={this.onCreateDownOrder.bind(this)}
                                                            onCreateUpOrder={this.onCreateUpOrder.bind(this)}
                                                            onCurrentSymbolChange={this.onCurrentSymbolChange.bind(this)}
                                                            favorite1={this.state.favorite1}
                                                            favorite2={this.state.favorite2}
                                                            favorite3={this.state.favorite3}
                                                        />
                                                    </Scrollbars>
                                                    </div>
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="main" style={this.state.chartContainerStyle}>
                            <div className="header">
                                <div className="icon-logo" style={{marginRight: '20px'}}>
                                </div><Button onClick={this.onFullScreen.bind(this)} type={'primary'} size={'small'} style={{marginRight: '20px'}}>{this.state.fullScreen ? <FormattedMessage id="reset" defaultMessage="还原"/> : <FormattedMessage id="maxsize" defaultMessage="最大化"/>}
                                </Button><span style={{marginRight: '20px'}}>{this.state.symbol}</span><Select  value={this.state.period  + ''} size={'small'} onSelect={this.onPeriodSelect.bind(this)}>
                                { PERIOD.map((period) => <Option key={period.key}> {period.label} </Option>) }
                                </Select>
                            </div>
                            <div style={{position: 'absolute', top: '30px', bottom: '0', width: '100%'}}>
                                <ReactEchartsCore
                                        style={{position: 'absolute', width: '100%', height: '100%'}}
                                        echarts={echarts}
                                        option={this.state.chartOptions}
                                        notMerge={ true }
                                        lazyUpdate={ true }
                                        onChartReady={ this.onChartReady.bind(this)}
                                        onEvents={this.onChartEvents}
                                        showLoading={this.state.isLoading}
                                        loadingOption={this.state.loadingOpts}
                                        ref={(e) => {
                                            if (e) {
                                                this.echarts = e.getEchartsInstance();
                                            } else {
                                                this.echarts = null;
                                            }
                                        }}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="App-footer panel">
                        <Tabs onTabClick={this.onFooterTabClick.bind(this)} type="card" activeKey={this.state.activeKeyFooter}>
                            <TabPane tab={<FormattedMessage id="title.pendingOrder" defaultMessage="二元期订单"/>} key="open-order">
                                <div className="table-header">
                                    <div className="row header">
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="title.id" defaultMessage="订单号"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="symbol" defaultMessage="货币"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="title.openPrice" defaultMessage="开仓价"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="price" defaultMessage="现价"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="type" defaultMessage="看涨/看跌"/></div>
                                        <div className="cell" style={{width: '141px'}}><FormattedMessage id="time" defaultMessage="时间"/></div>
                                        <div className="cell" style={{width: '141px'}}><FormattedMessage id="title.expiration" defaultMessage="到期"/></div>
                                        <div className="cell" style={{width: '81px'}}><FormattedMessage id="title.countdown" defaultMessage="倒计时"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="title.investment" defaultMessage="投资"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="profit" defaultMessage="盈利"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="title.status" defaultMessage="状态"/></div>
                                        <div className="cell"></div>
                                    </div>
                                </div>

                                <div className="table-rows">
                                    <Scrollbars
                                        autoHide
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}>
                                    {
                                        this.state.orders.length > 0 ? this.state.orders.map((order) => <div key={order.position} className="row" onClick={this.onOrderClick.bind(this, order)}>
                                                <div className="cell" style={{width: '100px'}}>#{order.position}
                                                </div><div className="cell" style={{width: '100px'}}>{order.symbol}
                                                </div><div className="cell" style={{width: '100px'}}>{order.open_price}
                                                </div><div className="cell" style={{width: '100px'}}>{this.getSymbolPrice(order.symbol)}
                                                </div><div className="cell" style={{width: '100px'}}>{this.getTypeName(order.type)}
                                                </div><div className="cell" style={{width: '140px'}}>{this.formatDateTime(order.open_time)}
                                                </div><div className="cell" style={{width: '140px'}}>{this.formatDateTime(order.open_time + order.expiration * 60)}
                                                </div><div className="cell" style={{width: '80px'}}>{this.calculateTimeSpan(order)}
                                                </div><div className="cell" style={{width: '100px'}}>{order.investment}
                                                </div><div className="cell" style={{width: '100px'}}>{this.calculateProfit(order)}
                                                </div><div className="cell" style={{width: '100px'}}>{this.calculateStatusNode(order)}
                                                </div>
                                            </div>
                                        ): <div className="row-no-record">
                                            <FormattedMessage id="text.noOrders" defaultMessage="没有持仓订单!"/>
                                        </div>
                                    }
                                    </Scrollbars>
                                </div>
                            </TabPane>
                            <TabPane tab={<FormattedMessage id="menu.historyOrders" defaultMessage="历史订单"/>} key="history-order">
                                <div className="table-header">
                                    <div className="row header">
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="title.id" defaultMessage="订单号"/></div>
                                        <div className="cell" style={{width: '121px'}}><FormattedMessage id="symbol" defaultMessage="货币"/></div>
                                        <div className="cell" style={{width: '121px'}}><FormattedMessage id="title.transactionType" defaultMessage="交易类型"/></div>
                                        <div className="cell" style={{width: '121px'}}><FormattedMessage id="title.openPrice" defaultMessage="开仓价"/></div>
                                        <div className="cell" style={{width: '141px'}}><FormattedMessage id="title.openTime" defaultMessage="开仓时间"/></div>
                                        <div className="cell" style={{width: '121px'}}><FormattedMessage id="title.investment" defaultMessage="投资金额"/></div>
                                        <div className="cell" style={{width: '101px'}}><FormattedMessage id="title.expectedTime" defaultMessage="预期时间"/></div>
                                        <div className="cell" style={{width: '121px'}}><FormattedMessage id="title.closePrice" defaultMessage="平仓价格"/></div>
                                        <div className="cell" style={{width: '121px'}}><FormattedMessage id="profit" defaultMessage="盈利"/></div>
                                        <div className="cell"></div>
                                    </div>
                                </div>


                                <div className="table-rows">
                                    <Scrollbars
                                               autoHide
                                               autoHideTimeout={1000}
                                               autoHideDuration={200}>
                                        {
                                            this.state.historyOrders.length > 0 ? this.state.historyOrders.map((historyOrder) => <div key={historyOrder.position} className="row">
                                                    <div className="cell" style={{width: '100px'}}>#{historyOrder.position}
                                                    </div><div className="cell" style={{width: '120px'}}>{historyOrder.symbol}
                                                    </div><div className="cell" style={{width: '120px'}}>{this.getHistoryOrderType(historyOrder)}
                                                    </div><div className="cell" style={{width: '120px'}}>{(historyOrder.cmd!==6&&historyOrder.cmd!==7)&&historyOrder.open_price}
                                                    </div><div className="cell" style={{width: '140px'}}>{this.formatDateTime(historyOrder.open_time)}
                                                    </div><div className="cell" style={{width: '120px'}}>{(historyOrder.cmd!==6&&historyOrder.cmd!==7)&&historyOrder.investment}
                                                    </div><div className="cell" style={{width: '100px'}}>{(historyOrder.cmd!==6&&historyOrder.cmd!==7)&&formatExpiration(historyOrder.expiration)}
                                                    </div><div className="cell" style={{width: '120px'}}>{(historyOrder.cmd!==6&&historyOrder.cmd!==7)&&historyOrder.close_price}
                                                    </div><div className="cell" style={{width: '120px'}}>{this.calculateProfitNode(historyOrder.profit)}
                                                    </div>
                                                </div>
                                            ) : <div className="row-no-record">
                                               <FormattedMessage id="text.noHistoryOrders" defaultMessage="没有符合条件的历史订单！"/>
                                            </div>
                                        }
                                    </Scrollbars>
                                </div>
                            </TabPane>
                            <TabPane tab={<FormattedMessage id="account" defaultMessage="帐户"/> } key="account">
                                <div className="table-header">
                                    <div className="row header">
                                        <div className="cell" style={{width: '100px'}}><FormattedMessage id="title.accountInfo" defaultMessage="账户信息"/></div>
                                        <div className="cell"></div>
                                    </div>
                                </div>
                                <div className="table-rows">

                                    <Scrollbars
                                        autoHide
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}>
                                        <div>
                                            <div className="row">
                                                <div className="cell" style={{width: '120px'}}><FormattedMessage id="accountNumber" defaultMessage="帐户号"/>
                                                </div><div className="cell">{this.state.account.account}</div>
                                            </div>
                                            <div className="row">
                                                <div className="cell" style={{width: '120px'}}><FormattedMessage id="accountName" defaultMessage="帐户名"/>
                                                </div><div className="cell">{this.state.account.name}</div>
                                            </div>
                                            <div className="row">
                                                <div className="cell" style={{width: '120px'}}><FormattedMessage id="symbol" defaultMessage="货币类型"/>
                                                </div><div className="cell">{this.state.account.currency}</div>
                                            </div>
                                            <div className="row">
                                                <div className="cell" style={{width: '120px'}}><FormattedMessage id="balance" defaultMessage="账户余额"/>
                                                </div><div className="cell">{this.state.account.balance}</div>
                                            </div>
                                            <div className="row">
                                                <div className="cell" style={{width: '120px'}}><FormattedMessage id="credit" defaultMessage="信用额"/>
                                                </div><div className="cell">{this.state.account.credit}</div>
                                            </div>
                                            <div className="row">
                                                <div className="cell" style={{width: '120px'}}><FormattedMessage id="invest_instruction" defaultMessage="说明"/>
                                                </div><div className="cell">
                                                <FormattedMessage values={this.getAccountSymbolInfo()} id="invest_description" defaultMessage="最小投资额:{minimum},最大投资额:{maximum}"/></div>
                                            </div>
                                        </div>
                                    </Scrollbars>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                    <Modal
                        className={'order-dialog-large'}
                        visible={this.state.modalCreateOrderVisible}
                        closable={false}
                        title={this.state.symbol}
                        footer={
                            <div style={{textAlign: 'center'}}>
                                <Button size={'small'} style={{width: '100%'}} className={'btn-default'} onClick={this.onHideModalCreateOrder.bind(this)}><FormattedMessage id="button.cancel" defaultMessage="取消"/></Button>
                            </div>
                        }
                    >
                        <div className="order-row">
                            <div className="cell">
                                <FormattedMessage id="title.investmentAmount" defaultMessage="投放资本"/>
                            </div><div className="cell">
                                <input id="investment" style={{width: '100px', marginTop: '4px'}} name="investment" defaultValue="" type="text" ref = {(input) => {this.investmentInput = input}} />
                            </div><div className="cell">
                                <Button onClick={this.onSubmitCreateOrderUp.bind(this)} style={{width: '138px'}} size={'small'} className={ 'btn-up'}>
                                    <FormattedMessage id="button.up" defaultMessage="看涨"/></Button>
                            </div>
                        </div>

                        <div className="order-row">
                            <div className="cell">
                                <FormattedMessage id="invest_instruction" defaultMessage="说明"/>
                            </div><div className="cell" style={{width: '66.66%'}}>
                                <FormattedMessage values={this.getSymbolInfo(this.state.symbol)} id="invest_description" defaultMessage="最小投资额:{minimum},最大投资额:{maximum}"/>
                            </div>
                        </div>
                        <div className="order-row">
                            <div className="cell">
                                <FormattedMessage id="title.payoff" defaultMessage="支付盈利"/>
                            </div><div className="cell">
                                {this.state.order.win}%
                            </div><div className="cell">
                                {this.getSymbolPrice(this.state.symbol)}
                            </div>
                        </div>
                        <div className="order-row">
                            <div className="cell">
                                <FormattedMessage id="title.manualCloseOrder" defaultMessage="手动关闭委托"/>
                            </div><div className="cell">
                                --
                            </div><div className="cell">

                            </div>
                        </div>
                        <div className="order-row">
                            <div className="cell">
                                <FormattedMessage id="title.expiration" defaultMessage="到期"/>
                            </div><div className="cell">
                                <Select value={this.state.order.expiration + ''} onChange={this.onExpirationChange.bind(this)} style={{width: '100px'}} size={'small'} >
                                    {
                                        this.state.order.expirations.map((item) => {
                                            return <Option key={item.key}>{item.label}</Option>
                                        })
                                    }
                                </Select>
                            </div><div className="cell">
                                <Button onClick={this.onSubmitCreateOrderDown.bind(this)} style={{width: '138px'}} size={'small'} className={ 'btn-down'}><FormattedMessage id="button.down" defaultMessage="看跌" /></Button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        className={'order-dialog-small'}
                        visible={this.state.modalCreateUpOrderVisible}
                        closable={false}
                        title={<span><FormattedMessage id="button.makeInvestment" defaultMessage="下单"/> ?</span>}
                        footer={
                            <div style={{textAlign: 'center'}}>
                                <Button onClick={this.onSubmitCreateUpDownOrder.bind(this)} style={{width: '90px'}} size={'small'} className={ this.state.order.type === 1 ? 'btn-up': 'btn-down'}>{this.state.order.type === 1 ? <FormattedMessage id="button.up" defaultMessage="看涨"/>: <FormattedMessage id="button.down" defaultMessage="看跌"/>}</Button><Button onClick={this.onHideCreateUpOrder.bind(this)} style={{width: '90px', marginLeft: '20px'}} size={'small'} className={ 'btn-cancel' }><FormattedMessage id="button.cancel" defaultMessage="取消"/></Button>
                            </div>
                        }
                    >
                        <p>
                            <FormattedMessage id="text.orderDescription" defaultMessage="买{symbol}{direction}为期{expiration}" values={{
                                symbol: this.state.order.symbol,
                                expiration: this.formatExpiration(this.state.order.expiration),
                                direction: this.state.order.type === 1 ? <FormattedMessage id="button.up" defaultMessage="看涨"/>: <FormattedMessage id="button.down" defaultMessage="看跌"/>
                            }}/>
                        </p>
                    </Modal>

                    <Modal
                        className={'order-dialog-info'}
                        visible={this.state.modalOrderInfoVisible}
                        closable={false}
                        title={this.state.orderInfo ? (this.state.orderInfo.symbol + ' ' + (this.state.orderInfo.type === 1 ? 'UP' : 'DOWN')) : '' }
                        footer={
                            <div style={{textAlign: 'center'}}>
                                <Button onClick={this.onHideModalOrderInfo.bind(this)} style={{width: '100%'}} size={'small'} className={'btn-default'}>
                                    <FormattedMessage id="close" defaultMessage="关闭"/></Button>
                            </div>
                        }
                    >
                            <div>
                                <div className="chart-box">
                                    { this.state.modalOrderInfoVisible && <CountingDown style={{position: 'relative', width: '100%', height: '100%'}} startTime={this.state.orderInfo.open_time * 1000+ this.state.timeDiff } endTime={ this.state.orderInfo.open_time * 1000 + this.state.timeDiff + this.state.orderInfo.expiration * 60 * 1000} />}
                                </div>
                                <div className="info-box">
                                    <div className="row">
                                        <div className="cell label1">
                                            <FormattedMessage id="title.investment" defaultMessage="投资"/>
                                        </div>
                                        <div className="cell value1">
                                            {
                                                this.state.orderInfo.investment
                                            }
                                        </div>
                                        <div className="cell label2">
                                            <FormattedMessage id="title.openPrice" defaultMessage="开仓价格"/>
                                        </div>
                                        <div className="cell value2">
                                            {
                                                this.state.orderInfo.open_price
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="cell label1">
                                            <FormattedMessage id="profit" defaultMessage="盈利"/>
                                        </div>
                                        <div className="cell value1">
                                            {
                                                this.calculateProfit(this.state.orderInfo)
                                            }
                                        </div>
                                        <div className="cell label2">
                                            <FormattedMessage id="price" defaultMessage="现价"/>
                                        </div>
                                        <div className="cell value2">
                                            {
                                                this.getSymbolPrice(this.state.orderInfo.symbol)
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="cell label1">
                                            <FormattedMessage id="title.expiration" defaultMessage="到期"/>
                                        </div>
                                        <div className="cell value1">
                                            {
                                                this.formatExpiration(this.state.orderInfo.expiration)
                                            }
                                        </div>
                                        <div className="cell label2">
                                            <FormattedMessage id="title.direction" defaultMessage="方向"/>
                                        </div>
                                        <div className="cell value2">
                                            {
                                                this.state.orderInfo.type === 1 ? 'UP' : 'DOWN'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </Modal>

                    <ModalAbout visible={this.state.modalAboutVisible} onClose={this.onHideAbout.bind(this)} />

                    <ModalChangePassword login={this.state.account.account} visible={this.state.isModalChangePasswordVisible} onClose={this.onHideChangePassword.bind(this)} />
                </div>
            </IntlProvider>
        );
    }
}

export default App;
