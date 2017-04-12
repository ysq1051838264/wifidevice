import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    PixelRatio,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // leftTitle和leftImage 优先判断leftTitle (即 文本按钮和图片按钮优先显示文本按钮)
        const {title, leftTitle, leftImage, leftAction, rightTitle, rightImage, rightAction} = this.props;

        var scaleNum = PixelRatio.get();
        if (Platform.OS == 'ios' && scaleNum == 3) {
            scaleNum = 2;
        }

        return (
            <View style={styles.barView}>
                <View style={ styles.showView }>
                    {leftTitle ?
                        <TouchableOpacity style={styles.leftNav} onPress={ () => {
                            leftAction()
                        } }>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.barButton}>{leftTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        : (leftImage ?
                                <TouchableOpacity style={styles.leftNav} onPress={ () => {
                                    leftAction()
                                } }>
                                    <View style={{alignItems: 'center', width: 50}}>
                                        <Icon name={leftImage}
                                              size={13 * scaleNum} color='#B3B3B3'/>
                                    </View>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.leftImage} onPress={ () => {
                                    leftAction()
                                } }><View style={{alignItems: 'center', width: 30, justifyContent: 'center'}}>
                                    <Icon name={"ios-arrow-back"} size={13 * scaleNum} color='#B3B3B3'/>
                                </View>
                                </TouchableOpacity>
                        )}{
                    title ? <Text style={styles.title}>{title || ''}</Text> : null}{
                    rightTitle ? <TouchableOpacity style={styles.rightNav} onPress={ () => {
                            rightAction()
                        } }>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.barButton}>{rightTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        : (rightImage ?
                                <TouchableOpacity style={styles.rightNav} onPress={ () => {
                                    rightAction()
                                } }>
                                    <View style={{alignItems: 'center'}}>
                                        <Image source={ rightImage }/>
                                    </View>
                                </TouchableOpacity> : null
                        )}

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    barView: {
        height: Platform.OS === 'android' ? 45 : 64,
        flexDirection: 'row',
        borderBottomColor: '#B3B3B3',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        backgroundColor: 'white',
    },
    showView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: Platform.OS === 'android' ? 0 : 20,
        height: Platform.OS === 'android' ? 45 : 44,
    },
    title: {
        color: 'black',
        fontSize: 16.0,
    },
    leftNav: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        left: 8,
        justifyContent: 'center',
    },

    leftImage: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        left: 1,
        justifyContent: 'center',
    },
    rightNav: {
        position: 'absolute',
        right: 8,
        top: 8,
        bottom: 8,
        justifyContent: 'center',
    },
    barButton: {
        color: 'black',
        fontSize: 16
    },
});



