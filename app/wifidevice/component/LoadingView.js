/**
 * Created by ysq on 17/3/31.
 */

import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
} from 'react-native';

export default class LoadingView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    static propTypes = {
        animateFlag: PropTypes.bool,
    }

    render() {
        var flag = this.props.animateFlag ? this.props.animateFlag : false;
        return (<View style={styles.loading}>
            <ActivityIndicator
                style={styles.centering}
                animating={flag}
                size="large"
                color="#3e9ce9"/>
        </View>);
    }

}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        height: 80
    },
});