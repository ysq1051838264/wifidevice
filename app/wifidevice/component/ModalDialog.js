/**
 * Created by ysq on 17/6/2.
 */


import React, {Component} from 'react';
import {
    Modal,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高

export default  class ModalDialog extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        dialogTitle: React.PropTypes.string,
        dialogContent: React.PropTypes.string, //内容
        dialogLeftBtnTitle: React.PropTypes.string,    //左按键标题
        dialogRightBtnTitle: React.PropTypes.string,   //右按键标题
        dialogLeftBtnAction: React.PropTypes.func.isRequired,  //左点击方法
        dialogRightBtnAction: React.PropTypes.func.isRequired, //右点击方法
        dialogVisible: React.PropTypes.bool,       //显示还是隐藏
    };

    static defaultProps = {
        dialogTitle: '温馨提示',
        dialogContent: '是否退出',
        dialogLeftBtnTitle: '取消',
        dialogRightBtnTitle: '确定',
        dialogVisible: false,
    };


    render() {
        return (
            <Modal
                visible={this.props.dialogVisible}
                transparent={true}
                onRequestClose={() => {
                }}>
                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        <View style={styles.dialogTitleView}>
                            <Text style={styles.dialogTitle}>
                                {this.props.dialogTitle}
                            </Text>
                        </View>
                        <View style={styles.dialogContentView}>
                            <Text style={styles.dialogContent}>
                                {this.props.dialogContent}
                            </Text>
                        </View>

                        <View style={styles.dialogBtnView}>
                            <TouchableHighlight style={styles.dialogBtnLeftViewItem}
                                                onPress={this.props.dialogLeftBtnAction}>
                                <Text style={styles.leftButton}>
                                    {this.props.dialogLeftBtnTitle}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={[styles.dialogBtnRightViewItem, {backgroundColor: 'blue'}]}
                                                onPress={this.props.dialogRightBtnAction}>
                                <Text style={styles.rightButton}>
                                    {this.props.dialogRightBtnTitle}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(52,52,52,0.5)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
    },

    dialog: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.28,
        backgroundColor: 'white',
        borderRadius: 8,
    },

    dialogTitleView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dialogTitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#999999',
        marginTop: 10
    },

    dialogContentView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dialogContent: {
        textAlign: 'center',
        fontSize: 16,
        color: '#4A4A4A',
    },

    dialogBtnView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.06,
        flexDirection: 'row',
    },

    dialogBtnViewItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dialogBtnLeftViewItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#999999'
    },

    dialogBtnRightViewItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 20,
    },

    leftButton: {
        fontSize: 18,
        color: 'black'
    },

    rightButton: {
        fontSize: 18,
        color: 'white'
    }
});