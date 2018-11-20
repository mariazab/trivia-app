import React from 'react';
import { StatusBar, Image, ActivityIndicator } from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { commonStyle } from '../styles/commonStyle';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class LoadingScreen extends React.Component {
    render() {
      return (
        <StyleProvider style={getTheme(material)}>
          <Container>
            <StatusBar hidden={true} />
            <Content style={commonStyle.container}>

              <Grid>
                <Col style={commonStyle.content}>

                  <Row>
                    <Image style={commonStyle.logo} source={require('../../assets/icon.png')} />
                  </Row>

                  <Row>
                    <ActivityIndicator size="large" color="#ffffff" />
                  </Row>

                </Col>
              </Grid>

            </Content>
          </Container>
       </StyleProvider>
        );
      }   
    }