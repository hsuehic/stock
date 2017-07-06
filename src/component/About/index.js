/**
 * Copyright(c) Richard
 * Created by Richard on 17/7/6.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal } from 'antd';

import logo from '../../assets/clm3-logo.png';

export default class Component extends React.Component {

    static PropTypes = {
        visible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <Modal
            className={'order-dialog-info'}
            closable={false}
            visible={this.props.visible}
            title={ '关于' }
            footer={
                <div style={{textAlign: 'right'}}>
                    <Button onClick={this.props.onClose} style={{width: '60px'}} size={'small'} className={'btn-default'}>关闭</Button>
                </div>
            }
        >
            <div>
                <img src={logo} style={{display: 'inline-block', width: '140px', height: '96px', marginRight: '15px',verticalAlign: 'middle'}} /><div style={{
                    display: 'inline-block', width: '400px', lineHeight: '32px', verticalAlign: 'middle', textAlign: 'center'}}>
                <div><strong>Core Liquidity Market</strong></div>
                    <div>http://www.clmforex.com</div>
                    <div>Copyright © 2017 - 2020</div>
                </div>
            </div>
        </Modal>
    }
}