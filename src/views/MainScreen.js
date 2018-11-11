import React from 'react';
import { StyleSheet, View, Alert, StatusBar } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body, Form, Item, Input, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Font, AppLoading } from "expo";

export default class MainScreen extends React.Component {

  static navigationOptions = {title: "Trivia App"};

  constructor(props) {
    super(props);
    this.state = {loading: true, loadingCategories: true, categories: []};
    this.button = React.createRef();
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.fetchCategories();
    // this.setState({ loading: false });
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

    if (this.state.loading) {
      return <AppLoading />;}
    return (

      <Container>
      {/* <StatusBar hidden={true} /> */}
        <Content style={styles.container}>
          
          <Text>Trivia Quiz!</Text>          

          <Button info block style={styles.button} onPress={() => navigate("ChooseCategory", {categories: this.state.categories})}>
            <Text>Play!</Text>
          </Button>
         
          <Button info block style={styles.button} onPress={()=>navigate('Highscores')}>
            <Text>See highscores</Text>
          </Button>
        
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
  },
  normalButton: {
    backgroundColor: "blue"
  },
  selectedButton: {
    backgroundColor: "#EDE337"
  },
  correctButton: {
    backgroundColor: "#0BCB00"
  },
  wrongButton: {
    backgroundColor: "#E50F00"
  }

});
