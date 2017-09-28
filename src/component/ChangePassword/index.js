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
import { isValidPassword } from '../../lib/util';
import BO_RET from '../../error';

import { Form, Input, Button, Modal,message, notification } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
        let { intl, form } = this.props;
        let { formatMessage } = intl;
        let msg;
        if (value && !isValidPassword(value)) {
            msg = formatMessage({id: 'error2089'});
        }
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true})
        }
        callback(msg);
    }

    checkConfirm(rule, value, callback) {
        let { intl, form } = this.props;
        let { formatMessage } = intl;
        let msg
        if(value && value != form.getFieldValue('newpassword')) {
            msg = formatMessage({ id: 'text.password_inconsistent'});
        }
        callback(msg)
    }


    processResponse (res) {
        let { intl } = this.props;
        let { formatMessage } = intl;
        if (res.ok && res.status === 200) {
            return res.json().then((json) => {
                let code = json.code;
                switch (code) {
                    case BO_RET.BO_RET_OK.code:
                        return json;
                    default:
                        json.message = formatMessage({id: `error${code}`, defaultMessage: formatMessage({id: 'text.unknown_error'})});
                        message.error(`${code}: ${json.message}`);
                        return json;
                }
            });
        }
        else {
            let code = res.status;
            let message = `Network error: ${res.status} ${res.statusText}`
            message.error(message)
            return {
                code,
                message
            };
        }
    }

    onSave() {
        let { form, intl, onClose, login } = this.props;
        let { getFieldsValue, validateFields} = form;
        let { formatMessage } = intl;
        validateFields(errors => {
            if (!errors) {
                let {  password, newpassword } = getFieldsValue();

                let params = {login, password, newpassword };
                this.setState({
                    isSaving: true
                });
                let promise = changePassword(params);
                promise.then(this.processResponse.bind(this)).then(res => {
                    this.setState({
                        isSaving: false
                    });
                    if (res.code === 0) {
                        message.success(formatMessage({id: 'text.save_password_success'}));
                        form.resetFields();
                        onClose(true);
                    }
                });
            }
        });
    }

    onClose() {
        let { onClose, form } = this.props;
        form.resetFields();
        onClose();
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
                    <Button onClick={this.onClose.bind(this)} style={{width: '60px', marginLeft: '10px'}} size={'small'} className={'btn-default'}><FormattedMessage id="button.cancel" defaultMessage="取消"/> </Button>
                </div>
            }
        >
            <div>
               <Form>
                   <FormItem hasFeedback {...formItemLayout} label={<FormattedMessage id="old_password"/>}>
                       {
                           getFieldDecorator('password', {
                               rules: [{
                                   required: true,
                                   message: formatMessage({id: 'text.old_password_required'})
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
                               }, {
                                   validator: this.checkPassword.bind(this)
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
                               }, {
                                   validator: this.checkConfirm.bind(this)
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
