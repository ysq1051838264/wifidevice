/**
 * Created by ysq on 17/6/2.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Button,
    NetInfo,
    BackAndroid,
    TouchableHighlight,
    Platform,
    Alert,
    ToastAndroid,
    PixelRatio,
    NativeModules,
    AlertIOS,
} from 'react-native';

import NavigationBar from '../component/NavigationBar';
import QNButton from '../component/QNButton';
import ModalDialog from '../component/ModalDialog';
import EnterWeightView from './EnterWeightView';
import Spinner from 'react-native-spinkit';
import * as Constant from '../constant/constant';
import MeasureHttpClient from "../http/MeasureHttpClient";

var {SmartLinker, QNDeviceInfo} = NativeModules;

export default class WiFiPairView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDialogVisible: false,
            wifiName: '',
            wifiPassword: '',
            workState: Constant.STATE_SETTING_WIFI,
            device: {},
            themeColor: null
        };

        this.isDestrory = false
    }

    componentWillMount() {
        this.setState({
            themeColor: this.props.themeColor,
            wifiName: this.props.wifiName,
            wifiPassword: this.props.wifiPassword,
        });
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this.connectivityChange.bind(this));
    }

    componentWillUnmount() {
        this.isDestrory = true;
        NetInfo.isConnected.removeEventListener('change', this.connectivityChange.bind(this));
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.stopConfig();
        console.log("移除了")
    }

    onBackAndroid = () => {
        const nav = this.props.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            nav.pop();
            return true;
        }
        return false;
    };

    startConfig() {
        const {wifiName, wifiPassword} = this.state;
        console.log('配网wifi:', wifiName + "----" + wifiPassword);
        SmartLinker.startSetWifi(wifiName, wifiPassword)
            .then(device => {
                //拿到了 mac
                let mac = device.mac;
                mac = mac.substr(0, 2) + ':' + mac.substr(2, 2) + ':' + mac.substr(4, 2) + ':' + mac.substr(6, 2) + ':' + mac.substr(8, 2) + ':' + mac.substr(10, 2);
                device.mac = mac;
                console.log("拿到了 mac", mac);
                if (this.isDestrory) {
                    throw "Component is destroy"
                }
                return MeasureHttpClient.fetchScaleNameAndInternalModel(device);
            })
            .then((device) => {
                //已经拿到了 mac地址，设备名称，内部型号,以及所有设备信息
                console.log("打印device", device);
                if (this.isDestrory) {
                    throw "Component is destroy"
                }

                //如果有体重，则进入检测界面，否则需要去设置体重
                if (this.props.isHasWeightFlag) {
                    this.bindDevice(device);
                } else {
                    this.setState({
                        workState: Constant.STATE_GOT_MODEL,
                    });
                    this.toEnterWeight(device);
                }

            })
            .catch(e => {
                console.log('配网失败', e);
                if (this.isDestrory) {
                    return
                }
                this.setState({
                    device: {},
                    workState: Constant.STATE_FAIL,
                });
            })
    }


    resetStartConfig() {
        this.setState({
            device: {},
            workState: Constant.STATE_SETTING_WIFI,
        });
    }

    render() {
        var contentView;

        switch (this.state.workState) {
            case Constant.STATE_GOT_MODEL: {
                console.log('配网成功');
                this.stopConfig();
                contentView = null;
                break;
            }
            case Constant.STATE_SETTING_WIFI: {
                this.startConfig();
                contentView = (
                    <View style={styles.container}>
                        <View style={styles.contentContainer}>
                            <ModalDialog
                                dialogTitle={`当前网络: ${this.state.wifiName}`}
                                dialogThemeColor={this.state.themeColor}
                                dialogContent={this.state.wifiPassword}
                                dialogVisible={this.state.isDialogVisible}
                                dialogLeftBtnAction={() => {
                                    this.dialogCancel()
                                }}
                                dialogRightBtnAction={(wifiPwd) => {
                                    this.dialogConfirm(wifiPwd)
                                }}
                            />

                            <Text style={styles.topText}>正在将WiFi秤接入网络</Text>
                            <Text style={styles.tipText}>当前网络: {this.state.wifiName}</Text>
                            <TouchableHighlight style={[styles.btn, {borderColor: this.state.themeColor}]}
                                                onPress={this.showDialog.bind(this)}>
                                <Text style={[styles.btnText, {color: this.state.themeColor}]}>重新输入Wi-Fi密码</Text>
                            </TouchableHighlight>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Spinner size={100} type="Bounce" color={this.state.themeColor}
                                         isVisible={!this.state.isDialogVisible}/>
                            </View>
                        </View>
                    </View>
                );
                break;
            }

            case Constant.STATE_FAIL: {
                this.stopConfig();
                contentView = (
                    <View style={styles.container}>
                        <View style={[styles.contentContainer, {marginTop: 10}]}>
                            <ModalDialog
                                dialogTitle={`当前网络: ${this.state.wifiName}`}
                                dialogThemeColor={this.state.themeColor}
                                dialogContent={this.state.wifiPassword}
                                dialogVisible={this.state.isDialogVisible}
                                dialogLeftBtnAction={() => {
                                    this.dialogCancel()
                                }}
                                dialogRightBtnAction={(wifiPwd) => {
                                    this.dialogConfirm(wifiPwd)
                                }}
                            />
                            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                                <Text style={styles.topText}>配网失败</Text>
                                <Text style={styles.tipText}>当前网络: {this.state.wifiName}</Text>
                                <TouchableHighlight
                                    style={[styles.btn, {borderColor: this.state.themeColor, alignItems: 'center'}]}
                                    onPress={this.showDialog.bind(this)}>
                                    <Text style={[styles.btnText, {color: this.state.themeColor}]}>重新输入Wi-Fi密码</Text>
                                </TouchableHighlight>
                            </View>
                            <Text style={[styles.tipText, {marginTop: 40}]}>试试下面这些步骤</Text>
                            <Text style={styles.tipText}>1. 重新输入WiFi密码，确保密码正确</Text>
                            <Text style={styles.tipText}>2. 检查WiFi信号强度，确保WiFi连接状态良好</Text>
                            <Text style={styles.tipText}>3. 重新启动秤端配网模式，具体方法参考上一页面</Text>
                            <Text style={styles.tipText}>4. 确认WiFi允许陌生设备接入</Text>
                        </View>

                        <View style={styles.bottomBar}>
                            <QNButton color={this.state.themeColor} title="重新配网"
                                      onPress={ this.resetStartConfig.bind(this)}/>
                        </View>
                    </View>
                );
                break;
            }
        }

        return (
            <View style={styles.container}>
                <NavigationBar leftAction={this.backOnPress.bind(this)} title="连接"/>
                {contentView}
            </View>
        )
    }

    showDialog() {
        this.setState({isDialogVisible: true});
    }

    dialogCancel() {
        this.setState({
            isDialogVisible: false,
        });
    }

    dialogConfirm(wifiPwd) {
        this.setState({
            isDialogVisible: false,
            wifiPassword: wifiPwd,
            workState: Constant.STATE_SETTING_WIFI,
        });
    }

    backOnPress() {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            navigator.pop();
        } else {
            if (navigator) {
                if (Platform.OS == 'ios') {
                    NativeModules.QNUI.popViewController();
                } else {
                    BackAndroid.exitApp();
                }
            }
        }
    }

    bindDevice(data) {
        const {scale_name, internal_model, mac, scale_type, device_type} = data;

        MeasureHttpClient.bindDevice(scale_name, internal_model, mac, scale_type, device_type)
            .then((device) => {
                Platform.OS === 'android' ? ToastAndroid.show("绑定成功，请上秤", ToastAndroid.SHORT) : AlertIOS.alert("绑定成功，请上秤");
                if (Platform.OS === 'android') {
                    NativeModules.AynsMeasureModule.toMeasureView(scale_name, internal_model, mac, scale_type+"", device_type+"");
                } else {
                    NativeModules.QNUI.popTwoViewController();
                }
            })
            .catch(e => {
                console.log(e);
                Platform.OS === 'android' ? ToastAndroid.show(e.message, ToastAndroid.SHORT) : AlertIOS.alert(e.message);
                this.setState({
                    workState: Constant.STATE_FAIL,
                });
            })
    }

    stopConfig() {
        SmartLinker.stopSetWifi()
    }

    connectivityChange(status) {
        console.log("监听网络状态:", status);

        if (!status) {
            this.stopConfig();
            this.setState({
                device: {},
                workState: Constant.STATE_FAIL,
            });
        }
    }

    toEnterWeight(device) {
        const {navigator} = this.props;
        navigator.push({
            component: EnterWeightView,
            name: 'enter_weight',
            params: {
                data: device,
                themeColor: this.state.themeColor,
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    contentContainer: {
        flex: 1,
        marginTop: 20,
        backgroundColor: 'white',
        padding: 20,
    },

    tipText: {
        color: '#999999',
        fontSize: 16,
        marginTop: 10,
    },

    btn: {
        width: 200,
        height: 34,
        marginTop: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 20,
    },

    btnText: {
        height: 32,
        fontSize: 16,
        textAlignVertical: 'center',
    },

    topText: {
        color: 'black',
        fontSize: 18,
        marginTop: 20,
    },

    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }

});