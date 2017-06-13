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
    ToastAndroid,
    PixelRatio,
    NativeModules,
    AlertIOS,
} from 'react-native';

import React, {
    Component
} from 'react';

import commonStyles from '../styles/common';
import Icon from 'react-native-vector-icons/Ionicons';
import QNButton from '../component/QNButton';
import NavigationBar from '../component/NavigationBar';
import WifiConfigSecond from './WifiConfigSecond';

var {SmartLinker, QNDeviceInfo} = NativeModules;

export default class WifiSetting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ssid: '',
            password: '',
            themeColor: null
        };
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

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this.connectivityChange.bind(this));
        SmartLinker.getWifiSSID()
            .then(ssid => {
                this.setState({
                    ssid: ssid
                })
            }).catch(e => {
                console.log("获取 ssid 出错", e);
            });
    }

    connectivityChange(status) {
        console.log("监听网络状态:", status);
    }

    startConfig() {
        //执行配网操作，调用本地化代码
        const {ssid, password, themeColor} = this.state;

        const {navigator} = this.props;
        navigator.push({
            component: WifiConfigSecond,
            name: 'Wifi_ConfigSecond',
            params: {
                themeColor: themeColor,
                wifiName: ssid,
                wifiPassword: password
            }
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

    render() {
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
                        <TextInput placeholder="请输入WiFi密码" style={styles.formFieldTextInput}
                                   underlineColorAndroid='transparent'
                                   defaultValue={this.state.password}
                                   secureTextEntry={true}
                                   onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.tipText}>1. 输入您的WiFi密码（未设置密码则无需密码）</Text>
                        <Text style={styles.tipText}>2. 点击“开始配网”，启动配网</Text>
                        <Text style={[styles.tipText, {marginTop: 25}]}>配网过程中，请保持WiFi连接状态</Text>
                    </View>
                </View>

                <View style={styles.bottomBar}>
                    <QNButton color={this.state.themeColor} title={"开始配网"} onPress={this.startConfig.bind(this)}/>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(244,244,244)',
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
        fontSize: 16,
        marginTop: 10,
    },
    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }
});



