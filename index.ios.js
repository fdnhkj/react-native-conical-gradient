import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import Main from './Main';

export default class ConicalGradient extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Main />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('ConicalGradient', () => ConicalGradient);
