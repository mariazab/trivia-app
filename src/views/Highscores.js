import React from 'react';
import { StatusBar } from 'react-native';
import { Container, Content, Button, Text, List, ListItem, StyleProvider } from 'native-base';
import { Col } from 'react-native-easy-grid';
import * as firebase from 'firebase';
import {firebaseInitApp} from '../database/firebase-config';
import LoadingScreen from '../components/LoadingScreen';
import { commonStyle } from '../styles/commonStyle';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

const firebaseApp = firebaseInitApp;

export default class Highscores extends React.Component {

  static navigationOptions = {header: null};

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
    let sortedData = (items).sort(function(player1, player2) {
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

    //return LoadingScreen if the highscores are still being fetched
    if (this.state.loading) {
      return <LoadingScreen />;}
    
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
        {/* <StatusBar hidden={true} /> */}
          <Content style={commonStyle.container}>
          
            <Text style={commonStyle.header}>Highscores</Text>

            <List>
              <ListItem itemHeader>
                <Col>
                  <Text style={commonStyle.listHeader}>POSITION</Text>
                </Col>
                <Col>
                  <Text style={commonStyle.listHeader}>PLAYER</Text>
                </Col>
                <Col>
                  <Text style={commonStyle.listHeader}>POINTS</Text>
                </Col>
              </ListItem>
            </List>

            <List dataArray={this.state.data}
              renderRow={(item) =>
                <ListItem>
                  <Col>
                    <Text style={commonStyle.highlightedText}>{index++}.</Text>
                  </Col>
                  <Col>
                    <Text style={commonStyle.highlightedText}>{item.player}</Text>
                  </Col>
                  <Col>
                  < Text style={commonStyle.highlightedText}>{item.points}</Text>
                  </Col>
                </ListItem>}>          
              </List>

          </Content>
        </Container>
      </StyleProvider>
    );
  }
}