/**
 * Created by hdr on 17/2/20.
 */

import  {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    NetInfo,
    BackAndroid,
    Platform,
    Alert,
    PixelRatio,
    NativeModules,
} from 'react-native';

import React, {
    Component
} from 'react';

import commonStyles from '../styles/common';
import Icon from 'react-native-vector-icons/Ionicons';
import QNButton from '../component/QNButton';
import NavigationBar from '../component/NavigationBar';
import BindSuccess from './BindSuccess';
import Spinner from 'react-native-spinkit';
import * as Constant from '../constant/constant';
import MeasureHttpClient from "../http/MeasureHttpClient";

var {SmartLinker, QNDeviceInfo} = NativeModules;

export default class WifiSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ssid: '',
            password: '',
            workState: Constant.STATE_IDLE,
            device: {},
            themeColor: null
        }
        this.isDestrory = false
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.setState({
            themeColor: this.props.themeColor,
        });
    }

    componentWillUnmount() {
        this.isDestrory = true;
        NetInfo.isConnected.removeEventListener('change', this.connectivityChange.bind(this));
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
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

    toBindSuccess() {
        const {navigator} = this.props;
        navigator.push({
            component: BindSuccess,
            name: 'bind_success',
            params: {
                themeColor: this.state.themeColor,
            }
        });
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this.connectivityChange.bind(this));
        var ssid = SmartLinker.getWifiSSID()
            .then(ssid => {
                console.log("wifi:", ssid);
                this.setState({
                    ssid: ssid
                })
            }).catch(e => {
                console.log("获取 ssid 出错", e);
            });
    }

    connectivityChange(status) {
        console.log("监听网络状态:", status);

        if (!status) {
            // Alert.alert("温馨提示", "网络已断开，请检查网络");
            this.stopConfig();
            this.setState({
                device: {},
                workState: Constant.STATE_FAIL,
            });
        }
    }


    startConfig() {
        //执行配网操作，调用本地化代码
        const {ssid, password} = this.state;

        console.log("开启配网的wifi和密码" + ssid + "   " + password)

        this.setState({
            device: {},
            workState: Constant.STATE_SETTING_WIFI,
        });

        SmartLinker.startSetWifi(ssid, password)
            .then(device => {
                //拿到了 mac
                var mac = device.mac;
                mac = mac.substr(0, 2) + ':' + mac.substr(2, 2) + ':' + mac.substr(4, 2) + ':' + mac.substr(6, 2) + ':' + mac.substr(8, 2) + ':' + mac.substr(10, 2);
                device.mac = mac;
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
                this.setState({
                    device: device,
                    workState: Constant.STATE_GOT_MODEL
                })
            })
            .catch(e => {
                console.log(e)
                if (this.isDestrory) {
                    return
                }
                this.stopConfig();
                this.setState({
                    device: {},
                    workState: Constant.STATE_FAIL,
                });
            })
    }

    stopConfig() {
        SmartLinker.stopSetWifi()
    }

    bindDevice() {
        const {scale_name, internal_model, mac, scale_type, device_type} = this.state.device;
        this.setState({
            workState: Constant.STATE_BINDING
        });
        MeasureHttpClient.bindDevice(scale_name, internal_model, mac, scale_type, device_type)
            .then((device) => {
                console.log("绑定成功并打印device", device);
                this.toBindSuccess();
            })
            .catch(e => {
                console.log(e)
                this.setState({
                    workState: Constant.STATE_GOT_MODEL,
                });
            })
    }

    backOnPress() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        var contentView, pressAction, buttonTitle;

        switch (this.state.workState) {
            case Constant.STATE_IDLE: {
                contentView = (
                    <View style={styles.contentContainer}>
                        <Text style={styles.tipText}>1. 输入您的wifi密码（未设置密码则无需密码）</Text>
                        <Text style={styles.tipText}>2. 点击“开始配网”，启动配网</Text>
                        <Text style={[styles.tipText, {marginTop: 25}]}>配网过程中，请保持wifi连接状态</Text>
                    </View>
                );
                pressAction = this.startConfig;
                buttonTitle = "开始配网";
                break;
            }

            case Constant.STATE_SETTING_WIFI: {
                contentView = (
                    <View style={[styles.contentContainer, {alignItems: 'center'}]}>
                        <Text style={styles.tipText}>设置网络可能需要 20s 左右，请耐心等待...</Text>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Spinner size={100} type="Bounce" color={this.state.themeColor}/>
                        </View>
                    </View>
                );
                pressAction = this.stopConfig;
                buttonTitle = "取消";
                break;
            }
            case Constant.STATE_FAIL: {
                contentView = (
                    <View style={styles.contentContainer}>
                        <Text style={styles.tipText}>配网失败，试试下面这些步骤</Text>
                        <Text style={[styles.tipText, {marginTop: 20}]}>1. 重新输入WiFi密码，确保密码正确</Text>
                        <Text style={styles.tipText}>2. 检查wifi信号强度，确保wifi连接状态良好</Text>
                        <Text style={styles.tipText}>3. 重新启动秤端配网模式，具体方法参考上一页面</Text>
                        <Text style={styles.tipText}>4. 确认Wifi允许陌生设备接入</Text>
                    </View>
                );
                pressAction = this.startConfig;
                buttonTitle = "重新配网";
                break;
            }
            case Constant.STATE_GOT_MODEL: {
                contentView = (
                    <View style={[styles.contentContainer, {alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={styles.tipText}>搜索结果</Text>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={{uri: this.state.device.brand_info.logo_ico}}
                                   resizeMode={Image.resizeMode.contain} style={{width: 120, height: 30}}/>
                            <Text style={{fontSize: 20}}>{this.state.device.model}</Text>
                        </View>
                    </View>
                );
                pressAction = this.bindDevice;
                buttonTitle = "马上绑定";
                break;
            }
            case Constant.STATE_BINDING: {
                contentView = (
                    <View style={[styles.contentContainer, {alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={styles.tipText}>搜索结果</Text>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', bottom: 20}}>
                            <Text style={{fontSize: 20}}>{this.state.device.model}</Text>
                        </View>
                        <Spinner size={40} type="Wave" color={this.state.themeColor}/>
                    </View>
                );
                pressAction = () => {
                };
                buttonTitle = "正在绑定...";
                break;
            }
        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title="连接" leftAction={this.backOnPress.bind(this)}/>
                <View style={styles.topContainer}>
                    <View style={styles.formFieldContainer}>
                        <Icon name="ios-wifi" size={8 * PixelRatio.get()}/>
                        <Text style={styles.formFieldText}>{this.state.ssid}</Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.formFieldContainer}>
                        <Icon name="ios-lock-outline" size={8 * PixelRatio.get()}/>
                        <TextInput placeholder="请输入wifi密码" style={styles.formFieldTextInput}
                                   underlineColorAndroid='transparent'
                                   defaultValue={this.state.password}
                                   onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                </View>
                {contentView}
                <View style={styles.bottomBar}>
                    <QNButton color={this.state.themeColor} title={buttonTitle} onPress={pressAction.bind(this)}/>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    contentContainer: {
        flex: 1,
        marginTop: 20,
        backgroundColor: 'white',
        padding: 20,
    },
    topContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    formFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        height: 50,
    },
    formFieldText: {
        fontSize: 18,
        marginLeft: 10,
    },
    divider: {
        height: 1,
        width: 300,
        backgroundColor: '#ccc',
    },
    formFieldTextInput: {
        width: 200,
        height: 40,
        marginLeft: 10,
    },
    tipText: {
        color: '#999',
        fontSize: 17,
        marginTop: 10,
    },
    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }
});



