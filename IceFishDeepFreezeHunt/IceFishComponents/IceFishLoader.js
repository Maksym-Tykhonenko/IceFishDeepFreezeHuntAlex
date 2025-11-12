import React from 'react';
import { WebView } from 'react-native-webview';
import { View, Image, StyleSheet } from 'react-native';
import IceFishLayout from './IceFishLayout';

const IceFishLoader = () => {
  const serenityBloomHtmlLoader = `
  <!DOCTYPE html>
    <html>
      <head>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .loader {
            width: 12em;
            height: 1em;
            border-radius: 8px;
            background-color: #47a7ff44;
            overflow: hidden;
          }
          .loader div {
            height: 100%;
            width: 100%;
            border-radius: 8px;
            background-color: #47a7ff;
            animation: width7435 5s linear infinite;
            transform-origin: left;
          }
          @keyframes width7435 {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
        </style>
      </head>
      <body>
        <div class="loader"><div></div></div>
      </body>
    </html>
  `;

  return (
    <IceFishLayout>
      <View style={styles.loadercnt}>
        <Image
          source={require('../../assets/images/icefishloader.png')}
          style={{ bottom: 50 }}
        />
      </View>

      <View style={styles.loaderwrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html: serenityBloomHtmlLoader }}
          style={{ width: 220, height: 100, backgroundColor: 'transparent' }}
          scrollEnabled={false}
        />
      </View>
    </IceFishLayout>
  );
};

const styles = StyleSheet.create({
  loadercnt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 570,
  },
  loaderwrap: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default IceFishLoader;
