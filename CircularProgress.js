import React, { PropTypes, Component } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Defs, Stop, G, Path, LinearGradient } from 'react-native-svg';
import {arc} from 'd3-shape';
import range from 'lodash/range';

function  calculateStopColor(i) {
  return [
    Math.round(beginColor[0] + (endColor[0] - beginColor[0]) * i / noOfSeg),
    Math.round(beginColor[1] + (endColor[1] - beginColor[1]) * i / noOfSeg),
    Math.round(beginColor[2] + (endColor[2] - beginColor[2]) * i / noOfSeg)
  ];
}

const beginColor = [0x37,0xba,0xd6];
const endColor = [0x90,0x53,0x87];
const noOfSeg = 6;
const LINEAR_GRADIENT_PREFIX_ID = 'gradientRing';
const r1 = 90;
const r2 = 100;

export default class CircularProgress extends Component {

  renderLinearGradients() {
    let startColor = beginColor;
    let stopColor = calculateStopColor(1);
    let startAngle = 0;
    let stopAngle = (2 * Math.PI) / noOfSeg;

    return range(1, noOfSeg + 1).map(i =>  {
      const linearGradient = (
        <LinearGradient
          id={LINEAR_GRADIENT_PREFIX_ID + i}
          key={LINEAR_GRADIENT_PREFIX_ID + i}
          x1={r1 * Math.sin(startAngle)}
          y1={-r1 * Math.cos(startAngle)}
          x2={r1 * Math.sin(stopAngle)}
          y2={-r1 * Math.cos(stopAngle)}
        >
          <Stop offset="0" stopColor={"rgb(" + startColor.join(',') + ")"} />
          <Stop offset="1" stopColor={"rgb(" + stopColor.join(',') + ")"} />
        </LinearGradient>
      );
      startColor = stopColor;
      stopColor = calculateStopColor(i + 1);
      startAngle = stopAngle;
      stopAngle += (2 * Math.PI) / noOfSeg;

      return linearGradient;
    });
  }

  extractFill() {
    return Math.min(100, Math.max(0, this.props.fill));
  }

  renderBackgroundPath() {
    const {size, width, backgroundColor} = this.props;
    const backgroundPath = arc()
      .innerRadius(r1)
      .outerRadius(r2)
      .startAngle(0)
      .endAngle(2 * Math.PI);
    
    return (
      <Path
        x={size / 2}
        y={size / 2}
        d={backgroundPath()}
        fill={backgroundColor}
      />
    );
  }

  renderCirclePaths() {
    const fill = this.extractFill();

    let numberOfPathsToDraw = Math.floor(
      ((2 * Math.PI) * (fill / 100)) / ((2 * Math.PI) / noOfSeg)
    );
    let rem = (((2 * Math.PI) * (fill / 100)) / ((2 * Math.PI) / noOfSeg)) % 1;
    if(rem > 0) {
      numberOfPathsToDraw++;
    }
    let startAngle = 0;
    let stopAngle = - (2 * Math.PI) / noOfSeg;

    return range(1, numberOfPathsToDraw + 1).map(i => {
      if(i === numberOfPathsToDraw && rem) {
        stopAngle = -2 * Math.PI * (fill / 100);
      }
      const circlePath = arc()
          .innerRadius(r1)
          .outerRadius(r2)
          .startAngle(startAngle)
          .endAngle(stopAngle - 0.005);

      const path = (
        <Path
          x={this.props.size / 2}
          y={this.props.size / 2}
          key={fill + i}
          d={circlePath()}
          fill={'url(#' + LINEAR_GRADIENT_PREFIX_ID + (noOfSeg - i + 1) + ')'}
        />
      );
      startAngle = stopAngle;
      stopAngle -= ((2 * Math.PI) /noOfSeg);
      
      return path;
    });
  }

  render() {
    const {size, rotation, style, children} = this.props;
    const fill = this.extractFill();

    return (
      <View style={style}>
        <Svg
          width={size}
          height={size}
        >
          <Defs>
            {this.renderLinearGradients()}
          </Defs>
          <G rotate={rotation - 90}>
            {this.renderBackgroundPath()}
            {this.renderCirclePaths()}
          </G>
        </Svg>
        {children && children(fill)}
      </View>
    );
  }
}

CircularProgress.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.func,
  fill: PropTypes.number.isRequired,
  rotation: PropTypes.number,
  size: PropTypes.number.isRequired,
  style: View.propTypes.style,
  tintColor: PropTypes.string,
  width: PropTypes.number.isRequired,
  linecap: PropTypes.string
};

CircularProgress.defaultProps = {
  tintColor: 'black',
  backgroundColor: '#e4e4e4',
  rotation: 90,
  linecap: 'butt'
};
