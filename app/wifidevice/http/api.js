'use strict';
import {
    AsyncStorage,
    AlertIOS,
}from 'react-native';

import * as Storage from '../utils/Storage';

var public_params = {
    "app_revision": "2.0.8",
    "app_id": "Qing_Niu",
    "platform": "android",
    "system_type": "6.0.1_23",
    "cellphone_type": "CHM-CL00"
};

var session_key = "";

var Api = {
    config: {
        api: 'api.yolanda.hk',
        // api: '192.168.1.37:3002',
        // app 版本号
        version: 1.1,
        debug: 1,
    },

    saveSessionKey(sessionKey){
        session_key = sessionKey;
    },

    savePublicParams(data){
        public_params.app_revision = data.app_revision;
        public_params.app_id = data.app_id;
        public_params.platform = data.platform;
        public_params.system_type = data.system_type;
        public_params.cellphone_type = data.cellphone_type;
        this.config.api = data.api
    },

    serialize: function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },

    // core ajax handler
    send(url, options) {
        console.log('开始: ', options);
        var defaultOptions = {
            method: 'GET',
            error: function () {
                options.success({
                    'errcode': 501,
                    'errstr': '系统繁忙,请稍候尝试'
                });
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            success: function (result) {
            }
        };

        options = Object.assign({}, defaultOptions, options);
        options.url = url;

        if (this.config.debug) {
            console.log('HTTP请求: ', options);
        }

        // todo support for https
        return fetch(options.url, options)
            .then((response) => response.json())
            .then(result => {
                console.log("服务器返回：", result)
                if (result.status.code != 20000) {
                    console.log("请求错误，状态码：" + result.status.code + " " + result.status.message);
                    return Promise.reject(result.status);
                } else {
                    return Promise.resolve(result.data);
                }
            })
    },

    doGet(url, data, useSession = true){
        if (useSession) {
            data.terminal_user_session_key = session_key
        }
        var data = Object.assign({}, public_params, data);

        const full_url = "http://" + this.config.api + url + '?' + this.serialize(data);
        return this.send(full_url, {
            method: 'GET',
        })
    },

    doPost(url, data, useSession = true){
        var pp = public_params;
        if (useSession) {
            pp.terminal_user_session_key = session_key
        }
        const full_url = "http://" + this.config.api + url + "?" + this.serialize(pp);

        var paramStr = this.serialize(data);
        console.log("请求参数:", paramStr);
        return this.send(full_url, {
            method: 'POST',
            body: paramStr,
        })
    },

    //延时函数，用于给请求计时
    timeout: function () {
        var p = new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject('网络请求超时');
            }, 15000);
        });
        return p;
    },
};

module.exports = Api;