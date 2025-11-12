import { ImageBackground, ScrollView } from 'react-native';

const IceFishLayout = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/icefishback.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default IceFishLayout;
