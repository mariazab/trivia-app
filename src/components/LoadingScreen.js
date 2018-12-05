import React from 'react';
import { StatusBar, Image, ActivityIndicator, ImageBackground } from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { commonStyle } from '../styles/commonStyle';
import { themeColors } from '../styles/themeVariables';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class LoadingScreen extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <ImageBackground source={require('../../assets/background2.png')} style={{width: '100%', height: '100%'}} >
            <StatusBar hidden={true} />
            <Content style={commonStyle.container}>

              <Grid>
                <Col style={commonStyle.content}>

                  <Row>
                    <Image style={commonStyle.logo} source={require('../../assets/icon-transp.png')} />
                  </Row>

                  <Row>
                    <ActivityIndicator size="large" color={themeColors.secondaryColor} />
                  </Row>

                </Col>
              </Grid>

            </Content>
          </ImageBackground>
        </Container>
      </StyleProvider>
    );
  }   
}