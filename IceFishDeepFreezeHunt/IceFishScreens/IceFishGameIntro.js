import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IceFishLayout from '../IceFishComponents/IceFishLayout';
import { useNavigation } from '@react-navigation/native';

const IceFishGameIntro = () => {
  const navigation = useNavigation();

  return (
    <IceFishLayout>
      <View style={styles.icefishcontainer}>
        <Image
          source={require('../../assets/images/icefishonboard1.png')}
          style={styles.icefishimage}
        />
        <ImageBackground
          source={require('../../assets/images/icefishonboardbrd.png')}
          style={styles.icefishwelcomeboard}
        >
          <Text style={styles.icefishwelcomesubtitle}>
            Welcome to the Arctic. Beneath the ice lie four cards — each one a
            hidden catch waiting to be revealed. Flip the cards, count the
            weight, and decide when to stop. Catch too much and your gear breaks
            — you lose everything. Play smart, take your time, and collect as
            many coins as you can before the ice gives way.
          </Text>
        </ImageBackground>
        <View style={styles.icefishnextbtns}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.icefishnextbtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/images/icefishhome.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.icefishnextbtn}
            onPress={() => navigation.navigate('IceFishGameplay')}
          >
            <Image source={require('../../assets/images/icefishnext.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </IceFishLayout>
  );
};

const styles = StyleSheet.create({
  icefishcontainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingHorizontal: 30,
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
  icefishwelcomesubtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
    marginTop: 20,
    marginHorizontal: 35,
    fontStyle: 'italic',
  },
  icefishnextbtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default IceFishGameIntro;
