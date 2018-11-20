import React from 'react';
import { Alert, StatusBar, Image } from 'react-native';
import { Container, Content, Button, Text, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Font, AppLoading } from "expo";
//import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { commonStyle } from '../styles/commonStyle';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class MainScreen extends React.Component {

  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {loading: true, loadingCategories: true, categories: []};
    this.button = React.createRef();
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      'Raleway-Regular': require('../../assets/fonts/Raleway-Regular.ttf'),
      'Atma-SemiBold': require('../../assets/fonts/Atma-SemiBold.ttf'),
    });
    let that = this;

     //After 1,5 s fetch the categories and set loading to false
     setTimeout(function () {
      that.fetchCategories();
        }, 1500
    );
  }

  fetchCategories = () => {
    const url = "https://opentdb.com/api_category.php";

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson.trivia_categories);
        //console.log(responseJson.trivia_categories.sort(this.compare));
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
    const uri = "../../assets/icon.png";

    if (this.state.loading) {
      return <AppLoading />;}
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <StatusBar hidden={true} />
          <Content style={commonStyle.container}>
            <Grid>
              <Col style={commonStyle.content}>

                <Row>
                  <Image style={commonStyle.logo} source={require('../../assets/icon.png')} />
                </Row>

                <Row>
                  <Button dark 
                          rounded 
                          block 
                          style={commonStyle.button} 
                          onPress={() => navigate("ChooseCategory", {categories: this.state.categories})}>
                    <Text>PLAY!</Text>
                  </Button>
                </Row>

                <Row>
                  <Button dark 
                          rounded 
                          block 
                          style={commonStyle.button} 
                          onPress={()=>navigate('Highscores')}>
                    <Text>SEE HIGHSCORES</Text>
                  </Button>
                </Row>

              </Col>
            </Grid>

          {/* <AnimatedCircularProgress
              size={120}
              width={3}
              fill={200}
              tintColor="#00e0ff"
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#3d5875" /> */}
        
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}