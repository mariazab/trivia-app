import React from 'react';
import { StyleSheet, View, Alert, StatusBar,  ActivityIndicator } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body, Form, Item, Input, Label, List, ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as firebase from 'firebase';
import {firebaseInitApp} from '../database/firebase-config';
import { AppLoading } from "expo";

const firebaseApp = firebaseInitApp;

export default class Highscores extends React.Component {

  static navigationOptions = {title: "Highscores"};

  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref('scores');
    this.state = {data: [], loading: true};
  }


  //Get data from the database
  getData(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          player: child.val().player,
          points: child.val().points,
        });
      });

      const sortedData = this.sortHighscores(items);
      //console.log(sortedData);
      this.setState({data: sortedData, loading: false});
     
    });
  }

  //Sorting highscores by points, descending
  sortHighscores(items) {
    const sortedData = (items).sort(function(player1, player2) {
      return player2.points - player1.points;
    });
    return sortedData;
  }


  componentDidMount() {
    this.getData(this.itemsRef);
  }


  render() {
    const { navigate } = this.props.navigation;
    let index = 1;

    if (this.state.loading) {
      return <View style={styles.loadingView}>
        <Text>Loading highscores</Text>
        <ActivityIndicator size="large" color="#ffffff" />
        </View>;}
    return (
      
      <Container>
      {/* <StatusBar hidden={true} /> */}
        <Content style={styles.container}>
          
          <Text>Highscores</Text>

          <List>
            <ListItem itemHeader>
              <Col>
                <Text>POSITION</Text>
              </Col>
              <Col>
                <Text>PLAYER</Text>
              </Col>
              <Col>
                <Text>POINTS</Text>
              </Col>
            </ListItem>
          </List>

          <List dataArray={this.state.data}
            renderRow={(item) =>
              <ListItem>
                <Col>
                  <Text>{index++}</Text>
                </Col>
                <Col>
                  <Text>{item.player}</Text>
                </Col>
                <Col>
                  <Text>{item.points}</Text>
                </Col>
              </ListItem>}>          
            </List>
        </Content>
   </Container>

    );
  }

}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10
  },
  container: {
   margin: "2%",
  },
  column: {
    height: 120,
    justifyContent: 'center',
    margin: "2%",
  },
  form: {
    margin: "2%",
  },
  button: {
    margin: 10,
  }
});