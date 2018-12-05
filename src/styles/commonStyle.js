//Base style for the views and components
import { themeColors } from './themeVariables';

export const commonStyle = {
    container: {
     margin: "2%"
    },
    content: {
      justifyContent: 'center',
      alignItems: 'center',
      width: "100%",
    },
    logo: {
      width: 200, 
      height: 200,
      marginTop: "30%",
      alignSelf: "center",
    },
    button: {
      margin: 10,
      minHeight: 45,
    },
    listButtons: {
      margin: 5,
      minHeight: 45,
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 14,
    },
    darkButtonText: {
      color: "#000",
      textAlign: "center",
      fontSize: 14,
    },
    //highlighted text, with logo font
    highlightedText: {
        fontFamily: 'Atma-SemiBold',
        color: themeColors.secondaryColor,
        margin: '2%',
        textAlign: 'center',
        fontSize: 28,
    },
    //header with logo font 
    header: {
        fontSize: 35,
        fontFamily: 'Atma-SemiBold',
        color: '#FFDE59',
    },
    gameFeedback: {
      fontSize: 35,
      fontFamily: 'Atma-SemiBold',
      color: '#FFDE59',
      margin: '2%',
      textAlign: 'center',
    },
    listHeader: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    //style for linear gradient of the button
    linearGradient: {
      margin: 0,
      padding: 15, 
      alignItems: 'center', 
      borderRadius: 5,
      width: "100%",
    },
    linearGradientForAnswers: {
      padding: 15, 
      alignItems: 'center', 
      borderRadius: 5,
      width: "100%",
    },
    form: {
      marginRight: "2%",
    },
  };