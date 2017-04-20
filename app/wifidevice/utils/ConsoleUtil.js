'use strict';

import * as Storage from './Storage';


/**
 * 打印日志方法
 * @param string
 */
function myLog(string) {
    console.log(string);
}

global.myLog = myLog;

