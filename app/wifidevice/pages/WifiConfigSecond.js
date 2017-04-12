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
} from 'react-native';

import commonStyles from '../styles/common';
import QNButton from '../component/QNButton';
import NavigationBar from '../component/NavigationBar';
import WifiConfig from './WifiSetting';
import NetInfoModal from '../component/NetInfoModal';


export default class WifiConfigSecond extends Component {
    constructor(props) {
        super(props);

        this.state = {
            themeColor: null,
            show: false,
            mainFlag:false,
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

        let modal = (<NetInfoModal show={this.state.show}/>);
        let view = this.state.show ? modal : null;

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar leftAction={this.backOnPress.bind(this)} title="连接"/>
                <View style={styles.contentContainer}>
                    <Image source={require('../imgs/icons/wifi_config_guide_bg.png')}>
                        <Image source={require('../imgs/icons/wifi_config_guide_fg.png')}
                               style={{tintColor: themeColor}}/>
                    </Image>
                </View>

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
        const nav = this.props.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            nav.pop();
        }else {
            BackAndroid.exitApp();
        }
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
        alignItems: 'center'
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

