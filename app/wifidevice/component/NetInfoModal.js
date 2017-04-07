/**
 * Created by ysq on 17/3/28.
 */
import React, {Component, PropTypes} from 'react';

import {
    Text,
    View,
    Modal,
    StyleSheet,
    NativeModules,
    TouchableHighlight,
} from 'react-native';

export default class NetInfoModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
        };
    }

    static propTypes = {
        show: PropTypes.bool,
    };

    setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }

    setWifiConfig() {
        NativeModules.ConnectWiFi.setWiFi().then(data => {
            console.log("设置网络之后的传过来的wifi状态：", data.isWiFi);
            if (data.isWiFi) {
                let isShow = this.state.show;
                this.setState({
                    show: !isShow,
                });
            }
        });
    }

    render() {
        var showFlag
        if (this.state.show) {
            showFlag = false;
        } else {
            showFlag = this.props.show ? this.props.show : this.state.show;
        }

        let showMessage = "网络断开了,请检查网络状态";

        return (
            <View style={styles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={showFlag}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.modalStyle}>
                        <View style={styles.subView}>
                            <Text style={styles.titleText}>
                                温馨提示
                            </Text>
                            <Text style={styles.contentText}>
                                {showMessage}
                            </Text>
                            <View style={styles.horizontalLine}/>
                            <View style={styles.buttonView}>
                                <TouchableHighlight underlayColor='transparent'
                                                    style={styles.buttonStyle}
                                                    onPress={this.setModalVisible.bind(this)}>
                                    <Text style={styles.buttonText}>取消</Text>
                                </TouchableHighlight>
                                <View style={styles.verticalLine}/>
                                <TouchableHighlight underlayColor='transparent'
                                                    style={styles.buttonStyle}
                                                    onPress={this.setWifiConfig.bind(this)}>
                                    <Text style={styles.buttonText}>
                                        确定
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

var styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ECECF0',
    },

    modalStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
// modal上子View的样式
    subView: {
        marginLeft: 60,
        marginRight: 60,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    // 标题
    titleText: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // 内容
    contentText: {
        margin: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 5,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 竖直的分割线
    verticalLine: {
        width: 0.5,
        height: 44,
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        textAlign: 'center',
    },


});