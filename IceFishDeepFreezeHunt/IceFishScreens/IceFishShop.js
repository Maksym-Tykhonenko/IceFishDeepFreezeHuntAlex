import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import IceFishLayout from '../IceFishComponents/IceFishLayout';
import { useStore } from '../IceFishStore/iceFishContext';
import { useNavigation } from '@react-navigation/native';
import { iceFishTools } from '../IceFishData/iceFishCards';

const { height } = Dimensions.get('window');

const IceFishShopScreen = () => {
  const {
    coins,
    saveCoins,
    currentTool,
    changeTool,
    fishCollection,
    saveFishCollection,
    saveCastsLeft,
  } = useStore();
  const iceFishNavigation = useNavigation();
  const [iceFishIndex, setIceFishIndex] = useState(
    iceFishTools.findIndex(t => t.name === currentTool?.name) || 0,
  );
  const [showIceFishConfetti, setShowIceFishConfetti] = useState(false);
  const iceFishTool = iceFishTools[iceFishIndex];

  useEffect(() => {
    const totalWeight = (fishCollection || []).reduce(
      (sum, f) => sum + (f?.weight || 0),
      0,
    );

    if ((currentTool?.casts ?? 0) > 0 && totalWeight === 0) {
      saveCastsLeft(prev => {
        if (typeof prev === 'number' && prev <= 0) {
          Alert.alert('You got 3 new casts 🎣');
          return 3;
        }
        return prev;
      });
    }
  }, [fishCollection]);

  const iceFishNextTool = () => {
    setIceFishIndex(prev => (prev + 1) % iceFishTools.length);
  };

  const iceFishPrevTool = () => {
    setIceFishIndex(
      prev => (prev - 1 + iceFishTools.length) % iceFishTools.length,
    );
  };

  const iceFishBuyTool = () => {
    if (iceFishTool.name === currentTool.name) return;

    saveCoins(coins - iceFishTool.cost);
    changeTool(iceFishTool);
    setShowIceFishConfetti(true);
    setTimeout(() => setShowIceFishConfetti(false), 3500);
  };

  const iceFishDeliverOne = () => {
    const totalWeight = fishCollection.reduce(
      (sum, f) => sum + (f.weight || 0),
      0,
    );
    if (totalWeight <= 0) {
      Alert.alert('No fish to deliver 🐟', 'Go fishing first!');
      return;
    }

    const remaining = [...fishCollection];
    let delivered = false;
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].weight > 0) {
        remaining[i].weight -= 1;
        delivered = true;
        break;
      }
    }
    const filtered = remaining.filter(f => f.weight > 0);
    if (delivered) {
      saveCoins(coins + 1);
      saveCastsLeft(currentTool?.casts ?? 3);
      saveFishCollection(filtered);
    }
  };

  const iceFishTotalWeight = fishCollection.reduce(
    (sum, f) => sum + (f.weight || 0),
    0,
  );
  const iceFishOwned = iceFishTool.name === currentTool.name;
  const iceFishAffordable = coins >= iceFishTool.cost || iceFishTool.cost === 0;

  return (
    <IceFishLayout>
      <View style={styles.iceFishContainer}>
        <View style={styles.iceFishTopBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Image
              source={require('../../assets/images/icefishicon.png')}
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.iceFishText}>X {iceFishTotalWeight}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Image
              source={require('../../assets/images/icefishcoin.png')}
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.iceFishText}>X {coins}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.iceFishToolName}>{iceFishTool.name}</Text>

          <View style={styles.iceFishArrowContainer}>
            <TouchableOpacity onPress={iceFishPrevTool} activeOpacity={0.8}>
              <Image
                source={require('../../assets/images/icefishleft.png')}
                style={styles.iceFishArrow}
              />
            </TouchableOpacity>

            <View>
              <ImageBackground
                source={require('../../assets/images/icefishshop.png')}
                style={styles.iceFishCardBg}
                imageStyle={{ borderRadius: 20 }}
              >
                <Image
                  source={iceFishTool.image}
                  style={styles.iceFishToolImage}
                />
                <Text style={styles.iceFishStats}>
                  Durability: {iceFishTool.durability}
                </Text>
                <Text style={styles.iceFishStats}>
                  Casts Qty: {iceFishTool.casts}
                </Text>
                {showIceFishConfetti && (
                  <Image
                    source={require('../../assets/images/icefishconf.gif')}
                    style={{
                      position: 'absolute',
                      top: 20,
                    }}
                  />
                )}
              </ImageBackground>
            </View>

            <TouchableOpacity onPress={iceFishNextTool} activeOpacity={0.8}>
              <Image
                source={require('../../assets/images/icefishright.png')}
                style={styles.iceFishArrow}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.iceFishBuyButton,
              !iceFishAffordable && { opacity: 0.6 },
            ]}
            onPress={iceFishBuyTool}
            disabled={!iceFishAffordable || iceFishOwned}
          >
            <ImageBackground
              source={require('../../assets/images/icefishbtnsmall.png')}
              style={styles.iceFishButtonBg}
            >
              <Text style={styles.iceFishBuyText}>
                {iceFishOwned
                  ? 'Selected'
                  : iceFishTool.cost === 0
                  ? 'Select'
                  : `Buy for ${iceFishTool.cost}`}
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={iceFishDeliverOne}
            activeOpacity={0.8}
            disabled={iceFishTotalWeight <= 0}
          >
            <ImageBackground
              source={require('../../assets/images/icefishbtnsmall.png')}
              style={[
                styles.iceFishButtonBg,
                iceFishTotalWeight <= 0 && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.iceFishDeliverText}>Deliver Catch</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iceFishBackButton}
            onPress={() => iceFishNavigation.goBack('')}
          >
            <Image
              source={require('../../assets/images/icefishhome.png')}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </IceFishLayout>
  );
};

const styles = StyleSheet.create({
  iceFishContainer: {
    flex: 1,
    paddingTop: height * 0.07,
    padding: 20,
  },
  iceFishTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  iceFishText: { color: '#101010', fontSize: 18, fontFamily: 'Sansation-Bold' },
  iceFishCardBg: {
    width: 302,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  iceFishToolImage: { resizeMode: 'contain', marginBottom: 8 },
  iceFishToolName: {
    color: '#000',
    fontSize: 22,
    fontFamily: 'Sansation-Bold',
    marginBottom: 10,
  },
  iceFishStats: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    marginTop: 5,
  },
  iceFishBuyButton: { marginTop: 20 },
  iceFishBuyText: { color: '#000', fontFamily: 'Sansation-Bold', fontSize: 16 },
  iceFishArrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  iceFishArrow: { width: 50, height: 50, resizeMode: 'contain' },
  iceFishButtonBg: {
    width: 169,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iceFishDeliverText: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Sansation-Bold',
  },
  iceFishBackButton: { marginTop: 20 },
});

export default IceFishShopScreen;
