import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert, StatusBar } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

class BooleanQuestion extends React.Component {
    render() {
    
    return (
        <Grid>
        <Row>
            <Col style={styles.column}>
                <Button info style={this.props.buttonStyle0} onPress={()=>this.props.click(0)}>
                    <Text>{this.props.answers[0]}</Text>
                </Button>
            </Col>
            <Col style={styles.column}>
                <Button info style={this.props.buttonStyle1} onPress={()=>this.props.click(1)}>
                    <Text>{this.props.answers[1]}</Text>
                </Button>
            </Col>
        </Row>
        </Grid>
    );
}
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: "5%",
    },
    column: {
      height: 120,
      justifyContent: 'center',
      margin: "2%",
    },
    button: {
      height: 120,
      width: 120,
      justifyContent: 'center',
    }
  });

export default BooleanQuestion;

BooleanQuestion.propTypes = {
    answers: PropTypes.array,
    click: PropTypes.func,
    
}

    
          
    
