import React, {
    Component,
} from 'react';

import  {
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    TouchableOpacity,
    PixelRatio,
    BackAndroid,
    NativeModules,
    Platform
} from 'react-native';

import NavigationBar from '../component/NavigationBar';
import QNButton from '../component/QNButton';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles from '../styles/common';
import WifiConfigFirst from './WifiConfigFirst';
import WifiConfigSecond from './WifiConfigSecond';
import WifiSetting from './WifiSetting';
import * as Storage from '../utils/Storage';

export default class main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isWiFiFlag: false,
            themeColor: '#0fbfef'
        }
    }

    componentWillMount() {
        this.setState({
            isWiFiFlag: this.props.isWiFiFlag,
        });
    }

    componentDidMount() {
        Storage.getThemeColor().then(ret => {
            if (ret != null) {
                console.log("打印themeColor:", ret.themecolor);
                this.setState({
                    themeColor: ret.themecolor,
                });
            }
        }).catch(e => {
            console.log(e);
        });
        //进入配网界面
        // this.goWifiConfig()
    }

    onPressBack() {
      if (Platform.OS == 'ios'){
        NativeModules.QNUI.popViewController();
      }else {
        BackAndroid.exitApp();
      }
    }

    goWifiConfigFirst() {
        const {navigator} = this.props;
        navigator.push({
            component: WifiConfigFirst,
            name: 'wifi_config_first',
            params: {
                themeColor: this.state.themeColor,
            }
        });
    }

    goWifiConfigSecond() {
        console.log("下一步:");
        const {navigator} = this.props;
        navigator.resetTo({
            component: WifiConfigSecond,
            name: 'wifi_config_second',
            params: {
                themeColor: this.state.themeColor,
            }
        });
    }

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

    render() {
        var bottomView;
        if (this.state.isWiFiFlag) {
            bottomView = (
                <QNButton title="下一步" onPress={this.goWifiConfigSecond()} color={this.state.themeColor}
                          style={{marginTop: 30}}/>)
        } else {
            bottomView = (
                <QNButton title="设置网络" onPress={this.goWifiConfigFirst.bind(this)} color={this.state.themeColor}
                          style={{marginTop: 30}}/>)
        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar
                    title="连接"
                    leftAction={this.onPressBack.bind(this)}/>
                <View style={styles.container}>
                    {bottomView}
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

