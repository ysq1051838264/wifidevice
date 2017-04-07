/**
 * Created by hdr on 17/2/20.
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
    NetInfo,
    PixelRatio,
} from 'react-native';


import React, {
    Component
} from 'react';

import NavigationBar from "../component/NavigationBar";
import commonStyles from '../styles/common';
import QNButton from '../component/QNButton';
import MessageModal from '../component/MessageModal';

export default class BindSuccess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            themeColor: null
        }
    }

    componentWillMount() {
        NetInfo.isConnected.addEventListener("change", this.connectivityChange.bind(this));
        this.setState({
            themeColor: this.props.themeColor,
        });
    }

    goHome() {
        NativeModules.AynsMeasureModule.aynsMeasure()
            .then(data => {
                BackAndroid.exitApp();
            })
            .catch(e => {
                console.log(e.message)
            });
        // BackAndroid.exitApp()
    }

    componentWillUnMount() {
        NetInfo.isConnected.removeEventListener("change", this.connectivityChange.bind(this));
    }

    connectivityChange(status) {

    }

    render() {
        const {themeColor} = this.state.themeColor;

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title="绑定成功" leftAction={this.goHome.bind(this)}/>
                <View style={styles.topContainer}>
                    <Text style={{fontSize: 16}}>恭喜您，已经成功设置了WiFi秤</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 23}}>还差最后一步,</Text>
                    <Text style={{fontSize: 23, marginTop: 10}}>请上秤<Text
                        style={{fontSize: 30, color: themeColor}}>测量</Text>一次</Text>
                    <Image style={{marginTop: 30}} source={require('../imgs/icons/measure.png')}/>
                </View>
                <View style={styles.bottomBar}>
                    <QNButton color={this.state.themeColor} title="测量完成" onPress={this.goHome.bind(this)}/>
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
    }
});
