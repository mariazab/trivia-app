import React from 'react';
import { StyleSheet, View, Alert, StatusBar} from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body, Form, Item, Input, Label, List, ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as firebase from 'firebase';
import {firebaseInitApp} from '../database/firebase-config';

const firebaseApp = firebaseInitApp;

export default class EndGame extends React.Component {

  static navigationOptions = {title: "End"};

  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref('scores');
    this.state = {points: 0, nickname: "", data: []};
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    this.setState({points: params.points});
    this.getData(this.itemsRef);
  }

  //Get the data from the database
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
      //console.log(sortedData.slice(0, 3));
      this.setState({data: sortedData.slice(0, 3)});
     
    });
  }

  //Sorting highscores by points, descending
  sortHighscores(items) {
    const sortedData = (items).sort(function(player1, player2) {
      return player2.points - player1.points;
    });
    return sortedData;
  }

  //Saving the score to the database
  saveScore = () => {
    //console.log("Saving to database...");
    //console.log("Values.." + this.state.points + " " + this.state.nickname);
    this.itemsRef.push({ player: this.state.nickname, points: this.state.points});
    //TODO: show to the user it was saved
    this.setState({nickname: ""});

  };

  render() {
    const { navigate } = this.props.navigation;
    let index = 1;

    return (

      <Container>
      {/* <StatusBar hidden={true} /> */}
        <Content style={styles.container}>
          
          <Text>The end!</Text>
         
          <Text>Points: {this.state.points}</Text>
          
          
          <Form style={styles.form}>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input onChangeText={(nickname) => this.setState({nickname})} value={this.state.nickname}/>
            </Item>
          </Form>
          <Button info block style={styles.button} onPress={this.saveScore}>
            <Text>Save score</Text>
          </Button>
         
          <Button info block style={styles.button} onPress={()=>navigate('Home')}>
            <Text>Back to main screen</Text>
          </Button>

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

