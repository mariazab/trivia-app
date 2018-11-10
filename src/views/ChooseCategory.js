import React from 'react';
import { StyleSheet, View, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body, Form } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';
import { AppLoading } from "expo";

export default class ChooseCategory extends React.Component {

  static navigationOptions = {title: "Category"};

  constructor(props) {
    super(props);
    this.state = {categories: ["random"], loading: true};
  }

  componentDidMount() {
    this.fetchCategories();
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

    let buttons = this.state.categories.map((item, index) => 
                    <Button info block style={styles.button} key={index} onPress={() => navigate("ChooseDifficulty", {categories: this.state.categories, id: index})} >
                        <Text>{item.name}</Text>
                    </Button>);
    
    if (this.state.loading) {
      return <View style={styles.loadingView}>
        <Text>Loading categories</Text>
        <ActivityIndicator size="large" color="#ffffff" />
        </View>;}

    return (

      <Container>
      {/* <StatusBar hidden={true} /> */}
        <Content style={styles.container}>
          <Text>Choose category</Text>
          <Button info block style={styles.button} onPress={() => navigate("ChooseDifficulty", {categories: this.state.categories, id: -1})} >
            <Text>Random</Text>
          </Button>
           {buttons}
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
  button: {
    marginBottom: 10,
  }
});