/**
 * Copyright(c) Richard
 * Created by Richard on 17/6/29.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import SymbolItem from '../SymbolItem';

export default class SymbolList extends React.Component {

    static propTypes = {
        symbols: PropTypes.array,
        favorite1: PropTypes.array,
        favorite2: PropTypes.array,
        favorite3: PropTypes.array,
        onCreateOrder: PropTypes.func,
        onCreateUpOrder: PropTypes.func,
        onCreateDownOrder: PropTypes.func,
        onFavoriteClick: PropTypes.func,
        onCurrentSymbolChange: PropTypes.func,
        noItemMessage: PropTypes.string
    };

    static defaultProps = {
        symbols: [],
        favorite1: [],
        favorite2: [],
        favorite3: [],
        noItemMessage: <FormattedMessage id="text.noForexOptionsSymbol" message="没有商品信息!"/>
    };

    constructor(props) {
        super(props);
        this.state = {
            currentSymbol: ''
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    getFavorites (symbol) {
        let value = {};
        let name = symbol.name;
        value.favorite1 = this.props.favorite1.indexOf(name) > -1;
        value.favorite2 = this.props.favorite2.indexOf(name) > -1;
        value.favorite3 = this.props.favorite3.indexOf(name) > -1;
        return value;
    }

    onRowClick (symbol) {
        let currentSymbol = symbol.name;

        this.setState({
            currentSymbol
        }, () => {
            if (typeof this.props.onCurrentSymbolChange === 'function') {
                this.props.onCurrentSymbolChange(symbol);
            }
        });

    }

    onCreateOrder (symbol) {
        if (typeof this.props.onCreateOrder === 'function') {
            this.props.onCreateOrder(symbol);
        }
    }

    onCreateUpOrder (symbol) {
        if (typeof this.props.onCreateUpOrder === 'function' ){
            this.props.onCreateUpOrder(symbol);
        }
    }

    onCreateDownOrder (symbol) {
        if (typeof this.props.onCreateDownOrder === 'function') {
            this.props.onCreateDownOrder(symbol);
        }
    }

    onFavoriteClick (symbol, key) {
        if (typeof this.props.onFavoriteClick === 'function') {
            this.props.onFavoriteClick(symbol, key);
        }
    }

    render() {
        return <div style={{position: 'relative', 'width': '100%', 'height': '100%'}}>
            {
                this.props.symbols.length > 0 ? this.props.symbols.map((symbol) => <SymbolItem
                    key={symbol.name}
                    symbol={symbol}
                    onCreateOrder={this.onCreateOrder.bind(this)}
                    onCreateUpOrder={this.onCreateUpOrder.bind(this)}
                    onCreateDownOrder={this.onCreateDownOrder.bind(this)}
                    onFavoriteClick={this.onFavoriteClick.bind(this)}
                    onRowClick={this.onRowClick.bind(this)}
                    favorites={this.getFavorites(symbol)}
                    isOpen={this.state.currentSymbol === symbol.name}
                />) : <div style={{position: 'relative', top: '50%', height: '30px', lineHeight: '30px', marginTop: '-15px', textAlign: 'center'}}>
                    { this.props.noItemMessage }
                </div>
            }
        </div>;
    }
}