/**
 * Created by ysq on 17/6/14.
 */

import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    requireNativeComponent,
    UIManager,
    View,
    Dimensions,
} from 'react-native';

let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高

var RulerView = requireNativeComponent(`RulerViewManager`,Ruler,{
    nativeOnly: {onChange: true}
});

class Ruler extends Component {
    constructor() {
        super();
        this._onChange = this._onChange.bind(this);
    }

    _onChange(event: Event) {
        if (!this.props.onScrollChange) {
            return;
        }
        this.props.onScrollChange(event.nativeEvent.message)
    }

    onSlide(){
        UIManager.dispatchViewManagerCommand();
    }

    render() {
        const {color} = this.props;
        return (<RulerView
            style={styles.rulerStyle}
            onChange={this._onChange}
            color={color}
        />);
    }
}

Ruler.propTypes = {
    color: PropTypes.number,
    text: PropTypes.string,
    onChangeMessage: React.PropTypes.func,
    ...View.propTypes,
};

const styles = StyleSheet.create({
    rulerStyle: {
        height: SCREEN_HEIGHT / 2,
        width: SCREEN_WIDTH
    }
});

module.exports = Ruler;