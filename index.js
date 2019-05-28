import React, {
	Component,
} from 'react';
import {
	StyleSheet,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';
/**
 * 渲染图表脚本的模版，设置时将CONFIG参数替换成对应的值
 * @type {[string]}
 */
var settingChartScript = `
	Chart.defaults.global.defaultFontSize={DEFAULT_FONT_SIZE};
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart( ctx, {CONFIG} );
`;

export default class Chart extends Component {

	static propTypes = {
		/**
		 * 图表配置参数，对应chart.js中初始化需要的参数
		 * @type {[object]}
		 */
		chartConfiguration: PropTypes.string,
		defaultFontSize : PropTypes.number,
    injectJSBeforeChart: PropTypes.string,
	}


	constructor(props) {
		super(props);
	}


	componentWillReceiveProps(nextProps) {
		if (nextProps.chartConfiguration !== this.props.chartConfiguration
		|| nextProps.defaultFontSize !== this.props.defaultFontSize) {
			this.setChart(nextProps);
		}
	}


  getJSToInject(props) {
    const chartConfiguration = props.chartConfiguration || this.props.chartConfiguration;
    const defaultFontSize = props.defaultFontSize || this.props.defaultFontSize;
    const injectJSBeforeChart = props.injectJSBeforeChart || this.props.injectJSBeforeChart;

    let injectJS = '';

    if (injectJSBeforeChart)
      injectJS += props.injectJSBeforeChart;

    injectJS += settingChartScript.replace('{CONFIG}', chartConfiguration).replace('{DEFAULT_FONT_SIZE}', defaultFontSize)

    return injectJS;
  }


	setChart(nextProps) {
		if (!nextProps.chartConfiguration || undefined == nextProps.defaultFontSize || null == nextProps.defaultFontSize)
			return;

		this.webview && this.webview.injectJavaScript(this.getJSToInject(nextProps));
	}


	render() {
    const scrollEnabled = this.props.scrollEnabled !== undefined ? this.props.scrollEnabled : true;
    const scaleToFit = this.props.scaleToFit !== undefined ? this.props.scaleToFit : true;
    const injectJS = this.getJSToInject(this.props);
		return (
      <WebView style={{ flex : 1 }}
        useWebKit={true}
  			originWhitelist={["*"]}
  			ref = {
  				ref => this.webview = ref
  			}
  			injectedJavaScript = {
  			   injectJS
  			}
  			source= {Platform.OS == 'ios' ? require('./dist/index.html') : {uri: "file:///android_asset/index.html"}}


  			onError = {
  				(error) => {
  					console.log(error)
  				}
  			}
  			// scalesPageToFit false for IOS and true for Android
        scalesPageToFit={Platform.OS === 'ios' ? undefined : scaleToFit}
        scrollEnabled={ scrollEnabled }
        bounces={false}
      />
		)
	}

}
