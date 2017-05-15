/**
 * Created by hdr on 17/2/20.
 */

import React, {
    Component,
} from 'react';

import  {
    StyleSheet,
    Text,
    View,
    Image,
    BackAndroid,
    Platform,
    NetInfo,
    PixelRatio,
    TouchableOpacity,
    NativeModules,
    ScrollView,
} from 'react-native';

import commonStyles from '../styles/common';
import QNButton from '../component/QNButton';
import NavigationBar from '../component/NavigationBar';
import WifiConfig from './WifiSetting';
import NetInfoModal from '../component/NetInfoModal';
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

export default class WifiConfigSecond extends Component {
    constructor(props) {
        super(props);

        this.state = {
            themeColor: null,
            show: false,
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

        NetInfo.isConnected.addEventListener('change', this.connectivity.bind(this));

        this.setState({
            themeColor: this.props.themeColor,
        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this.connectivity.bind(this));

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

    connectivity(status) {
        console.log("监听网络状态:", status);

        if (!status) {

            this.setState({
                show: true
            });
            // Alert.alert("温馨提示", "网络已断开，请检查网络");
        }
    }

    jumpBleDevice() {
        if (Platform.OS == 'ios') {

        } else {
            NativeModules.QNUI.toBleDeviceView();
        }

    }

    _next() {
        const {navigator} = this.props;
        navigator.push({
            component: WifiConfig,
            name: 'wifi_config',
            params: {
                themeColor: this.state.themeColor,
            }
        });
    }

    render() {
        var themeColor = this.state.themeColor;

        let modal = (
            <NetInfoModal show={this.state.show} navigator={this.props.navigator} themeColor={this.props.themeColor}/>);
        let view = this.state.show ? modal : null;

        let imgWidth = screenWidth < 360 ? screenWidth : 360

        return (
            <View style={[commonStyles.main, commonStyles.wrapper, {backgroundColor: 'white',}]}>
                <NavigationBar leftAction={this.backOnPress.bind(this)} title="连接"/>
                <ScrollView style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.topText}> 1. 打开电池后盖, 长按黑色按钮3秒。</Text>
                        <TouchableOpacity  activeOpacity={1} onPress={this.jumpBleDevice.bind(this)}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.tipText}> 找不到黑色按钮？试试</Text>
                                <Text style={[styles.tipText, {color: themeColor}]}> 蓝牙设备</Text>
                            </View>
                        </TouchableOpacity>
                        <Image source={require('../imgs/icons/wifi_config_guide_open_bg@3x.png')}
                               style={{resizeMode: Image.resizeMode.contain, marginTop: 5}}>
                            <Image source={require('../imgs/icons/wifi_config_guide_open_fg@3x.png')}
                                   style={{
                                       tintColor: themeColor,
                                       resizeMode: Image.resizeMode.contain,
                                   }}/>
                        </Image>

                        <Text style={styles.topText}>2. WiFi标志闪动,表示进入到了配网模式</Text>

                        <Image source={require('../imgs/icons/wifi_config_guide_flash_bg@3x.png')}
                               style={{resizeMode: Image.resizeMode.contain}}>
                            <Image source={require('../imgs/icons/wifi_config_guide_flash_fg@3x.png')}
                                   style={{
                                       tintColor: themeColor,
                                       resizeMode: Image.resizeMode.contain,
                                   }}/>
                        </Image>
                    </View>

                </ScrollView>
                <View style={styles.bottomBar}>
                    <QNButton color={themeColor} title="下一步" onPress={this._next.bind(this)}/>
                </View>

                <View style={{justifyContent: 'center', alignItems: 'center',}}>
                    {view}
                </View>
            </View>
        )
            ;

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

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    tipText: {
        color: '#999',
        fontSize: 15,
        marginTop: 5,
    },

    topText: {
        color: 'black',
        fontSize: 17,
        marginTop: 10,
    },


    contentContainer: {
        flex: 1,
    },
    topContainer: {
        marginTop: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    wifiLogoContainer: {
        padding: 5,
        marginLeft: 40,
        borderWidth: 1,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },

    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

