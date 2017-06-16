/**
 * Created by ysq on 17/6/2.
 */


import React, {Component} from 'react';
import {
    Modal,
    Text,
    StyleSheet,
    TextInput,
    Platform,
    TouchableHighlight,
    View,
    ScrollView,
} from 'react-native';

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高

export default  class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wifiPassword: this.props.dialogContent,
        }
    }

    static propTypes = {
        dialogTitle: React.PropTypes.string,
        dialogThemeColor: React.PropTypes.string,
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
        dialogThemeColor: 'blue',
    };

    render() {
        return (
            <Modal
                visible={this.props.dialogVisible}
                transparent={true}
                onRequestClose={() => {
                }}>
                <View style={styles.bg}>
                    <ScrollView ref="customScrollView">
                        <View style={styles.spaceView}/>
                    <View style={styles.dialog}>
                        <View style={styles.dialogTitleView}>
                            <Text style={styles.dialogTitle}>
                                {this.props.dialogTitle}
                            </Text>
                        </View>

                        <View style={styles.dialogContentView}>
                                <TextInput placeholder="请输入wifi密码" style={styles.dialogContent}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.props.dialogContent}
                                           autoFocus= {true}
                                           keyboardType = 'ascii-capable'
                                           onChangeText={(text) => {
                                             this.setState({wifiPassword: text})
                                           }}/>
                        </View>
                        <View style={styles.dialogBtnView}>
                            <TouchableHighlight style={styles.dialogBtnLeftViewItem}
                                                onPress={this.props.dialogLeftBtnAction}>
                                <Text style={styles.leftButton}>
                                    {this.props.dialogLeftBtnTitle}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[styles.dialogBtnRightViewItem, {backgroundColor: this.props.dialogThemeColor}]}
                                onPress={(text) => {
                                    this.props.dialogRightBtnAction(this.state.wifiPassword)
                                }}>
                                <Text style={styles.rightButton}>
                                    {this.props.dialogRightBtnTitle}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    </ScrollView>
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
  spaceView:{
    height: SCREEN_HEIGHT * 0.2,
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
        height: SCREEN_HEIGHT * 0.07,
        borderRadius: 8,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#999999',
        bottom: 10,
        marginTop: 17
    },

    dialogContent: {
        textAlign: 'left',
        fontSize: 16,
        color: '#4A4A4A',
        marginLeft: 5,
        height : SCREEN_HEIGHT * 0.07
    },

    dialogBtnView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.06,
        flexDirection: 'row',
        marginTop: 15
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
        borderColor: '#999999',
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