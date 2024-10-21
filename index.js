import React, { useRef } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const settingChartScript = `
	Chart.defaults.global.defaultFontSize={DEFAULT_FONT_SIZE};
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {CONFIG});
`;

const Chart = ({ chartConfiguration, defaultFontSize = 12, scaleToFit = true, scrollEnabled = false, injectJSBeforeChart = '' }) => {
	const webviewRef = useRef(null);

	const getJSToInject = () => {
		return `
          (function() {
              ${injectJSBeforeChart}
              ${settingChartScript.replace('{CONFIG}', chartConfiguration).replace('{DEFAULT_FONT_SIZE}', defaultFontSize)}
          })();
        `;
	};

	const androidLayerType = Platform.OS === 'android' ? 'hardware' : 'none';

	return (
		<WebView
			style={{ flex: 1 }}
			useWebKit={true}
			originWhitelist={['*']}
			ref={webviewRef}
			source={Platform.OS === 'ios' ? require('./dist/index.html') : { uri: 'file:///android_asset/index.html' }}
			onError={(error) => {
				console.error('WebView Error: ', error);
			}}
			onLoadEnd={() => {
				if (chartConfiguration || defaultFontSize || injectJSBeforeChart) {
					if (webviewRef.current) {
						webviewRef.current.injectJavaScript(getJSToInject());
					}
				}
			}}
			scalesPageToFit={Platform.OS !== 'ios' && scaleToFit}
			scrollEnabled={scrollEnabled}
			bounces={false}
			androidLayerType={androidLayerType}
		/>
	);
};

Chart.propTypes = {
	chartConfiguration: PropTypes.string.isRequired,
	defaultFontSize: PropTypes.number,
	injectJSBeforeChart: PropTypes.string,
	scaleToFit: PropTypes.bool,
	scrollEnabled: PropTypes.bool,
};

export default Chart;