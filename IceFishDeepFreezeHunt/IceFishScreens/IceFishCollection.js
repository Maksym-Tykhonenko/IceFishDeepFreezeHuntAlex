import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import IceFishLayout from '../IceFishComponents/IceFishLayout';
import { useStore } from '../IceFishStore/iceFishContext';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const IceFishCollection = () => {
  const { fishCollection } = useStore();
  const navigation = useNavigation();

  const filteredFishCollection = [...fishCollection].sort(
    (a, b) => b.weight - a.weight,
  );

  return (
    <IceFishLayout>
      <View style={styles.icefishcont}>
        <Text style={styles.icefishtitle}>Your Fish Collection</Text>

        {filteredFishCollection.length === 0 ? (
          <View>
            <Image
              source={require('../../assets/images/icefishempty.png')}
              style={styles.icefishimage}
            />
            <ImageBackground
              source={require('../../assets/images/icefishonboardbrd.png')}
              style={styles.icefishwelcomeboard}
            >
              <Text style={styles.icefishwelcometext}>No Catches Yet</Text>
              <Text style={styles.icefishwelcomesubtitle}>
                Play a round to start filling your collection — your caught fish
                will appear here as trophies.
              </Text>
            </ImageBackground>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 15,
              justifyContent: 'space-around',
            }}
          >
            {filteredFishCollection.map(fish => (
              <Image
                key={fish.id}
                source={
                  fish.image || require('../../assets/images/icefishcardb.png')
                }
                style={styles.fishImage}
                resizeMode="contain"
              />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.icefishnextbtn}
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../../assets/images/icefishhome.png')} />
      </TouchableOpacity>
    </IceFishLayout>
  );
};

const styles = StyleSheet.create({
  icefishcont: {
    flex: 1,
    paddingTop: height * 0.08,
    alignItems: 'center',
    padding: 20,
  },
  icefishtitle: {
    color: '#000',
    fontSize: 22,
    marginBottom: 29,
    fontFamily: 'Sansation-Bold',
  },
  icefishimage: {
    top: 100,
    alignSelf: 'center',
  },
  icefishwelcometext: {
    fontSize: 22,
    color: '#000',
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
  icefishwelcomeboard: {
    width: 340,
    height: 283,
    justifyContent: 'center',
    alignItems: 'center',
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
  fishImage: { width: 92, height: 130 },
  icefishnextbtn: { marginBottom: 43, marginTop: 10, alignSelf: 'center' },
});

export default IceFishCollection;
