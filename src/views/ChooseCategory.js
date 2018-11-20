import React from 'react';
import { Alert, StatusBar } from 'react-native';
import { Container, Content, Button, Text, StyleProvider } from 'native-base';
import { commonStyle } from '../styles/commonStyle';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class ChooseCategory extends React.Component {

  static navigationOptions = {header: null};
  // static navigationOptions = {
  //   title: "Category", 
  //   headerStyle: {
  //     height: 40, 
  //     backgroundColor: '#38b6ff', 
  //     borderWidth: 0
  //   }
  // };

  constructor(props) {
    super(props);
    this.state = {categories: [], loading: true};
  }

  componentDidMount() {
    //this.fetchCategories();
    const params = this.props.navigation.state.params;
    this.setState({categories: params.categories})
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
                    <Button dark 
                            rounded 
                            block 
                            style={commonStyle.button} 
                            key={index} 
                            onPress={() => navigate("ChooseDifficulty", {categories: this.state.categories, id: index})} >

                        <Text>{item.name}</Text>

                    </Button>);

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
        {/* <StatusBar hidden={true} /> */}
          <Content style={commonStyle.container}>

            <Text style={commonStyle.header}>Choose Your Category:</Text>

            <Button dark rounded block style={commonStyle.button} onPress={() => navigate("ChooseDifficulty", {categories: this.state.categories, id: -1})} >
              <Text>Random</Text>
            </Button>

            {buttons}

          </Content>
        </Container>
      </StyleProvider>
    );
  }
}