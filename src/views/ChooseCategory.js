import React from 'react';
import { Alert, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Container, Content, Button, Text, StyleProvider, Item, Input, Icon, Label, Form, Header, Left, Body, Title } from 'native-base';
import { LinearGradient } from "expo";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { commonStyle } from '../styles/commonStyle';
import {themeColors, opacity} from '../styles/themeVariables';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class ChooseCategory extends React.Component {

  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {categories: [], searchValue: "", results: []};
  }

  componentDidMount() {
    this.getCategories();
  }

  //Get the list of categories fetched in the previous component
  getCategories = () => {
    const params = this.props.navigation.state.params;
    this.setState({categories: params.categories, results: params.categories});
  }

  //Search categories based on user's input
  search = () => {
    let searchValue = this.state.searchValue;

    let results = [];
    let categories = this.state.categories;

    searchValue.trim();

    //If the input is not empty, search for matching categories
    if(searchValue !== "") {
      for (let i = 0; i < categories.length; i++) {
        if(categories[i].name.includes(searchValue)) {
          results.push(categories[i]);
        }
      }
    this.setState({results: results});
    }
  }

  //Reset categories to the default list
  reset = () => {
    let categories = this.state.categories;
    this.setState({results: categories});
  }

  render() {
    const { navigate } = this.props.navigation;

    let buttons = this.state.results.map((item, index) => 
          <TouchableOpacity 
              activeOpacity={opacity}
              style={commonStyle.listButtons} 
              key={index} 
              onPress={() => navigate("ChooseDifficulty", {categories: this.state.categories, id: item.id})} >

                <LinearGradient
                    colors={[themeColors.accentColorDark, themeColors.accentColor, themeColors.accentColorDark]}
                    style={commonStyle.linearGradient}>

                      <Text style={commonStyle.buttonText}>{item.name}</Text>

                </LinearGradient>

          </TouchableOpacity>);

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <ImageBackground source={require('../../assets/background2.png')} style={{width: '100%', height: '100%'}} >
            {/* <StatusBar hidden={true} /> */}

            <Header transparent style={{height: 120}} >
              <Left>
                <Button transparent onPress={() => navigate("Home")}>
                  <Icon name="arrow-back" style={{color: themeColors.secondaryColor}}/>
                </Button>
              </Left>
              <Body>
                <Title style={commonStyle.header}>Choose Your</Title>
                <Title style={commonStyle.header}>Category:</Title>
              </Body>
            </Header>
            
            <Content style={commonStyle.container}>

              <Form style={commonStyle.form}>
                <Item floatingLabel>
                  <Label style={{color: "#fff"}}>Search for category</Label>
                  <Input onChangeText={(searchValue) => this.setState({searchValue})} value={this.state.searchValue} />
                </Item>
              </Form>

              <Grid>
                <Col style={commonStyle.content}>
                  <Row>

                    <TouchableOpacity 
                        activeOpacity={opacity}
                        style={commonStyle.button} 
                        onPress={this.search}>

                          <LinearGradient
                              colors={[themeColors.secondaryColorDark, themeColors.secondaryColor, themeColors.secondaryColorDark]}
                              style={commonStyle.linearGradient}>

                                <Text style={commonStyle.darkButtonText}>Search</Text>

                          </LinearGradient>

                    </TouchableOpacity>

                    <TouchableOpacity 
                        activeOpacity={opacity}
                        style={commonStyle.button} 
                        onPress={this.reset}>

                          <LinearGradient
                              colors={[themeColors.secondaryColorDark, themeColors.secondaryColor, themeColors.secondaryColorDark]}
                              style={commonStyle.linearGradient}>

                                <Text style={commonStyle.darkButtonText}>Reset</Text>

                          </LinearGradient>

                    </TouchableOpacity>
          
                  </Row>
                </Col>
              </Grid>

              <TouchableOpacity 
                  activeOpacity={opacity}
                  style={commonStyle.listButtons} 
                  onPress={() => navigate("ChooseDifficulty", {categories: this.state.categories, id: -1})}>

                    <LinearGradient
                        colors={[themeColors.accentColorDark, themeColors.accentColor, themeColors.accentColorDark]}
                        style={commonStyle.linearGradient}>

                          <Text style={commonStyle.buttonText}>Random Categories</Text>

                    </LinearGradient>

              </TouchableOpacity>        

              {buttons}

            </Content>
          </ImageBackground>
        </Container>
      </StyleProvider>
    );
  }
}