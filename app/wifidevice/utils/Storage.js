/**
 * Created by ysq on 17/3/10.
 */

'use strict';
import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';

const SESSIONKEY = 'sessionkey';
const THEMECOLOR = 'themecolor';

const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync同步方法，无缝返回最新数据。
    // 同步方法的具体说明会在后文提到
    // sync: {
    // }
});

export function saveSessionKey(sessionkey) {
    return storage.save({
        key: SESSIONKEY,
        rawData: {
            sessionkey: sessionkey
        }
    });
}

export function saveThemeColor(themecolor) {
    return storage.save({
        key: THEMECOLOR,
        rawData: {
            themecolor: themecolor
        }
    });
}

export function getThemeColor() {
    return storage.load({
        key: THEMECOLOR,
    });
}

export function getTheme() {
    return storage.load({
        key: THEMECOLOR,
    }).then(data =>{
        return data.themecolor;
    });
}

export function getSessionKey() {
    // return storage.getAllDataForKey(SESSIONKEY).then(data => {
    //     console.log("这是什么鬼,居然拿不到", data);
    //     return data;
    // });

    return storage.load({
        key: SESSIONKEY,
    });
}