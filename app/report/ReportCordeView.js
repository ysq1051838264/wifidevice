
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

var ScreenWidth = 320;

var ReportCorderView = React.createClass({

  render() {
      console.log('进入ReportCorderView');
    return (
      <View>
        {this.renderBottomView()}
      </View>
    );
  },

  renderBottomView() {
    if (this.props.isShareFlag) {
      console.log('进入');
      return (<Image source={require('../imgs/report_bottom_bg.png')} style={styles.bottomBgView}>
        <View style={[styles.bottombgContainer, {backgroundColor: this.props.themeColor + "b2"}]}>
          <Image source={require('../imgs/qr_code_tmall.png')}
                 style={{marginLeft: 20}}>
          </Image>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>云康宝智能设备</Text>
            <Text style={styles.bottomBuyText}>购买链接，扫描二维码进入购买页面</Text>
          </View>
        </View>
      </Image>)
    } else {
      return (<Image source={require('../imgs/report_bottom_bg.png')} style={styles.bottom}></Image>)
    }
  }
})



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
    height: 35,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  bottomText: {
    color: "white",
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  bottomBuyText: {
    color: "white",
    fontSize: 9,
    backgroundColor: 'transparent',
  },
});

module.exports = ReportCorderView;

