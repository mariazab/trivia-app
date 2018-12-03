import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from "expo";
import { commonStyle } from '../styles/commonStyle';
import {themeColors, opacity} from '../styles/themeVariables';

class BooleanQuestion extends React.Component {
    render() {
    
    return (
        <Content style={commonStyle.container}>
            <TouchableOpacity activeOpacity={opacity} style={commonStyle.button} onPress={()=>this.props.click(0)}>
                 <LinearGradient
                              colors={this.props.buttonStyle0}
                              style={{ width: "100%", padding: 15, alignItems: 'center', borderRadius: 5}}>
                                <Text style={commonStyle.buttonText}>{this.props.answers[0]}</Text>
                            </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={opacity} style={commonStyle.button} onPress={()=>this.props.click(1)}>
                <LinearGradient
                              colors={this.props.buttonStyle1}
                              style={{  width: "100%", padding: 15, alignItems: 'center', borderRadius: 5}}>
                                <Text style={commonStyle.buttonText}>{this.props.answers[1]}</Text>
                            </LinearGradient>
                </TouchableOpacity>
        </Content>
        );
    }
}

export default BooleanQuestion;

BooleanQuestion.propTypes = {
    answers: PropTypes.array,
    click: PropTypes.func,    
}