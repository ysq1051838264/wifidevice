/**
 * Created by ysq on 17/4/6.
 */


var userId = "";
var wifiPwd = "";

var UserInfo = {
    saveWifiPwd(wifi){
        wifiPwd = wifi;
    },

    getWifiPwd(){
        return wifiPwd;
    },

    saveUserId(data){
        userId = data.userId;
    },

    getUserId(){
        return userId;
    }
}
module.exports = UserInfo;