import React from 'react';
import { AppRegistry } from 'react-native';
<<<<<<< Updated upstream
import Splash from './src/screens/Splash';

const App = () => (
    <Splash />
  );
=======
import { StackNavigator } from 'react-navigation';
import Home from './src/screens/Home';
import Graph from './src/screens/Graph';


const App = StackNavigator({
  Home: { screen: Home },
  Graph: { screen: Graph },
});
>>>>>>> Stashed changes

AppRegistry.registerComponent('budgie', () => App);
