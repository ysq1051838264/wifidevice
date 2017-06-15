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
import MeasureHttpClient from "../http/MeasureHttpClient";
import Spinner from 'react-native-spinkit';

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
            isWiFiFlag: this.props.isWiFiFlag
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
        const {navigator} = this.props;
        navigator.resetTo({
            component: WifiSetting,
            name: 'wifi_setting',
            params: {
                themeColor: this.state.themeColor,
                isHasWeightFlag: this.props.isHasWeightFlag
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

    fetchConfig() {
        MeasureHttpClient.personalCenter().then((data) => {
            this._next()
        }).catch(e => {
            this.setState({
                isWiFiFlag:false,
            });
        });
    }

    render() {
        var themeColor = this.state.themeColor;

        var wifiStatusView;
        var bottomView;

        if (this.state.isWiFiFlag) {
            this.fetchConfig()
            wifiStatusView = (
                <View style={styles.contentContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.topText}>正在测试网络是否正常</Text>
                        <View style={styles.wifiLogoContainer}>
                            <Icon name="ios-wifi" size={10 * PixelRatio.get()}/>
                        </View>
                    </View>

                    <View style={styles.wifiStatus}>
                        <View style={styles.wifiStatus}>
                            <Spinner size={100} type="Bounce" color={this.state.themeColor}
                                     isVisible={!this.state.isDialogVisible}/>
                        </View>
                    </View>
                </View>

            );
            bottomView = null
        } else {
            wifiStatusView = (<View style={styles.contentContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.topText}>首先，在您的手机上启动 Wifi</Text>
                    <View style={styles.wifiLogoContainer}>
                        <Icon name="ios-wifi" size={10 * PixelRatio.get()}/>
                    </View>
                </View>
                <View style={styles.wifiStatus}>
                </View>
            </View>);

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

                {wifiStatusView}

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
