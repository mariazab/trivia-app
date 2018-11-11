import React from 'react';
import { StyleSheet, View, Alert, StatusBar } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class ChooseDifficulty extends React.Component {

    static navigationOptions = {title: "Level"};

    constructor(props) {
        super(props);
        this.state = {levels: ["easy", "medium", "hard", "random"], chosenCategory: ""};
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
                    <Button info block style={styles.button} key={index} onPress={() => navigate('Question', {category: this.state.chosenCategory, levels: this.state.levels, id: index})} >
                        <Text>{item}</Text>
                    </Button>);
    return (

      <Container>
      {/* <StatusBar hidden={true} /> */}
      <Content style={styles.container} >
        <Grid>
          <Col>
          <Text>Choose level</Text>
            {buttons}
        </Col>
        </Grid>
        </Content>
   </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
   margin: "5%",
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