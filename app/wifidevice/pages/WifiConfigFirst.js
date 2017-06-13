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
    Platform,
    BackAndroid,
    PixelRatio,
    Image,
    NativeModules,
    TouchableOpacity,
    NativeAppEventEmitter,
} from 'react-native';

import commonStyles from '../styles/common';
import Icon from 'react-native-vector-icons/Ionicons';
import QNButton from '../component/QNButton';
import NavigationBar from '../component/NavigationBar';
import WifiSetting from './WifiSetting';

export default class WifiConfigFirst extends Component {
    constructor(props) {
        super(props);
        this.state = {
            themeColor: null,
            isWiFiFlag: false,
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        } else {
            NativeModules.SmartLinker.getWifiState().then(
            );
        }
        this.setState({
            themeColor: this.props.themeColor,
        });
    }

    componentDidMount() {
        subscriptions = NativeAppEventEmitter.addListener(
            'IOSWifiState',
            (data) => {
                this.setState({
                    isWiFiFlag: data.isWiFi,
                });
            }
        )
    }

    componentWillUnmount() {
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

    //安卓调用
    goWifiConfig() {
        console.log('调用原生wifi设置');
        NativeModules.ConnectWiFi.setWiFi().then(data => {
            if (data.isWiFi) {
                this.setState({
                    isWiFiFlag: data.isWiFi,
                });
            }
        });
    }

    _next() {
        console.log('进入wifi配网界面');
        const {navigator} = this.props;
        navigator.resetTo({
            component: WifiSetting,
            name: 'wifi_config_second',
            params: {
                themeColor: this.state.themeColor,
            }
        });
    }

    backOnPress() {
        if (Platform.OS == 'ios') {
            NativeModules.QNUI.popViewController();
        } else {
            BackAndroid.exitApp();
        }
    }

    render() {
        var themeColor = this.state.themeColor;

        var wifiStatusView;
        var bottomView;

        if (this.state.isWiFiFlag) {
            wifiStatusView = (
                <View style={styles.wifiStatus}>
                    <Image source={require('../imgs/icons/wifi_status_flag.png')}
                           style={{
                               backgroundColor: themeColor,
                               width: 60,
                               height: 60,
                           }}/>
                    <Text style={{color: themeColor, marginTop: 10}}> 完成</Text>
                </View>);
            bottomView = (<QNButton color={themeColor } title="下一步" onPress={this._next.bind(this)}/>)
        } else {
            wifiStatusView = null;

            if (Platform.OS == 'ios' && this.state.isWiFiFlag == false) {
                bottomView = (
                    <Image source={require('../imgs/icons/wifi_config_setIos.png')}/>
                )
            } else {
                bottomView = (<QNButton color={themeColor } title="设置网络" onPress={this.goWifiConfig.bind(this)}/>)
            }

        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper, {backgroundColor: 'white',}]}>
                <NavigationBar title="连接" leftAction={this.backOnPress.bind(this)}/>
                <View style={styles.contentContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.topText}> 首先，在您的手机上启动 Wifi</Text>
                        <View style={styles.wifiLogoContainer}>
                            <Icon name="ios-wifi" size={10 * PixelRatio.get()}/>
                        </View>
                    </View>

                    <View style={styles.wifiStatus}>
                        {wifiStatusView}
                    </View>
                </View>

                <View style={styles.bottomBar}>
                    {bottomView}
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
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
    },
    topContainer: {
        marginTop: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    wifiLogoContainer: {
        padding: 5,
        marginLeft: 40,
        borderWidth: 1,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    topText: {
        fontSize: 15,
        marginLeft: 20,
    },

    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    wifiStatus: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
