'use strict';

const Des = require('@remobile/react-native-des');
const KEY = CONSTANTS.DES_KEY;
const API_VERSION = CONSTANTS.API_VERSION;

module.exports = (url, parameter, success, failed, wait) => {
    const __from__ = parameter.__from__;
    parameter = _.omit(parameter, '__from__');
    console.log('send:', url, parameter);
    if (typeof failed === 'boolean') {
        wait = failed;
        failed = null;
    }
    if (wait) {
        app.showProgressHUD();
    }
    Des.encrypt(JSON.stringify(parameter), KEY, (base64) => {
        const param = base64;
        fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
                'hardware-guid': app.uniqueLoginMgr.uuid,
                'userId': app.personal.info ? app.personal.info.userID : '',
                'version': API_VERSION,
            },
            body: param,
        })
        .then((response) => response.headers.get('ejected-yx') === 'true' ? '==logout==' : response.text())
        .then((base64) => {
            // console.log("base64:",base64);
            if (base64 === '==logout==') {
                if (__from__ === 'splash') {
                    failed();
                } else if (url === app.route.ROUTE_EXTERNAL_LOGIN || url === app.route.ROUTE_LOGIN) {
                    failed && failed();
                    Toast('该账号在其他地方登陆');
                } else if (url === app.route.ROUTE_GET_PERSONAL_INFO && __from__ === 'login') {
                    failed && failed();
                    Toast('该账号在其他地方登陆');
                } else {
                    if (wait) {
                        app.dismissProgressHUD();
                    }
                    Toast('该账号在其他地方登陆');
                    setTimeout(() => {
                        app.navigator.resetTo({ component: require('../../modules/login/Login') });
                    }, 1000);
                }
            } else {
                success && Des.decrypt(base64, KEY, (jsonString) => {
                    let json = {};
                    try {
                        json = JSON.parse(jsonString);
                    } catch (error) {
                        if (!failed || !failed(error)) {
                            Toast('JSON解析错误');
                            console.log(url + ':JSON解析错误');
                            if (wait) {
                                app.dismissProgressHUD();
                            }
                        }
                    }
                    console.log(url, 'recv:', json);
                    if (wait) {
                        app.dismissProgressHUD();
                    }
                    success(json);
                }, () => {
                    if (!failed || !failed()) {
                        Toast('数据解密错误');
                        console.log(url + ':数据解密错误');
                        if (wait) {
                            app.dismissProgressHUD();
                        }
                    }
                });
            }
        })
        .catch((error) => {
            if (!failed || !failed(error)) {
                Toast('网络错误');
                console.log(url + ':网络错误');
                if (wait) {
                    app.dismissProgressHUD();
                }
            }
        });
    }, () => {
        if (!failed || !failed()) {
            Toast('数据加密错误');
            if (wait) {
                app.dismissProgressHUD();
            }
        }
    });
};
