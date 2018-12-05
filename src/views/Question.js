import React from 'react';
import { StyleSheet, Alert, StatusBar, ImageBackground } from 'react-native';
import { Container, Content, Button, Card, CardItem, Text, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {NavigationActions} from 'react-navigation';
import base64 from 'react-native-base64';

import LoadingScreen from '../components/LoadingScreen';
import MultipleQuestion from '../components/MultipleQuestion';
import BooleanQuestion from '../components/BooleanQuestion';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import {themeColors} from '../styles/themeVariables';
import { commonStyle } from '../styles/commonStyle';


export default class App extends React.Component {

  static navigationOptions = {header: null};

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
      button0Style: gradientColors.normalButton,
      button1Style: gradientColors.normalButton,
      button2Style: gradientColors.normalButton,
      button3Style: gradientColors.normalButton,
      checkingAnswer: false,
      responseOk: false,
    });
    
  }

  componentWillMount() {
    //Find which level and category the user has chosen
    this.getLevelAndCategory();
  }

  componentDidMount = () => {
    //Set the base url
    let url = "https://opentdb.com/api.php?amount=10&category=" + this.state.category;

    //Append level to the url if the level is not random
      if (this.state.level !== "random levels") {
        url += "&difficulty=" + this.state.level;
      }
    
    //url += "&encode=url3986";
    url += "&encode=base64";

    //Fetch the questions from the created url
    this.fetchQuestions(url);
  }

  //Clear all timeouts 
  componentWillUnmount = () => {
    clearTimeout(this.addPointsTimeout);
    clearTimeout(this.rightOrWrongTimeout);
    clearTimeout(this.nextQuestionTimeout);
  }

  //Get and save level and category chosen by user
  getLevelAndCategory() {
    const params = this.props.navigation.state.params;
    const category = params.category;
    const id = params.id;
    const level = params.levels[id];
    
    this.setState({level: level.toLowerCase(), category: category});
  }

  //Fetch the questions and save them
  //show alert if there was an error and navigate to choosing category
  fetchQuestions = (url) => {
   
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        
        if (responseJson.response_code === 0) {
          this.setState({questions: responseJson.results, loading: false, responseOk: true});
          this.setCurrentQuestion();

        } else {
          if (responseJson.response_code == 1) {

            this.setState({loading: false, responseOk: false});
            Alert.alert('Not enough questions available for category/level.', 'Please try again.');

          } else {
            Alert.alert('Error while retrieving questions', 'Please try again.');
          }

          const navigateAction = NavigationActions.navigate({
            routeName: 'ChooseCategory',
            });
      
            this.props.navigation.dispatch(navigateAction);
          }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  //Set the state to show current question 
  setCurrentQuestion = () => {

    //Reset styles of the buttons and set checkingAnswer to false to enable buttons
    this.setState({
      button0Style: gradientColors.normalButton,
      button1Style: gradientColors.normalButton,
      button2Style: gradientColors.normalButton,
      button3Style: gradientColors.normalButton,
      checkingAnswer: false,
    });
    
    //Check if there are still questions left
    if(this.state.counter < 10) {
      let answersArray = [];
      let answer1 = base64.decode(this.state.questions[this.state.counter].correct_answer);
      let answer2 = base64.decode(this.state.questions[this.state.counter].incorrect_answers[0]);

      answersArray.push(answer1);
      answersArray.push(answer2);
      
      //Add the rest of the answers to the array if the type of the question is multiple
      if(base64.decode(this.state.questions[this.state.counter].type) == "multiple"){
        let answer3 = base64.decode(this.state.questions[this.state.counter].incorrect_answers[1]);
        let answer4 = base64.decode(this.state.questions[this.state.counter].incorrect_answers[2]);

        answersArray.push(answer3);
        answersArray.push(answer4);

        answersArray.sort();
      
      //Otherwise, the question type is boolean, show the answers in order TRUE -> FALSE (reverse alphabetical)
      } else {
        answersArray.sort();
        answersArray.reverse();
      }

      this.setState({
        currentQuestion: base64.decode(this.state.questions[this.state.counter].question),
        currentCategory: base64.decode(this.state.questions[this.state.counter].category),
        currentLevel: base64.decode(this.state.questions[this.state.counter].difficulty),
        correctAnswer: answer1,
        currentType: base64.decode(this.state.questions[this.state.counter].type),
        answers: answersArray,
      });

      //Increment the counter, to track the number of question
      this.setState((prevState) => {
        return {counter: prevState.counter + 1}
      });

    // If there are no more questions, go to the summary view, EndGame
    //send points as params
    } else {
      const navigateAction = NavigationActions.navigate({
      routeName: 'End',
      params: {points: this.state.points},
      });

      this.props.navigation.dispatch(navigateAction);
    }
  }

  //Check the chosen answer
  checkAnswer = (index, event) => {
    //If the answer is not being currently checked, proceed to checking
    if(!this.state.checkingAnswer) {
      let that = this;

      //Change the color of selected button, and the rest to disabled, set checkingAnswer to true
      this.selectAndDisableButtons(index);

      let chosenAnswer = this.state.answers[index];
      let level = this.state.currentLevel;
      let isCorrect = false;

      //If the answer is correct, add points based on level of the question
      if(chosenAnswer == this.state.correctAnswer) {
        this.addPointsTimeout = setTimeout(function () {
          that.addPoints(level);
            }, 1000
        );
        isCorrect = true;
      }
      
      //After 700ms change the style of chosen button, to show whether the answer was correct or not
      this.rightOrWrongTimeout = setTimeout(function () {
        that.showIfRightOrWrong(index, isCorrect);
        }, 700
      );
    }
  }

  //Change colors of selected button and the rest of the buttons
  selectAndDisableButtons(index) {
    switch (index) {
      case 0:
        this.setState({
          button0Style: gradientColors.selectedButton,
          checkingAnswer: true
        });
        break;
      case 1:
        this.setState({
          button1Style: gradientColors.selectedButton,
          checkingAnswer: true
        });
        break;
      case 2:
        this.setState({
          button2Style: gradientColors.selectedButton,
          checkingAnswer: true
        });
        break;
      case 3:
        this.setState({
          button3Style: gradientColors.selectedButton,
          checkingAnswer: true
        });
        break;
      default: 
        break;
    }
  }

  //Determine how many points should be added and add them
  addPoints(level) {
    let points = this.state.points;
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
  }

  //Show if the answer is right or wrong by changing the style of the selected button
  showIfRightOrWrong(id, isCorrect) {
    let style;
    let that = this;
    if(isCorrect) {
      style = gradientColors.correctButton;
    
    //If the answer was wrong, show the correct answer
    } else {
      style = gradientColors.wrongButton;

      this.showCorrectAnswer();
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

    //After 1 s change the question to the next one
    this.nextQuestionTimeout = setTimeout(function () {
      that.setCurrentQuestion();
        }, 1000
    );
  }

  //Show the corrrect answer by changing the color of the button
  showCorrectAnswer() {
    let correctAnswerIndex;
    let i;
    let answers = this.state.answers;
    let correctAnswer = this.state.correctAnswer;
    
    //Find the index of the correct answer 
    for (i = 0; i < answers.length; i++){
      if(answers[i] == correctAnswer){
        correctAnswerIndex = i;
      }
    }

    switch (correctAnswerIndex) {
      case 0:
        this.setState({
          button0Style: gradientColors.correctButton
        });
        break;
      case 1:
        this.setState({
          button1Style: gradientColors.correctButton
        });
        break;
      case 2:
        this.setState({
          button2Style: gradientColors.correctButton
        });
        break;
      case 3:
        this.setState({
          button3Style: gradientColors.correctButton
        });
        break;
      default: 
        break;
    }

  }
 
  render() {
    const answers = this.state.answers;
    const { navigate } = this.props.navigation;
    let answersGrid;

    //Show the correct grid, based on the length of the answers array
    if(answers.length == 2) {
      answersGrid = <BooleanQuestion 
                        buttonStyle0={this.state.button0Style} 
                        buttonStyle1={this.state.button1Style} 
                        answers={answers} 
                        click={this.checkAnswer} />
    } else {
      answersGrid = <MultipleQuestion 
                        buttonStyle0={this.state.button0Style} 
                        buttonStyle1={this.state.button1Style} 
                        buttonStyle2={this.state.button2Style} 
                        buttonStyle3={this.state.button3Style} 
                        answers={answers} 
                        click={this.checkAnswer} />
    }

    //Show loading screen, if the questions are still being fetched
    if (this.state.loading || !this.state.responseOk) {
      return <LoadingScreen />;}
      
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <ImageBackground source={require('../../assets/background2.png')} style={{width: '100%', height: '100%'}} >
          {/* <StatusBar hidden={true} /> */}
            <Grid style={commonStyle.container}>              

              <Col>
                <Text style={styles.header}>Question {this.state.counter}/10</Text>
                <Card>
                  <CardItem bordered>
                    <Col>
                      <Text style={styles.cardText}>Category: {this.state.currentCategory} </Text>
                    </Col>
                    <Col style={{width: 20}}></Col>
                    <Col style={styles.cardColumn2}>
                      <Text style={styles.cardText}>Level: {this.state.currentLevel} </Text>
                      <Text style={styles.cardText}>Points: {this.state.points} </Text>
                    </Col>
                  </CardItem>
                  <CardItem bordered>
                    <Text style={styles.cardText}>{this.state.currentQuestion}</Text>
                  </CardItem>
                </Card>
            
                {answersGrid}
              
              </Col>
            </Grid>

            {/* Next button only for testing purposes, to be deleted... */}
            <Button onPress={()=>navigate('End', {points: this.state.points})}>
              <Text>Next</Text>
            </Button>
          </ImageBackground>
        </Container>
      </StyleProvider>
    );
  }
}

const gradientColors = {
  normalButton: [themeColors.accentColorDark, themeColors.accentColor, themeColors.accentColorDark],
  selectedButton: [themeColors.secondaryColorDark, themeColors.secondaryColor, themeColors.secondaryColorDark],
  correctButton: [themeColors.rightColorDark, themeColors.rightColor, themeColors.rightColorDark],
  wrongButton: [themeColors.wrongColorDark, themeColors.wrongColor, themeColors.wrongColorDark]
};

const styles = StyleSheet.create({
  cardColumn1: {
    marginRight: "5%",
    marginLeft: 0,
  },
  cardColumn2: {
    marginLeft: "5%",
  },
  cardText: {
    fontFamily: 'Raleway-SemiBold',
  },
  button: {
    height: 120,
    width: 120,
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'Atma-SemiBold',
    color: '#FFDE59',
    fontSize: 38,
    margin: '2%',
    textAlign: 'center',
  },
});