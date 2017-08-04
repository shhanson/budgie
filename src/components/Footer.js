import React from 'react';
import { View, Text } from 'react-native';

const Footer = (props) => (
      <View>
        <Text style={styles.linkText}> {props.links[0]} | {props.links[1]}</Text>
      </View>
    );

const styles = {
  linkText: {
    color: 'blue',
  },
};

export default Footer;
