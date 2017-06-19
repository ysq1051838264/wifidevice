/**
 * Created by ysq on 17/6/14.
 */

import  {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    BackAndroid,
    NativeModules,
    Image,
    ToastAndroid,
    NetInfo,
    PixelRatio,
    Platform,
    Dimensions,
    ScrollView,
    AlertIOS
} from 'react-native';

import React, {
    Component
} from 'react';

import NavigationBar from "../component/NavigationBar";
import commonStyles from '../styles/common';
import QNButton from '../component/QNButton';
import MeasureHttpClient from "../http/MeasureHttpClient";

var RulerView = require('../component/RulerView');
var IOSRulerView = require('../component/IOSRulerView');


var currentWeight = 60;

export default class EnterWeightView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            themeColor: null,
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

    componentWillUnMount() {
        this.isDestrory = true;
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    goHome() {
        if (Platform.OS == 'ios') {
            NativeModules.SmartLinker.anysMesasure(this.props.mac)
                .then(data => {
                    NativeModules.QNUI.popViewController();
                })
                .catch(e => {
                    console.log(e.message)
                });
        } else {
            BackAndroid.exitApp();
        }
    }

    onBackAndroid = () => {
        BackAndroid.exitApp();
        return false;
    };

    checkData() {
        const {scale_name, internal_model, mac, scale_type, device_type} = this.props.data;

        if (!this.isDestrory)
            MeasureHttpClient.bindDevice(scale_name, internal_model, mac, scale_type, device_type)
                .then((device) => {
                    MeasureHttpClient.saveWeight(currentWeight).then(() => {
                        console.log("保存体重，获取到了数据：" + scale_name + " " + internal_model + " " + mac + " " + scale_type + " " + device_type);
                        Platform.OS === 'android' ? ToastAndroid.show("绑定成功，请上秤", ToastAndroid.SHORT) : AlertIOS.alert(
                                '',
                                '绑定成功，请上秤',
                                [{text: '好', onPress: () => NativeModules.QNUI.popTwoViewController()},]
                            );
                        if (Platform.OS === 'android') {
                            NativeModules.AynsMeasureModule.toMeasureView(scale_name, internal_model, mac, scale_type + "", device_type + "");
                        }
                    })
                }).catch(e => {
                Platform.OS === 'android' ? ToastAndroid.show("网络不给力，请重试", ToastAndroid.SHORT) : AlertIOS.alert("网络不给力，请重试");
            });

    }

    render() {
        const themeColor = this.props.themeColor;

        console.log("ysq", this.props.themeColor);

        var ruler;
        if (Platform.OS === 'android') {
            ruler = (
                <RulerView style={styles.rulerView}
                           color={themeColor}
                           onScrollChange={(event) => this.onWebViewScroll(event)}></RulerView>);
        } else {
            ruler = (<IOSRulerView style={styles.IOSrulerView}
                                   onChange={(event) => this.onWebViewScroll(event)}></IOSRulerView>)
        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title="初始化体重" leftAction={this.goHome.bind(this)}/>
                <View style={styles.topContainer}>
                    <Text style={{fontSize: 18, color: 'black'}}>还差最后一步</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 16, marginTop: 10, color: 'black'}}>体重</Text>
                    {ruler}
                </View>
                <View style={styles.bottomBar}>
                    <QNButton color={this.state.themeColor} title="确认" onPress={this.checkData.bind(this)}/>
                </View>
            </View>
        );
    }

    onWebViewScroll(event) {
        console.log("当前体重：", event);
        currentWeight = event;
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: "center",
    },
    topContainer: {
        height: 80,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: "center",
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
        backgroundColor: '#ccc',
    },
    formFieldTextInput: {
        width: 200,
        height: 40,
        marginLeft: 10,
    },
    tipText: {
        color: '#999',
        fontSize: 14,
    },
    bottomBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rulerView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        marginTop: 20
    },
    IOSrulerView: {
        height: 200,
        width: Dimensions.get('window').width,
    }
});