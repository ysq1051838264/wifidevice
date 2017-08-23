/**
 * Created by he on 2017/6/19.
 */
/**
 * Created by he on 17/4/1.
 */
import React, {Component} from 'React';

import {
    View,
    Text,
    Image,
    StyleSheet,
    NativeModules,
    ScrollView,
} from 'react-native';

var BindDeviceHelp = React.createClass({

    render(){
        return (
            <ScrollView style={{marginBottom: 10}} showsVerticalScrollIndicator={false} bounces={false}>
                <Text style={styles.titleStyle}>
                    扫描不到设备？
                </Text>

                <Text style={styles.secondTitleStyle}>
                    安卓设备
                </Text>

                <Text style={styles.textStyle}>
                    1. 确保蓝牙已经打开，秤放在手机附近，已安装上电池并且已
                    <Text style={styles.redText}>
                        亮屏
                    </Text>
                </Text>

                <Text style={styles.textStyle}>
                    2. 如果是安卓6.0的设备，请确定是否已经授予
                    <Text style={styles.redText}>
                        轻牛 定位权限
                    </Text>
                </Text>

                <Text style={styles.textStyle}>
                    3. 已经授予

                    <Text style={styles.redText}>
                        定位权限
                    </Text>

                    <Text style={styles.textStyle}>
                        却还是搜索不到，请打开
                    </Text>

                    <Text style={styles.redText}>
                        GPS
                    </Text>

                    <Text style={styles.textStyle}>
                        定位
                    </Text>
                </Text>


                <Text style={styles.secondTitleStyle}>
                    授予轻牛定位权限
                </Text>

                <Text style={styles.textStyle}>
                    1. 进入到
                    <Text style={styles.redText}>
                        设置
                    </Text>
                </Text>

                <Text style={styles.textStyle}>
                    2. 在设置中点击
                    <Text style={styles.redText}>
                        应用
                    </Text>
                </Text>

                <Text style={styles.textStyle}>
                    3. 在

                    <Text style={styles.redText}>
                        所有应用
                    </Text>

                    <Text style={styles.textStyle}>
                        中，找到
                    </Text>

                    <Text style={styles.redText}>
                        轻牛
                    </Text>

                    <Text style={styles.textStyle}>
                        ，点击进入到
                    </Text>

                    <Text style={styles.redText}>
                        应用信息
                    </Text>
                </Text>

                <Text style={styles.textStyle}>
                    4. 在
                    <Text style={styles.redText}>
                        应用信息
                    </Text>

                    <Text style={styles.textStyle}>
                        中找到
                    </Text>

                    <Text style={styles.redText}>
                        权限
                    </Text>

                    <Text style={styles.textStyle}>
                        ，点击进入到
                    </Text>


                    <Text style={styles.redText}>
                        应用访问授权
                    </Text>

                </Text>

                <Text style={styles.textStyle}>
                    5. 找到
                    <Text style={styles.redText}>
                        位置信息
                    </Text>

                    <Text style={styles.textStyle}>
                        ，并打开
                    </Text>
                </Text>

                <Text style={[styles.textStyle, {marginLeft: 15}]}>
                    不同的手机可能显示的名称不太一样，不过设置方法都大同小异
                </Text>




                <Image style={styles.imageStyle}
                       source={{uri: 'http://7vikuc.com1.z0.glb.clouddn.com/setting.jpg'}}>
                </Image>

                <Image style={styles.imageStyle}
                       source={{uri: 'http://7vikuc.com1.z0.glb.clouddn.com/all_app.jpg'}}>
                </Image>


                <Image style={styles.imageStyle}
                       source={{uri: 'http://7vikuc.com1.z0.glb.clouddn.com/app_detail.jpg '}}>
                </Image>

                <Image style={styles.imageStyle}
                       source={{uri: 'http://7vikuc.com1.z0.glb.clouddn.com/permission_setting.jpg'}}>
                </Image>

            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({


    titleStyle: {
        marginTop: 20,
        fontSize: 35,
        color: "#000000",
        textAlign: 'center',
    },

    secondTitleStyle: {
        marginTop: 30,
        fontSize: 25,
        color: "#999999",
        marginLeft: 10,
    },

    textStyle: {
        marginTop: 10,
        fontSize: 18,
        color: "#333333",
        marginLeft: 15,
        marginRight: 15,
    },

    redText: {
        color: "#B12A4B"
    },

    imageStyle: {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        width: 350,
        height: 640,
    },

});

module.exports = BindDeviceHelp;