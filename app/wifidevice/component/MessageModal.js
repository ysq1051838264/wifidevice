/**
 * Created by ysq on 17/3/30.
 */
import React, {Component, PropTypes} from 'react';

import {
    Text,
    View,
    Modal,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

export default class MessageModal extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        show: PropTypes.bool,
    };

    render() {
        const showFlag = this.props.show;
        const {cancelOnPress, sureOnPress, message} = this.props;

        let showMessage = message !== null ? message : " 网络断开了,请检查网络状态";

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
                                                    onPress={() => {
                                                        cancelOnPress()
                                                    } }>
                                    <Text style={styles.buttonText}>取消</Text>
                                </TouchableHighlight>
                                <View style={styles.verticalLine}/>
                                <TouchableHighlight underlayColor='transparent'
                                                    style={styles.buttonStyle}
                                                    onPress={() => {
                                                        sureOnPress()
                                                    }}>
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