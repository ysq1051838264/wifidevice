/**
 * Created by he on 17/3/10.
 */
import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    BackAndroid,
    Platform,
    NativeModules,
    AlertIOS,
    ToastAndroid,
} from 'react-native';


import commonStyles from '../styles/common';

import NavigationBar from '../component/NavigationBar';

import QNButton from '../component/QNButton';

import MeasureHttpClient from "../http/MeasureHttpClient";

var PixelRatio = require('PixelRatio');

import * as Constant from '../constant/constant';

import * as Storage from '../utils/Storage';

import Api from '../http/api';


export default class AppointMeasure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themeColor: null,
            seconds: 120,
            userId: 0,
            mac: '',
            status: Constant.STATUS_NONE,
        };
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.setState({
            themeColor: this.props.themeColor,
        });
    }

    componentWillUnMount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        if (this.state.isSelectFlag) {
            this.cancelOnPress();
            return true;
        }
        return false;
    };

    componentDidMount() {
        console.log(this.props.sessionKey)
        Api.saveSessionKey(this.props.sessionKey);
        Storage.saveSessionKey(this.props.sessionKey);
        Storage.saveThemeColor(this.props.themeColor);

        this.request();
    }


    request() {
        // 执行请求操作
        this.setState({
            status: Constant.STATUS_REQUESTING
        });

        const mac = this.props.mac;
        const user_id = this.props.userId;
        const time = new Date().getTime() / 1000;
        console.log("请求中" + this.state.status);
        this.time();
        MeasureHttpClient.occupyMeasure(time, user_id, mac)
            .then((data) => {
                console.log("请求成功", data);
                this.setState({
                    status: Constant.STATUS_REQUEST_SUCCESS
                });
            })
            .catch(e => {
                console.log("请求出错", e);
                this.setState({
                    status: Constant.STATUS_NONE
                });
                Platform.OS == 'ios' ? AlertIOS.alert(e["message"]) : ToastAndroid.show(e.message, ToastAndroid.SHORT);
            })
    }

    endMeasure() {
        Platform.OS == 'android' ? NativeModules.AppointMeasure.goBackToMainPage() : NativeModules.QNUI.popViewController();
    }

    // 倒计时
    time(){
        this.setState({
            seconds: 120,
        });
        this.interval = setInterval(() => {

            if (this.state.seconds > 0) {
                this.setState({seconds: (this.state.seconds - 1)});
            } else if (this.state.seconds == 0) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    status: Constant.STATUS_NONE,
                    seconds: 120,
                });
            }
        }, 1000);
    }

    onPressBack() {
        if (Platform.OS == 'ios') {
            NativeModules.QNUI.popViewController();
        } else {
            BackAndroid.exitApp();
        }
    }


    render() {

        var topTextStr, secondStr, topEndStr, pressAction, buttonStr;

        switch (this.state.status) {
            case Constant.STATUS_NONE: {
                console.log('请求失败');
                topTextStr = "";
                secondStr = "";
                topEndStr = "";
                pressAction = this.request.bind(this);
                buttonStr = "占有Wifi秤";
                break;
            }
            case Constant.STATUS_REQUESTING: {
                topTextStr = "";
                secondStr = "";
                topEndStr = "";
                buttonStr = "请求中";
                // button变为不可点击
                break;
            }
            case Constant.STATUS_REQUEST_SUCCESS: {
                topTextStr = "请在 ";
                secondStr = this.state.seconds;
                topEndStr = "秒内进行测量！";
                pressAction = this.endMeasure.bind(this);
                buttonStr = "测量结束";
                break;
            }
            default:
                break;
        }
        console.log('重新走', buttonStr);
        return (
            <View style={[commonStyles.main, commonStyles.wrapper, {backgroundColor: 'white'}]}>
                <NavigationBar
                    title="测量"
                    leftAction={this.onPressBack.bind(this)}/>
                <View style={styles.contentContainer}>

                    <Text style={styles.topText}>
                        {topTextStr}
                        <Text style={{fontSize: 30, color: this.state.themeColor}}>
                            {secondStr}
                        </Text>
                        <Text> {topEndStr}</Text>

                    </Text>

                    <Image style={{marginTop: 25}}
                           source={require('../imgs/icons/measure@3x.png')}/>
                </View>
                <View style={styles.bottomBar}>
                    <QNButton color={this.props.themeColor} title={buttonStr} onPress={pressAction}
                              underlayColor={this.props.themeColor}
                              activeOpacity={1}/>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    contentContainer: {
        flex: 1,
        alignItems: 'center'
    },

    topText: {
        fontSize: 20,
        marginTop: 100,
    },

    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }

});