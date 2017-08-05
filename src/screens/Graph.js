import React, { Component } from 'react';
import { Text, View } from 'react-native';


class Graph extends Component {

  static navigationOptions = {
    title: 'Look at dat graph',
  };

  render() {
    return (
      <View>
        <Text>Hello, graph!</Text>
      </View>

    );
  }
}

export default Graph;
