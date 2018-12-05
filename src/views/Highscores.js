import React from 'react';
import { StatusBar, ImageBackground } from 'react-native';
import { Container, Content, Button, Text, List, ListItem, StyleProvider, Icon, Header, Left, Right, Body, Title  } from 'native-base';
import { Col } from 'react-native-easy-grid';
import * as firebase from 'firebase';
import {firebaseInitApp} from '../database/firebase-config';

import LoadingScreen from '../components/LoadingScreen';

import { commonStyle } from '../styles/commonStyle';
import {themeColors} from '../styles/themeVariables';
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

  componentDidMount() {
    //Ignore setting a timer error from database until there's a solution
    console.ignoredYellowBox = [
      'Setting a timer'
    ]
  }

  //Disconnect firebase ref
  componentWillUnmount() {
    this.itemsRef.off();
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
          <ImageBackground source={require('../../assets/background2.png')} style={{width: '100%', height: '100%'}} >
            {/* <StatusBar hidden={true} /> */}
        
            <Header transparent>
              <Left>
                <Button transparent onPress={() => navigate("Home")}>
                  <Icon name="arrow-back" style={{color: themeColors.secondaryColor}}/>
                </Button>
              </Left>
              <Body>
                <Title style={commonStyle.header}>Highscores</Title>
              </Body>
            </Header>
          
            <Content style={commonStyle.container}>
          
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
                        <Text style={commonStyle.highlightedText}>{item.points}</Text>
                      </Col>
                    </ListItem>}>          
              </List>

            </Content>
          </ImageBackground>
        </Container>
      </StyleProvider>
    );
  }
}