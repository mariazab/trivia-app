import React from 'react';
import { Alert, StatusBar, Image, ImageBackground, TouchableOpacity, Easing } from 'react-native';
import { Container, Content, Button, Text, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Font, AppLoading, LinearGradient } from "expo";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { commonStyle } from '../styles/commonStyle';
import {themeColors, opacity} from '../styles/themeVariables';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class MainScreen extends React.Component {

  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {loading: true, categories: []};

  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      'Raleway-Regular': require('../../assets/fonts/Raleway-Regular.ttf'),
      'Raleway-SemiBold': require('../../assets/fonts/Raleway-SemiBold.ttf'),
      'Atma-SemiBold': require('../../assets/fonts/Atma-SemiBold.ttf'),
    });

    this.fetchCategories();
  }

  fetchCategories = () => {
    const url = "https://opentdb.com/api_category.php";

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({categories: responseJson.trivia_categories.sort(this.compare), loading: false})
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  //Sorting objects alphabeticaly based on name
  compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  render() {
    const { navigate } = this.props.navigation;
    
    if (this.state.loading) {
      return <AppLoading />;}

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <ImageBackground source={require('../../assets/background2.png')} style={{width: '100%', height: '100%'}} >
            <StatusBar hidden={true} />
            <Content style={commonStyle.container}>

              <Image style={commonStyle.logo} source={require('../../assets/icon-transp.png')} />

              <TouchableOpacity 
                  activeOpacity={opacity}
                  style={commonStyle.button} 
                  onPress={() => navigate("ChooseCategory", {categories: this.state.categories})}>
                  
                    <LinearGradient
                        colors={[themeColors.accentColorDark, themeColors.accentColor, themeColors.accentColorDark]}
                        style={commonStyle.linearGradient}>
                        
                          <Text style={commonStyle.buttonText}>PLAY!</Text>
                        
                    </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                  activeOpacity={opacity}
                  style={commonStyle.button} 
                  onPress={()=>navigate('Highscores')}>
                    
                    <LinearGradient
                        colors={[themeColors.accentColorDark, themeColors.accentColor, themeColors.accentColorDark]}
                        style={commonStyle.linearGradient}>
                          
                          <Text style={commonStyle.buttonText}>SEE HIGHSCORES</Text>
                          
                    </LinearGradient>
              </TouchableOpacity>

            </Content>
          </ImageBackground>
        </Container>
      </StyleProvider>
    );
  }
}