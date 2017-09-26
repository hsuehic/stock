/**
 * Copyright(c) Richard
 * Created by Richard on 17/7/6.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { changePassword } from '../../api';

import { Form, Input, Button, Modal,message, notification } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const openNotificationWithIcon = ({type, message, description}) => {
    notification[type]({
        message,
        description
    });
};

class Component extends React.Component {

    static PropTypes = {
        visible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        intl: PropTypes.object.isRequired,
        login: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isSaving: false,
            confirmDirty: false
        };
    }

    componentDidMount() {

    }

    handleConfirmBlur (e) {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    checkPassword(rule, value, callback) {
        let { intl } = this.props;
        let { formatMessage } = intl;
        let reg = /(^\d+[a-zA-Z]+$)|(^[a-zA-Z]\d+$)/g
        let msg;
        if (!reg.test(value)) {
            msg = formatMessage({id: 'error2089'});
        }
        callback(msg);
    }

    checkConfirm(rule, value, callback) {
        let { intl } = this.props;
        let { formatMessage } = intl;
        let msg
        msg = formatMessage({ id: 'text.password_inconsistent'});
        callback(msg)
    }

    onSave() {
        let { form, intl } = this.props;
        let { getFieldsValue, validateFields} = form;
        let { formatMessage } = intl;
        validateFields(errors => {
            if (!errors) {
                let { login, password, newpassword } = getFieldsValue();
                let params = {login, password, newpassword };
                this.setState({
                    isSaving: true
                });
                let promise = changePassword(params);
                promise.then(res => {
                    this.setState({
                        isSaving: false
                    });
                    if (res.code === 0) {
                        message.success(formatMessage({id: 'text.save_password_success'}))
                    } else {
                        openNotificationWithIcon('error', formatMessage({id: 'title.error'}), formatMessage({id: `error${res.code}`, defaultMessage: formatMessage({id: 'text.unknown_error'})}))
                    }
                });
            }
        });
    }

    render() {
        let { form, intl } = this.props;
        let { getFieldDecorator } = form;
        let { formatMessage } = intl;

        return <Modal
            className="dialog-change-password"
            closable={false}
            visible={this.props.visible}
            title={ <FormattedMessage id="change_password" defaultMessage="修改密码" />}
            footer={
                <div style={{textAlign: 'right'}}>
                    <Button onClick={this.onSave.bind(this)} type="primary" style={{width: '60px'}} size={'small'} className={'btn-default'}><FormattedMessage id="button.save" defaultMessage="保存"/> </Button>
                    <Button onClick={this.props.onClose} style={{width: '60px', marginLeft: '10px'}} size={'small'} className={'btn-default'}><FormattedMessage id="button.cancel" defaultMessage="取消"/> </Button>
                </div>
            }
            style={{width: '320px'}}
        >
            <div>
               <Form>
                   <FormItem hasFeedback {...formItemLayout} label={<FormattedMessage id="old_password"/>}>
                       {
                           getFieldDecorator('password', {
                               rules: [{
                                   required: true,
                                   message: formatMessage({id: 'text.old_password_required'})
                               }, {

                               }]
                           })(
                               <Input type="password" placeholder={formatMessage({id: 'hint.old_password'})} />
                           )
                       }
                   </FormItem>
                   <FormItem hasFeedback {...formItemLayout} label={<FormattedMessage id="new_password"/>}>
                       {
                           getFieldDecorator('newpassword', {
                               rules: [{
                                   required: true,
                                   message: formatMessage({id: 'text.new_password_required'})
                               }]
                           })(
                               <Input type="password" placeholder={formatMessage({id: 'hint.new_password'})} />
                           )
                       }
                   </FormItem>
                   <FormItem hasFeedback {...formItemLayout} label={<FormattedMessage id="confirm_password"/>}>
                       {
                           getFieldDecorator('confirmpassword', {
                               rules: [{
                                   required: true,
                                   message: formatMessage({id: 'text.confirm_password_required'})
                               }]
                           })(
                               <Input type="password" placeholder={formatMessage({id: 'hint.confirm_password'})} onBlur={this.handleConfirmBlur.bind(this)} />
                           )
                       }
                   </FormItem>
               </Form>
            </div>
        </Modal>
    }
}

export default Form.create()(injectIntl(Component));
