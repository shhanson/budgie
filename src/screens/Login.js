import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { Button } from '../components/common';


const Login = () => (
    <View style={styles.loginView}>

      <Image style={styles.loginImage} source={{ uri: 'https://via.placeholder.com/120x120' }} />
      <TextInput style={styles.inputStyle} placeholder='Email' />
      <TextInput style={styles.inputStyle} secureTextEntry placeholder='Password' />

      <Button
        style={styles.loginBtn}
        onPress={() => console.log('Login button pressed')}
      >
        Login
      </Button>

      <Button
        style={styles.googleBtn}
        onPress={() => console.log('Login with google pressed')}
      >
        Login with Google
      </Button>

      <Button
        style={styles.facebookBtn}
        textStyle={styles.facebookBtnText}
        onPress={() => console.log('Login with facebook pressed')}
      >
        Login with Facebook
      </Button>

    </View>

  );


const styles = {
  loginView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loginImage: {
    height: 120,
    width: 120,
  },
  inputStyle: {
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10
  },
  loginBtn: {
    backgroundColor: '#ffff00',
  },
  facebookBtn: {
    backgroundColor: '#0000ff',
  },
  facebookBtnText: {
    color: '#fff',
  },
  googleBtn: {
    backgroundColor: '#00ff00',
  },
};

export default Login;
