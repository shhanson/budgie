import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Home from './src/screens/Home';
import Graph from './src/screens/Graph';

const App = StackNavigator({
  Home: { screen: Home },
  Graph: { screen: Graph },
});

AppRegistry.registerComponent('budgie', () => App);
