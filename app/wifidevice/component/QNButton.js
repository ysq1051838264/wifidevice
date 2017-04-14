/**
 * Created by hdr on 17/2/20.
 */

import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

export default class QNButton extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        textColor: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
        onPress: PropTypes.func,
        fontSize: PropTypes.number,
        enable: PropTypes.bool,
        textStyle: Text.propTypes.style,
        btnStyle: TouchableHighlight.propTypes.style,
        underlayColor: PropTypes.string,
        activeOpacity: PropTypes.number,
    };

    static defaultProps = {
        height: 45,
        width: 300,
        fontSize: 16,
        enable: true,
    };

    constructor(props) {
        super(props);
        const buttonWidth = this.props.width;
        const buttonHeight = this.props.height;
        const buttonFontSize = this.props.fontSize;
        const enable = this.props.enable;
        const bgColor = this.props.color;
        const textColor = this.props.textColor;
        const disableColor = "#999";

        this.underlayColor = enable ? bgColor : disableColor;

        this.styles = StyleSheet.create({
            buttonBg: {
                width: buttonWidth,
                height: buttonHeight,
                borderRadius: buttonHeight / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: enable ? bgColor : disableColor,
            },
            buttonText: {
                backgroundColor: 'transparent',
                color: textColor ? textColor : 'white',
                fontSize: buttonFontSize,
            }
        });
    }

    render() {
        return (<TouchableHighlight
            underlayColor={this.props.underlayColor ? this.props.underlayColor : this.underlayColor + "88"}
            activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0.1}
            onPress={this.props.onPress}
            style={[this.styles.buttonBg, this.props.btnStyle]}>
            <Text style={[this.styles.buttonText, this.props.textStyle]}>{this.props.title}</Text>
        </TouchableHighlight>)
    }
}
