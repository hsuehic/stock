/**
 * Copyright(c) Richard
 * Created by Richard on 17/7/28.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Dropdown, Menu, Modal, notification, Select, Tabs } from 'antd';

import { COLORS, PERIOD } from './constant';


const Option = Select.Option;
const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;

class Test extends React.Component {
    render () {
        let i18ns = [{label: '中文', value: 'zh-CN'}, {label: 'English', value: 'en-US'}];
        let i18nMenu = <Menu >
            { i18ns.map((i18n, index) => <MenuItem key={i18n.value}><span>{i18n.label}</span></MenuItem>)}
        </Menu>;

        return <div>

            <Dropdown overlay = {i18nMenu}><a href="javascript: void(0);">
                语言
            </a></Dropdown>

            <Select size={'small'}>
                { PERIOD.map((period) => <Option key={period.key}> {period.label} </Option>) }
            </Select>
        </div>
    }
}

ReactDOM.render(<Test/>, document.getElementById('root'));