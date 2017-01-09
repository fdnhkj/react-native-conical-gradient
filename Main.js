import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AnimatedCircularProgress from './AnimatedCircularProgress';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {fill: 100};
  }
  render() {
    return (
      <View>
        <AnimatedCircularProgress
          size={200}
          width={10}
          fill={this.state.fill}
          prefill={100}
          tintColor="#8c1df4"
          backgroundColor="#EEECF0"
          linecap="round"
        >
          {
            (fill) => (
              <Text>
                { fill.toFixed(0) } %
              </Text>
            )
          }
        </AnimatedCircularProgress>
        <TouchableOpacity onPress={() => this.setState({fill: this.state.fill - 20})}>
          <Text>Touch</Text>
        </TouchableOpacity>
      </View>
    );
  } 
}
