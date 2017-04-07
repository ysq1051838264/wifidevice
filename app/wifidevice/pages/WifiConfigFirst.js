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
    NativeModules,
    TouchableOpacity,
} from 'react-native';

import commonStyles from '../styles/common';
import Icon from 'react-native-vector-icons/Ionicons';
import QNButton from '../component/QNButton';
import NavigationBar from '../component/NavigationBar';
import * as Storage from '../utils/Storage';
import WifiConfigSecond from './WifiConfigSecond';

export default class WifiConfigFirst extends Component {
    constructor(props) {
        super(props);
        this.state = {
            themeColor: null,
            isWiFiFlag: false
        }
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

    goWifiConfig() {
        NativeModules.ConnectWiFi.setWiFi().then(data => {
            console.log("设置网络之后的传过来的wifi状态：", data.isWiFi)
            if (data.isWiFi) {
                this.setState({
                    isWiFiFlag: data.isWiFi,
                });
            }
        });
    }

    _next() {
        const {navigator} = this.props;
        navigator.push({
            component: WifiConfigSecond,
            name: 'wifi_config_second',
            params: {
                themeColor: this.state.themeColor,
            }
        });
    }

    backOnPress() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        var themeColor = this.state.themeColor;

        var bottomView;
        if (this.state.isWiFiFlag) {
            bottomView = (
                <QNButton color={themeColor } title="下一步" onPress={this._next.bind(this)}/>)
        } else {
            bottomView = (
                <QNButton color={themeColor } title="下一步" onPress={this.goWifiConfig.bind(this)}/>)
        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title="连接" leftAction={this.backOnPress.bind(this)}/>
                <View style={styles.contentContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.topText}> 首先，在您的手机上启动 Wifi</Text>
                        <View style={styles.wifiLogoContainer}>
                            <Icon name="ios-wifi" size={10 * PixelRatio.get()}/>
                        </View>
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
        backgroundColor: '#F5FCFF',
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

    topText: {
        fontSize: 15,
        marginLeft: 20,
    },
    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
