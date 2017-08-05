import React from 'react';
import { View, Image } from 'react-native';

const Splash = () => (
    <View style={styles.splashView}>
        <Image
          alt='budgie'
          source={{ uri: 'https://via.placeholder.com/215x215' }}
          style={styles.splashImage}
        />
    </View>
  );


const styles = {
  splashView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 200,
  },

  splashImage: {
    width: 215,
    height: 215,
  },
};


export default Splash;
