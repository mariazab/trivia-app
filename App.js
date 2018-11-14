import React from 'react';
import { StyleSheet, View, Alert, StatusBar } from 'react-native';
import { Root } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {createStackNavigator} from 'react-navigation';
import Question from "./src/views/Question";
import ChooseDifficulty from './src/views/ChooseDifficulty';
import ChooseCategory from './src/views/ChooseCategory';
import EndGame from './src/views/EndGame';
import MainScreen from './src/views/MainScreen';
import Highscores from './src/views/Highscores';

export default class App extends React.Component {

  render() {
    return (
      <Root>
        <TriviaApp />
      </Root>
    );
  }
  
}

const TriviaApp = createStackNavigator({
  Home: {screen: MainScreen},
  Highscores: {screen: Highscores},
  ChooseCategory: {screen: ChooseCategory},
  ChooseDifficulty: {screen: ChooseDifficulty},
  Question: {screen: Question},
  End: {screen: EndGame}
});

