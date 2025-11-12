import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IceFishLayout from '../IceFishComponents/IceFishLayout';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const IceFishWelcome = () => {
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const navigation = useNavigation();

  return (
    <IceFishLayout>
      <View style={styles.icefishcontainer}>
        {welcomeIndex === 0 && (
          <Image
            source={require('../../assets/images/icefishonboard1.png')}
            style={styles.icefishimage}
          />
        )}
        {welcomeIndex === 1 && (
          <Image
            source={require('../../assets/images/icefishonboard2.png')}
            style={styles.icefishimage}
          />
        )}
        {welcomeIndex === 2 && (
          <Image
            source={require('../../assets/images/icefishonboard3.png')}
            style={styles.icefishimage}
          />
        )}
        {welcomeIndex === 3 && (
          <Image
            source={require('../../assets/images/icefishonboard4.png')}
            style={styles.icefishimage}
          />
        )}
        <ImageBackground
          source={require('../../assets/images/icefishonboardbrd.png')}
          style={styles.icefishwelcomeboard}
        >
          <Text style={styles.icefishwelcometext}>
            {welcomeIndex === 0 && 'Welcome to the Ice'}
            {welcomeIndex === 1 && 'How It Works'}
            {welcomeIndex === 2 && 'Your Gear'}
            {welcomeIndex === 3 && 'Earn & Upgrade'}
          </Text>
          <Text style={styles.icefishwelcomesubtitle}>
            {welcomeIndex === 0 &&
              'The Arctic is waiting. Every catch counts—but one wrong move can break your gear and end the hunt.'}
            {welcomeIndex === 1 &&
              'You have four cards under the ice. Each hides a fish weighing between 2 and 10 kilograms. Flip, count, and decide when to stop.'}
            {welcomeIndex === 2 &&
              'Each tool has a limit. Push it too far and it breaks, taking your entire catch with it. Choose wisely when to secure your haul.'}
            {welcomeIndex === 3 &&
              'Every kilogram equals a coin. Use your earnings to unlock stronger equipment and chase even bigger fish next time.'}
          </Text>
        </ImageBackground>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.icefishnextbtn}
          onPress={() => {
            if (welcomeIndex < 3) {
              setWelcomeIndex(welcomeIndex + 1);
            } else {
              navigation.replace('IceFishMain');
            }
          }}
        >
          <Image source={require('../../assets/images/icefishnext.png')} />
        </TouchableOpacity>
      </View>
    </IceFishLayout>
  );
};

const styles = StyleSheet.create({
  icefishcontainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  icefishwelcomeboard: {
    width: 340,
    height: 283,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icefishnextbtn: {
    marginBottom: 43,
    marginTop: 23,
  },
  icefishimage: {
    top: 20,
    zIndex: 2,
  },
  icefishwelcometext: {
    fontSize: 22,
    color: '#000',
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
  icefishwelcomesubtitle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
    marginTop: 20,
    marginHorizontal: 30,
    fontStyle: 'italic',
  },
});

export default IceFishWelcome;
