import React from 'react';
import { Text, View } from 'react-native';

const Header = ({ headerText }) => (
    <View>
      <Text>
        {headerText}
      </Text>
    </View>
  );

export { Header };
