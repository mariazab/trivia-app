import React from 'react';
import { StyleSheet, StatusBar} from 'react-native';
import { Container, Content, Button, Text, Form, Item, Input, Label, List, ListItem, Toast, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as firebase from 'firebase';
import {firebaseInitApp} from '../database/firebase-config';
import { commonStyle } from '../styles/commonStyle';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

const firebaseApp = firebaseInitApp;

export default class EndGame extends React.Component {

  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref('scores');
    this.state = {points: 0, nickname: "", topThree: [], data: [], existingPlayerId: ""};
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
      this.setState({topThree: sortedData.slice(0, 3), data: sortedData});
     
    });
  }

  //Sorting highscores by points, descending
  sortHighscores(items) {
    let sortedData = (items).sort(function(player1, player2) {
      return player2.points - player1.points;
    });
    return sortedData;
  }

  //Handling the click of button "save score"
  handleSaveClicked = () => {
    let nickname = this.state.nickname.trim();
    
    //If the nickname is not empty, check if the player already exists
    if(!(nickname === "")) {
      doesPlayerExist = this.checkIfPlayerExist(nickname);

      if(doesPlayerExist != null){
        //If the player already exists and has less or equal amount of points as the current user
        //prompt the user to change the name
        if(doesPlayerExist >= this.state.points) {
          Toast.show({
            text: 'Score with that name already exists, please change your name if you want this score to be saved',
            buttonText: "OK",
            type: "warning",
            duration: 4000
          });
        //Otherwise, ask if the highscore should be updated
        } else {
          Alert.alert(
            'Score with that name already exists',
            'Do you want to set this as your new highscore?',
            [
              {text: 'CANCEL', onPress: () => console.log("cancel clicked")},
              {text: 'UPDATE', onPress: () => {this.updateScore(this.state.existingPlayerId)}},
            ],
            { cancelable: false }
          );
          this.setState({nickname: ""});
        }
      //If the nickname is original, save the score
      } else {
        this.saveNewScore(nickname);
      }
    //If the nickname is empty, tell the user to input at least 1 character
    } else {
      Toast.show({
        text: "Name needs to be at least 1 character long.",
        buttonText: "OK",
        type: "warning",
        duration: 3000
      });
    }
  };

  //Checking if a player with the same name already exists in the database
  //returns number of points of the existing player, otherwise null
  checkIfPlayerExist(player) {
    let scores = this.state.data
    let i;
    for(i = 0; i < scores.length; i++) {
      if(player === scores[i].player) {
        console.log("player id.." + scores[i].id);
        this.setState({existingPlayerId: scores[i].id});
        return scores[i].points;
      }
    }
    return null;
  }

  //Saving new score to the database
  //Showing toast with the success or error
  saveNewScore(nickname) {
    this.itemsRef.push().set({
      player: nickname, 
      points: this.state.points},
      function (error) {
        if (error) {
          Toast.show({
            text: "Data could not be saved.",
            buttonText: "OK",
            type: "danger",
            duration: 3000});
        } else {
          Toast.show({
            text: "Score saved!",
            buttonText: "OK",
            type: "success",
            duration: 3000
          });
        }
    });
    this.setState({nickname: ""});
  }

  //Updating the score,
  //Showing toast with success or error
  updateScore(id) {
    let existingPlayerRef = this.itemsRef.child(id);

    existingPlayerRef.update({
      points: this.state.points
    }, function (error) {
      if (error) {
        Toast.show({
          text: "Error updating data",
          buttonText: "OK",
          type: "success",
          duration: 3000
        });
      } else {
        Toast.show({
          text: "Score updated!",
          buttonText: "OK",
          type: "success",
          duration: 3000
        });
      }
    });   
  }
  
  render() {
    const { navigate } = this.props.navigation;
    let index = 1;
    let saveScoreForm;
    let saveScoreButton;
    let gameFeedback;
    
    //If the number of points higher than 0, show input form and save button
    if (this.state.points > 0) {

      saveScoreForm = (
        <Form style={styles.form}>
          <Item floatingLabel>
            <Label style={{color: "#f7f6f8"}}>Type your name and save your score!</Label>
            <Input onChangeText={(nickname) => this.setState({nickname})} value={this.state.nickname}/>
          </Item>
        </Form>
      );

      saveScoreButton = (
        <Button dark rounded block style={commonStyle.button} onPress={this.handleSaveClicked}>
          <Text>Save score</Text>
        </Button>
      );

      if (this.state.points > 19 && this.state.points < 45) {

        gameFeedback = (<Text style={commonStyle.header}>Great!</Text>);

      } else if (this.state.points > 45) {

        gameFeedback = (<Text style={commonStyle.header}>Awesome!</Text>);

      } else {

        gameFeedback = (<Text style={commonStyle.header}>Nice!</Text>);
        
      }

    } else {

      gameFeedback = (<Text style={commonStyle.header}>Ups!{"\n"}Maybe next time!</Text>);

      saveScoreButton = (
        <Button dark rounded block style={commonStyle.button} onPress={()=>navigate('ChooseCategory')}>
          <Text>Try again!</Text>
        </Button>
      );

    }

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          {/* <StatusBar hidden={true} /> */}
          <Content style={commonStyle.container}>
          
            {gameFeedback}
         
            <Text style={commonStyle.highlightedText}>Points: {this.state.points}</Text>
          
            {saveScoreForm}
            {saveScoreButton}
                   
            <Button dark rounded block style={commonStyle.button} onPress={()=>navigate('Home')}>
              <Text>Back to main screen</Text>
            </Button>

            {/* <List>
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
            </List> */}

            <Text style={commonStyle.highlightedText}>Highscores</Text>

            <List dataArray={this.state.topThree}
              renderRow={(item) =>
                <ListItem>
                  <Col>
                    <Text style={commonStyle.highlightedText}>{index++}.</Text>
                  </Col>
                  <Col>
                    <Text style={commonStyle.highlightedText}>{item.player}</Text>
                  </Col>
                  <Col>
                    <Text style={commonStyle.highlightedText}>{item.points}</Text>
                  </Col>
                </ListItem>}>          
            </List>
        
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    height: 120,
    justifyContent: 'center',
    margin: "2%",
  },
  form: {
    margin: "2%",
  },
});