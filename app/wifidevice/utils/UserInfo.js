/**
 * Created by ysq on 17/4/6.
 */


var userId = "";

var UserInfo = {

    saveUserId(data){
       userId = data.userId;
    },

    getUserId(){
        return userId;
    }
}
module.exports = UserInfo;