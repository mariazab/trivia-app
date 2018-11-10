import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert, StatusBar } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

class MultipleQuestion extends React.Component {
    render() {
    return (
        <Grid>
        <Row>
            <Col style={styles.column}>
                <Button info style={this.props.buttonStyle0} onPress={()=>this.props.click(0)} >
                    <Text>{this.props.answers[0]}</Text>
                </Button>
            </Col>
            <Col style={styles.column}>
                <Button info style={this.props.buttonStyle1} onPress={()=>this.props.click(1)}>
                    <Text>{this.props.answers[1]}</Text>
                </Button>
            </Col>
        </Row>
        <Row>
            <Col style={styles.column}>
                <Button info style={this.props.buttonStyle2} onPress={()=>this.props.click(2)}>
                    <Text>{this.props.answers[2]}</Text>
                </Button>
            </Col>
            <Col style={styles.column}>
                <Button info style={this.props.buttonStyle3} onPress={()=>this.props.click(3)}>
                    <Text>{this.props.answers[3]}</Text>
                </Button>
            </Col>
        </Row>
        </Grid>
    );
}
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    //alignItems: 'center',
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

export default MultipleQuestion;

MultipleQuestion.propTypes = {
    answers: PropTypes.array,
    click: PropTypes.func,
}

    
          
    
