import React from 'react';
import { StatusBar } from 'react-native';
import { Container, Content, Button, Text, StyleProvider } from 'native-base';
//import { Col, Row, Grid } from 'react-native-easy-grid';
import { commonStyle } from '../styles/commonStyle';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class ChooseDifficulty extends React.Component {

    static navigationOptions = {header: null};

    constructor(props) {
        super(props);
        this.state = {levels: ["Easy", "Medium", "Hard", "Random"], chosenCategory: ""};
    }

    componentDidMount() {
      const params = this.props.navigation.state.params;
      const index = params.id;
      //If the chosen category isn't random, get the category id
      if(index >= 0) {
        console.log(params.categories[index].id);
        this.setState({chosenCategory: params.categories[index].id})
      }
    }

  render() {

    const {navigate} = this.props.navigation;

    let buttons = this.state.levels.map((item, index) => 
                    <Button dark 
                            rounded 
                            block 
                            style={commonStyle.button} 
                            key={index} 
                            onPress={() => navigate('Question', {category: this.state.chosenCategory, levels: this.state.levels, id: index})} >
                        
                        <Text>{item}</Text>

                    </Button>);
    
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
        {/* <StatusBar hidden={true} /> */}
          <Content style={commonStyle.container} >

            <Text style={commonStyle.header}>Choose Your Level:</Text>

            {buttons}
 
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}