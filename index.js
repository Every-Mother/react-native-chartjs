import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';
const settingChartScript = `
	Chart.defaults.global.defaultFontSize={DEFAULT_FONT_SIZE};
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart( ctx, {CONFIG} );
`;

const Chart = ({ chartConfiguration, defaultFontSize, scaleToFit, scrollEnabled, injectJSBeforeChart }) => {
	const webviewRef = useRef(null);

	useEffect(() => {
		webviewRef.current && webviewRef.current.injectJavaScript(getJSToInject());
	}, [chartConfiguration, defaultFontSize, defaultFontSize]);

	const getJSToInject = () => {
		let injectJS = '';

		if (injectJSBeforeChart) {
			injectJS += injectJSBeforeChart;
		}

		injectJS += settingChartScript.replace('{CONFIG}', chartConfiguration).replace('{DEFAULT_FONT_SIZE}', defaultFontSize);

		return injectJS;
	};

	return (
		<WebView
			style={{ flex: 1 }}
			useWebKit={true}
			originWhitelist={['*']}
			ref={webviewRef}
			injectedJavaScript={getJSToInject()}
			source={Platform.OS === 'ios' ? require('./dist/index.html') : { uri: 'file:///android_asset/index.html' }}
			onError={(error) => {
				console.log(error);
			}}
			// scalesPageToFit false for IOS and true for Android
			scalesPageToFit={Platform.OS !== 'ios' && scaleToFit}
			scrollEnabled={scrollEnabled}
			bounces={false}
		/>
	);
};

Chart.propTypes = {
	chartConfiguration: PropTypes.string,
	defaultFontSize: PropTypes.number,
	injectJSBeforeChart: PropTypes.string,
	scaleToFit: PropTypes.bool,
	scrollEnabled: PropTypes.bool,
};

export default Chart;
