import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../components/common';


class Home extends Component {

  static navigationOptions = {
    title: 'Home',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Hello, home!</Text>
        <Button onPress={() => navigate('Graph')}>
          Click to view graph!
        </Button>
      </View>
    );
  }
}

export default Home;
