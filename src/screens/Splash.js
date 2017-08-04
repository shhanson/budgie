import React from 'react';
import { View, Image } from 'react-native';
import Footer from '../components/Footer';

const Splash = () => (
    <View style={styles.splashView}>
        <Image
          alt='budgie'
          source={{ uri: 'https://via.placeholder.com/215x215' }}
          style={styles.splashImage}
        />
      <Footer links={footerLinks} />
    </View>
  );

const footerLinks = [
  'Sign up',
  'Login'
];

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
