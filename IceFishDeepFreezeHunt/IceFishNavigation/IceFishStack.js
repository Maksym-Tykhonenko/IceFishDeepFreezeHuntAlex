import { createStackNavigator } from '@react-navigation/stack';
import IceFishWelcome from '../IceFishScreens/IceFishWelcome';
import IceFishMain from '../IceFishScreens/IceFishMain';
import IceFishGameIntro from '../IceFishScreens/IceFishGameIntro';
import IceFishGameplay from '../IceFishScreens/IceFishGameplay';
import IceFishShop from '../IceFishScreens/IceFishShop';
import IceFishCollection from '../IceFishScreens/IceFishCollection';

const Stack = createStackNavigator();

const IceFishStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IceFishWelcome" component={IceFishWelcome} />
      <Stack.Screen name="IceFishMain" component={IceFishMain} />
      <Stack.Screen name="IceFishGameIntro" component={IceFishGameIntro} />
      <Stack.Screen name="IceFishGameplay" component={IceFishGameplay} />
      <Stack.Screen name="IceFishShop" component={IceFishShop} />
      <Stack.Screen name="IceFishCollection" component={IceFishCollection} />
    </Stack.Navigator>
  );
};

export default IceFishStack;
