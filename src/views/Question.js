import React from 'react';
import { StyleSheet, View, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Container, Header, Left, Right, Content, Title, Button, Card, CardItem, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {NavigationActions} from 'react-navigation';
import { AppLoading } from "expo";
import MultipleQuestion from '../components/MultipleQuestion';
import BooleanQuestion from '../components/BooleanQuestion';
import ChooseDifficulty from './ChooseDifficulty';
import ChooseCategory from './ChooseCategory';

export default class App extends React.Component {

  static navigationOptions = {title: "Question"};

  constructor(props) {
    super(props);
    this.state = ({
      level: "",
      category: "",
      questions: [],
      currentQuestion: "",
      currentType: "", 
      answers: [], 
      currentCategory: "", 
      currentLevel: "", 
      correctAnswer: "", 
      counter: 0,
      points: 0,
      loading: true,
      button0Style: styles.normalButton,
      button1Style: styles.normalButton,
      button2Style: styles.normalButton,
      button3Style: styles.normalButton
    })
  }

  componentWillMount() {
    //Find which level and category the user has chosen
    this.getLevelAndCategory();
  }

  componentDidMount() {

    //console.log("Category: " + this.state.category);
    //console.log("Level: " + this.state.level);

    //Set the base url
    let url = "https://opentdb.com/api.php?amount=10";

    //Create the url based on level and category
      if (this.state.level !== "random") {
        url += "&category=" + this.state.category + "&difficulty=" + this.state.level;
      }
    
    url += "&encode=url3986";

    //Fetch the questions from the created url
    this.fetchQuestions(url);
  }

  //Get and save level and category chosen by user
  getLevelAndCategory() {
    const params = this.props.navigation.state.params;
    const category = params.category;
    const id = params.id;
    const level = params.levels[id];
    console.log(category);

    this.setState({level: level, category: category});

  }

  //Fetch the questions and save them
  fetchQuestions = (url) => {
    //console.log(url);
   
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson.results);

        this.setState({questions: responseJson.results, loading: false})
        this.setCurrentQuestion();
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  //TODO: next question after some time
  //Set the state to show current question 
  setCurrentQuestion = () => {

    //Reset styles of the buttons
    this.setState({
      button0Style: styles.normalButton,
      button1Style: styles.normalButton,
      button2Style: styles.normalButton,
      button3Style: styles.normalButton,
    });
    
    //Check if there are still questions left
    if(this.state.counter < 10) {
      
      let answersArray = [];
      let answer1 = unescape(this.state.questions[this.state.counter].correct_answer);
      let answer2 = unescape(this.state.questions[this.state.counter].incorrect_answers[0]);

      answersArray.push(answer1);
      answersArray.push(answer2);
      
      if(this.state.questions[this.state.counter].type == "multiple"){

        let answer3 = unescape(this.state.questions[this.state.counter].incorrect_answers[1]);
        let answer4 = unescape(this.state.questions[this.state.counter].incorrect_answers[2]);

        answersArray.push(answer3);
        answersArray.push(answer4);

        answersArray.sort();

      } else {

        answersArray.sort();
        answersArray.reverse();

      }

      this.setState({
        currentQuestion: unescape(this.state.questions[this.state.counter].question),
        currentCategory: unescape(this.state.questions[this.state.counter].category),
        currentLevel: unescape(this.state.questions[this.state.counter].difficulty),
        correctAnswer: unescape(answer1),
        currentType: this.state.questions[this.state.counter].type,
        answers: answersArray
      });

      this.setState((prevState) => {
        return {counter: prevState.counter + 1}
      });

    // If there are no more questions, go to the summary view, EndGame
    //send poiints as params
    } else {

      //console.log(this.state.points);
      const navigateAction = NavigationActions.navigate({
      routeName: 'End',
      params: {points: this.state.points},
      });

      this.props.navigation.dispatch(navigateAction);

    }
    
  }

  //Check the chosen answer
  checkAnswer = (index, event) => {

    let that = this;

    //Change the color of selected button 
    switch (index) {
      case 0:
      this.setState({
        button0Style: styles.selectedButton
      });
      break;
      case 1:
      this.setState({
        button1Style: styles.selectedButton
      });
      break;
      case 2:
      this.setState({
        button2Style: styles.selectedButton
      });
      break;
      case 3:
      this.setState({
        button3Style: styles.selectedButton
      });
      break;
      default: 
      break;
    }

    let chosenAnswer = this.state.answers[index];
    let level = this.state.currentLevel;
    let points = this.state.points;
    let isCorrect = false;

    //If the answer is correct, add points based on level of the question
    if(chosenAnswer == this.state.correctAnswer) {
      switch(level) {
        case "easy":
          points += 5;
          break;
        case "medium":
          points += 10;
          break;
        case "hard":
          points += 15;
          break;
        default:
          points += 0;
      }

      this.setState({points: points});

      isCorrect = true;

    } else {
      isCorrect = false;
    }

    //After 1,5s change the style of chosen button, to show whether the answer was correct or not
    //
    setTimeout(function () {
      that.showCorrect(index, isCorrect);
        }, 1500
    );

  }

  //Changing the style of the selected button based on the answer
  showCorrect(id, isCorrect) {
    console.log("executing check answer...")
    let style;
    let that = this;
    if(isCorrect) {
      style = styles.correctButton;
    } else {
      style = styles.wrongButton;
    }

    switch (id) {
      case 0:
      this.setState({
        button0Style: style
      });
      break;
      case 1:
      this.setState({
        button1Style: style
      });
      break;
      case 2:
      this.setState({
        button2Style: style
      });
      break;
      case 3:
      this.setState({
        button3Style: style
      });
      break;
      default: 
      break;
    }

    //After 2,5 s change the question to the next one
    setTimeout(function () {
      that.setCurrentQuestion();
        }, 2500
    );
  }
 
  render() {
    const answers = this.state.answers;
    const { navigate } = this.props.navigation;
    let answersGrid;

    if(answers.length == 2) {
      answersGrid = <BooleanQuestion buttonStyle0={this.state.button0Style} buttonStyle1={this.state.button1Style} answers={answers} click={this.checkAnswer} />
    } else {
      answersGrid = <MultipleQuestion buttonStyle0={this.state.button0Style} buttonStyle1={this.state.button1Style} buttonStyle2={this.state.button2Style} buttonStyle3={this.state.button3Style} answers={answers} click={this.checkAnswer} />
    }

    if (this.state.loading) {
      return <View style={styles.loadingView}>
        <Text>Loading questions</Text>
        <ActivityIndicator size="large" color="#ffffff" />
        </View>;}

    return (

      <Container>
      {/* <StatusBar hidden={true} /> */}
        <Grid style={styles.container}>
          <Col>
          <Text>Category: {this.state.currentCategory} </Text>
          <Text>Level: {this.state.currentLevel} </Text>
          <Card>
            <CardItem header>
              <Text>{this.state.currentQuestion}</Text>
            </CardItem>
         </Card>
         {answersGrid}

         {/* Next button only for testing purposes, to be deleted... */}
        <Button onPress={()=>navigate('End', {points: this.state.points})}>
            <Text>Next</Text>
          </Button>
        </Col>
        </Grid>
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
   justifyContent: 'center',
   margin: "5%",
  },
  column: {
    height: 120,
    justifyContent: 'center',
    margin: "2%",
  },
  button: {
    height: 120,
    width: 120,
    justifyContent: 'center',
  },
  normalButton: {
    height: 120,
    width: 120,
    backgroundColor: "blue"
  },
  selectedButton: {
    height: 120,
    width: 120,
    backgroundColor: "#EDE337"
  },
  correctButton: {
    height: 120,
    width: 120,
    backgroundColor: "#0BCB00"
  },
  wrongButton: {
    height: 120,
    width: 120,
    backgroundColor: "#E50F00"
  }
});
