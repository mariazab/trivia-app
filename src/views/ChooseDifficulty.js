import React from 'react';
import { StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Container, Content, Button, Text, StyleProvider, Icon, Header, Left, Body, Title } from 'native-base';
import { LinearGradient } from "expo";
import { commonStyle } from '../styles/commonStyle';
import {themeColors, opacity} from '../styles/themeVariables';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class ChooseDifficulty extends React.Component {

  static navigationOptions = {header: null};

  constructor(props) {
      super(props);
      this.state = {levels: ["Random Levels", "Easy", "Medium", "Hard"], chosenCategory: ""};
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    const categoryId = params.id;
    //If the chosen category isn't random, get the category id
    if(categoryId >= 0) {
      console.log(categoryId);
      this.setState({chosenCategory: categoryId})
    }
  }

  render() {
    const {navigate} = this.props.navigation;

    let buttons = this.state.levels.map((item, index) => 
          <TouchableOpacity 
              activeOpacity={opacity}
              style={commonStyle.listButtons} 
              key={index} 
              onPress={() => navigate('Question', {category: this.state.chosenCategory, levels: this.state.levels, id: index})} >

                <LinearGradient
                    colors={[themeColors.accentColorDark, themeColors.accentColor, themeColors.accentColorDark]}
                    style={commonStyle.linearGradient}>

                      <Text style={commonStyle.buttonText}>{item}</Text>

                </LinearGradient>

          </TouchableOpacity>);
    
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <ImageBackground source={require('../../assets/background2.png')} style={{width: '100%', height: '100%'}} >
          {/* <StatusBar hidden={true} /> */}

          <Header transparent style={{height: 120}} >
            <Left>
              <Button transparent onPress={() => navigate("ChooseCategory")}>
                <Icon name="arrow-back" style={{color: themeColors.secondaryColor}}/>
              </Button>
            </Left>
            <Body>
              <Title style={commonStyle.header}>Choose Your</Title>
              <Title style={commonStyle.header}>Level:</Title>
            </Body>
          </Header>
          
          <Content style={commonStyle.container} >

            {buttons}
 
          </Content>
        </ImageBackground>
      </Container>
    </StyleProvider>
    );
  }
}