import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

var ScreenWidth = 320;
var QRCode = require('react-native-qrcode');

var ReportCorderView = React.createClass({

    render() {
        return (
            <View>
                {this.renderBottomView()}
            </View>
        );
    },

    renderBottomView() {
        if (this.props.showCode.showCodeFlag == 1) {
            console.log('进入');
            return (<Image source={require('../imgs/report_bottom_bg.png')} style={styles.bottomBgView}>
                <View style={styles.bottombgContainer}>
                    <Image source={require('../imgs/qr_code_tmall@3x.png')}
                           style={{marginLeft: 20}}>
                    </Image>
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.bottomText}>云康宝智能设备</Text>
                        <Text style={styles.bottomBuyText}>购买链接，扫描二维码进入购买页面</Text>
                    </View>
                </View>
            </Image>)
        } else if (this.props.showCode.showCodeFlag == 2) {
            return (
                <Image source={require('../imgs/report_bottom_bg@3x.png')} style={styles.bottomBgView}>
                    <View style={styles.bottombgContainer}>
                        <View style={{marginLeft: 20, alignItems: 'center'}}>
                            <QRCode
                                value={this.props.showCode.brandUrl}
                                size={40}
                                bgColor='black'
                                fgColor='white'/>
                        </View>
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.bottomBrandText}>{this.props.showCode.brand}</Text>
                            <Text style={styles.bottomText}>{this.props.showCode.companyName}</Text>
                        </View>
                    </View>
                </Image>)
        } else {
            return (<Image source={require('../imgs/report_bottom_bg.png')} style={styles.bottom}></Image>)
        }
    }
});


const styles = StyleSheet.create({
    bottomBgView: {
        width: ScreenWidth,
        height: 50,
        marginTop: 5,
    },
    bottombgContainer: {
        flexDirection: 'row',
        width: ScreenWidth,
        height: 50,
        alignItems: 'center',
    },
    bottomTextContainer: {
        height: 42,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    bottomText: {
        color: "#666666",
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    bottomBrandText: {
        color: "#666666",
        fontSize: 12,
        backgroundColor: 'transparent',
    },
});

module.exports = ReportCorderView;

