import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IceFishLayout from '../IceFishComponents/IceFishLayout';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../IceFishStore/iceFishContext';
import { useCallback, useEffect, useState } from 'react';
import Sound from 'react-native-sound';

const IceFishMain = () => {
  const navigation = useNavigation();
  const {
    toggleIceFishVibration,
    setToggleIceFishVibration,
    toggleIceFishSound,
    setToggleIceFishSound,
    volume,
  } = useStore();
  const [iceFishTrack, setIceFishTrack] = useState(0);
  const [sound, setSound] = useState(null);
  const iceFishTracks = [
    'upbeat-christmas-music-271546.mp3',
    'upbeat-christmas-music-271546.mp3',
  ];

  useEffect(() => {
    playIceFishTrack(iceFishTrack);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [iceFishTrack]);

  const playIceFishTrack = index => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const trackPath = iceFishTracks[index];

    const newIceFishSound = new Sound(trackPath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('error', error);
        return;
      }

      newIceFishSound.play(success => {
        if (success) {
          console.log('✅');
          setIceFishTrack(prevIndex => (prevIndex + 1) % iceFishTracks.length);
        } else {
          console.log('error');
        }
      });
      setSound(newIceFishSound);
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadBgGameMusic();
      loadGameVibration();
    }, []),
  );

  useEffect(() => {
    const setVolumeBasedOnGameMusic = async () => {
      try {
        const musicValue = await AsyncStorage.getItem('icefishsound');

        const isGameBgMusicOn = JSON.parse(musicValue);
        setToggleIceFishSound(isGameBgMusicOn);
        if (sound) {
          sound.setVolume(isGameBgMusicOn ? volume : 0);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };

    setVolumeBasedOnGameMusic();
  }, [sound, volume]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(toggleIceFishSound ? volume : 0);
    }
  }, [volume, toggleIceFishSound]);

  const loadBgGameMusic = async () => {
    try {
      const musicValue = await AsyncStorage.getItem('icefishsound');

      const isGameBgMusicOn = JSON.parse(musicValue);
      setToggleIceFishSound(isGameBgMusicOn);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const loadGameVibration = async () => {
    try {
      const vibrValue = await AsyncStorage.getItem('icefishvibration');
      if (vibrValue !== null) {
        const isVibrationOn = JSON.parse(vibrValue);

        setToggleIceFishVibration(isVibrationOn);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleVibration = async value => {
    try {
      await AsyncStorage.setItem('icefishvibration', JSON.stringify(value));
      setToggleIceFishVibration(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const toggleBgMusic = async value => {
    try {
      await AsyncStorage.setItem('icefishsound', JSON.stringify(value));
      setToggleIceFishSound(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <IceFishLayout>
      <View style={styles.icefishcontainer}>
        <Image
          source={require('../../assets/images/icefishloader.png')}
          style={styles.icefishimage}
        />

        <View style={styles.icefishbtns}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('IceFishGameIntro')}
          >
            <ImageBackground
              source={require('../../assets/images/icefishbtn.png')}
              style={styles.icefishbtn}
            >
              <Text style={styles.icefishwelcometext}>Play</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('IceFishShop')}
          >
            <ImageBackground
              source={require('../../assets/images/icefishbtn.png')}
              style={styles.icefishbtn}
            >
              <Text style={styles.icefishwelcometext}>Shop</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('IceFishCollection')}
          >
            <ImageBackground
              source={require('../../assets/images/icefishbtn.png')}
              style={styles.icefishbtn}
            >
              <Text style={styles.icefishwelcometext}>Collection</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.icefishnextbtns}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => toggleBgMusic(!toggleIceFishSound)}
          >
            {toggleIceFishSound ? (
              <Image source={require('../../assets/images/icefishmuson.png')} />
            ) : (
              <Image source={require('../../assets/images/icefishmus.png')} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              Linking.openURL(
                'https://apps.apple.com/us/app/ice-fish-deep-freeze-hunt/id6755144517',
              )
            }
          >
            <Image source={require('../../assets/images/icefishshr.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => toggleVibration(!toggleIceFishVibration)}
          >
            {toggleIceFishVibration ? (
              <Image
                source={require('../../assets/images/icefishvibron.png')}
              />
            ) : (
              <Image source={require('../../assets/images/icefishvibr.png')} />
            )}
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
  },
  icefishbtn: {
    width: 240,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icefishwelcometext: {
    fontSize: 22,
    color: '#000',
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
  icefishnextbtns: {
    flexDirection: 'row',
    marginTop: 50,
    marginBottom: 43,
    gap: 26,
  },
  icefishbtns: {
    gap: 5,
    marginTop: 50,
  },
});

export default IceFishMain;
