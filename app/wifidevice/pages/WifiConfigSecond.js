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
    ScrollView
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

        let modal = (<NetInfoModal show={this.state.show} navigator={this.props.navigator}   themeColor ={this.props.themeColor} />);
        let view = this.state.show ? modal : null;

        let imgWidth = screenWidth < 360 ? screenWidth : 360

        return (
            <View style={[commonStyles.main, commonStyles.wrapper,{  backgroundColor: 'white',}]}>
                <NavigationBar leftAction={this.backOnPress.bind(this)} title="连接"/>
                <ScrollView style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Image source={require('../imgs/icons/wifi_config_guide_bg.png')}
                               style={{resizeMode: Image.resizeMode.contain, width: imgWidth}}>
                            <Image source={require('../imgs/icons/wifi_config_guide_fg.png')}
                                   style={{
                                       tintColor: themeColor,
                                       resizeMode: Image.resizeMode.contain,
                                       width: imgWidth
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
        );

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
        fontSize: 20,
    },
    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

