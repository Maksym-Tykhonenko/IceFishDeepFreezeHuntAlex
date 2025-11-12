import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ImageBackground,
  Vibration,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStore } from '../IceFishStore/iceFishContext';
import { iceFishCards } from '../IceFishData/iceFishCards';
import { BlurView } from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';

const IceFishGameplay = () => {
  const store = useStore();
  const iceFishCurrentTool = store?.currentTool ?? {
    name: 'Fishing Rod',
    durability: 10,
    casts: 3,
    image: require('../../assets/images/icefishrod.png'),
  };
  const iceFishCoins = store?.coins ?? 0;
  const iceFishSaveCoins = store?.saveCoins ?? (() => {});
  const iceFishAddToCollection = store?.addToCollection ?? (() => {});
  const iceFishVibrate = store?.vibrate ?? (() => Vibration.vibrate(60));
  const { castsLeft, saveCastsLeft } = store;
  const navigation = useNavigation();
  const [iceFishDurability, setIceFishDurability] = useState(0);
  const [iceFishRoundCards, setIceFishRoundCards] = useState([]);
  const [iceFishRevealedIdx, setIceFishRevealedIdx] = useState([]);
  const [iceFishCatchWeight, setIceFishCatchWeight] = useState(0);
  const [iceFishResultModal, setIceFishResultModal] = useState(null);
  const [iceFishExitModal, setIceFishExitModal] = useState(false);
  const [showIceFishConfetti, setShowIceFishConfetti] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, []),
  );

  const iceFishConfirmExit = () => {
    setIceFishExitModal(false);
    navigation.popToTop();
  };

  const iceFishAvailableWeights = useMemo(
    () =>
      Array.from(new Set(iceFishCards.map(c => c.weight))).sort(
        (a, b) => a - b,
      ),
    [],
  );

  useEffect(() => {
    iceFishGenerateCards();
  }, []);

  useEffect(() => {
    iceFishResetRoundState();
    iceFishGenerateCards();
  }, [iceFishCurrentTool?.name]);

  const iceFishResetRoundState = () => {
    setIceFishDurability(0);
    setIceFishCatchWeight(0);
    setIceFishRevealedIdx([]);
  };

  const iceFishGenerateCards = () => {
    if (iceFishAvailableWeights.length === 0) {
      Alert.alert('No fish cards found', 'Please check iceFishCards data.');
      setIceFishRoundCards([]);
      return;
    }
    const pool = [...iceFishAvailableWeights];
    const chosenWeights = [];
    while (chosenWeights.length < Math.min(4, pool.length)) {
      const rnd = Math.floor(Math.random() * pool.length);
      chosenWeights.push(pool.splice(rnd, 1)[0]);
    }
    const selected = chosenWeights.map(w => {
      const same = iceFishCards.filter(c => c.weight === w);
      const any = same[Math.floor(Math.random() * same.length)];
      return { ...any, revealed: false };
    });
    setIceFishRoundCards(selected);
    iceFishResetRoundState();
  };

  const iceFishRevealCard = index => {
    if (iceFishResultModal || castsLeft <= 0) return;
    if (!iceFishRoundCards[index] || iceFishRoundCards[index].revealed) return;

    const nextCards = iceFishRoundCards.map((c, i) =>
      i === index ? { ...c, revealed: true } : c,
    );
    setIceFishRoundCards(nextCards);

    const newWeight = iceFishCatchWeight + (nextCards[index].weight || 0);
    setIceFishCatchWeight(newWeight);
    setIceFishDurability(newWeight);

    const maxDur = iceFishCurrentTool?.durability ?? 0;

    if (newWeight === maxDur) {
      setTimeout(() => {
        setIceFishResultModal({
          text: `Great job! Your equipment stayed intact. You earned a +10 kg bonus and kept your full catch.
Each kilogram of fish is worth one coin. Use your coins in the shop to buy better fishing equipment.`,
          fish: newWeight,
        });
      }, 300);

      setShowIceFishConfetti(true);
      setTimeout(() => setShowIceFishConfetti(false), 4000);
      iceFishSaveCoins((iceFishCoins ?? 0) + 10);
      const caughtCard = nextCards[index];
      iceFishAddToCollection(caughtCard);
      return;
    }

    if (newWeight > maxDur) {
      iceFishVibrate();
      setIceFishResultModal({
        text: 'Your equipment broke right away — tough luck! You caught 0 kg of fish this time.',
        fish: 0,
      });
      return;
    }

    setIceFishRevealedIdx(prev => [...prev, index]);
  };

  const iceFishCollectCatch = () => {
    if (iceFishResultModal) return;

    let modalText = '';
    let fishKept = iceFishCatchWeight;

    const strongEnough =
      iceFishDurability <= (iceFishCurrentTool?.durability ?? 0);
    const maxDur = iceFishCurrentTool?.durability ?? 0;

    // находим последнюю открытую карточку (чтобы знать, какую именно рыбу поймал)
    const lastRevealed = [...iceFishRoundCards].reverse().find(c => c.revealed);

    if (strongEnough && iceFishCatchWeight > 0 && lastRevealed) {
      modalText =
        'Great job! You earned +10 bonus coins and kept your full catch.';
      iceFishAddToCollection(lastRevealed);
      setIceFishResultModal({ text: modalText, fish: fishKept });
      return;
    }

    if (
      !strongEnough &&
      iceFishCatchWeight > 0 &&
      iceFishDurability > maxDur &&
      lastRevealed
    ) {
      modalText = `Your equipment couldn’t handle the weight. You still managed to bring back part of your catch.
Each kilogram of fish is worth one coin. Use your coins in the shop to buy better fishing equipment.`;
      iceFishAddToCollection(lastRevealed);
      setIceFishResultModal({ text: modalText, fish: fishKept });
      return;
    }

    if (!strongEnough && fishKept === 0) {
      modalText =
        'Your equipment broke right away — tough luck! You caught 0 kg of fish this time.';

      const nextCasts = castsLeft - 1;
      if (nextCasts <= 0) {
        saveCastsLeft(0);
        setIceFishResultModal({
          text: 'No casts left. Deliver your catch in the shop!',
          fish: 0,
        });
        return;
      }

      saveCastsLeft(nextCasts);
      setIceFishResultModal({ text: modalText, fish: 0 });
      return;
    }

    setIceFishResultModal({
      text: 'No fish to collect this time.',
      fish: 0,
    });
  };

  const iceFishNextRound = () => {
    const brokeInstantly = iceFishResultModal?.text?.includes(
      'Your equipment broke right away — tough luck!',
    );

    let nextCasts = castsLeft;
    if (brokeInstantly) {
      nextCasts = castsLeft - 1;
    }

    setIceFishResultModal(null);

    if (nextCasts <= 0) {
      saveCastsLeft(0);
      setIceFishResultModal({
        text: 'No casts left. Deliver your catch in the shop!',
        fish: 0,
      });
      return;
    }

    saveCastsLeft(nextCasts);
    iceFishGenerateCards();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/icefishgameback.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            top: 70,
            left: 20,
            gap: 8,
          }}
        >
          <Image source={require('../../assets/images/icefishicon.png')} />
          <Text style={iceFishStyles.iceFishCatchWeightText}>
            X {iceFishCatchWeight}
          </Text>
        </View>

        <View style={iceFishStyles.iceFishContainer}>
          <Image
            source={iceFishCurrentTool.image}
            style={iceFishStyles.iceFishTool}
          />

          <View style={iceFishStyles.iceFishBarContainer}>
            <Text style={iceFishStyles.iceFishBarText}>Durability Bar</Text>
            <View style={iceFishStyles.iceFishBarBackground}>
              <View
                style={[
                  iceFishStyles.iceFishBarFill,
                  {
                    width: `${Math.min(
                      (iceFishDurability /
                        (iceFishCurrentTool?.durability ?? 1)) *
                        100,
                      100,
                    )}%`,
                    backgroundColor:
                      iceFishDurability > (iceFishCurrentTool?.durability ?? 0)
                        ? '#FF5C5C'
                        : '#8FEFFF',
                  },
                ]}
              />
              <Text style={iceFishStyles.iceFishBarTextDur}>
                {iceFishDurability}/{iceFishCurrentTool?.durability ?? 0}
              </Text>
            </View>
          </View>

          <Text style={iceFishStyles.iceFishCasts}>
            Casts Left: {castsLeft}
          </Text>
          <Text style={iceFishStyles.iceFishWarning}>
            Be careful — don’t exceed your tool’s durability.
          </Text>

          <View style={iceFishStyles.iceFishCardsRow}>
            {iceFishRoundCards.map((card, i) => (
              <TouchableOpacity
                key={card?.id ?? i}
                onPress={() => iceFishRevealCard(i)}
                activeOpacity={0.8}
              >
                <Image
                  source={
                    card?.revealed
                      ? card.image
                      : require('../../assets/images/icefishcardb.png')
                  }
                  style={iceFishStyles.iceFishCard}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={iceFishCollectCatch}
            disabled={iceFishCatchWeight === 0}
          >
            <ImageBackground
              source={require('../../assets/images/icefishbtnsmall.png')}
              style={[
                iceFishStyles.iceFishCollectBtn,
                iceFishCatchWeight === 0 && { opacity: 0.5 },
              ]}
            >
              <Text style={iceFishStyles.iceFishCollectText}>
                Collect Catch
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={iceFishStyles.iceFishNextBtn}
            onPress={() => setIceFishExitModal(true)}
          >
            <Image source={require('../../assets/images/icefishhome.png')} />
          </TouchableOpacity>

          <Modal
            visible={!!iceFishResultModal}
            transparent
            animationType="fade"
          >
            {Platform.OS === 'ios' && (
              <BlurView
                style={iceFishStyles.iceFishBlur}
                blurType="light"
                blurAmount={2}
              />
            )}
            <View style={iceFishStyles.iceFishModalOverlay}>
              <ImageBackground
                source={require('../../assets/images/icefishmodal.png')}
                style={iceFishStyles.iceFishModalBox}
              >
                <View>
                  <Text style={iceFishStyles.iceFishModalText}>
                    {iceFishResultModal?.text}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 25,
                      gap: 5,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/icefishicon.png')}
                    />
                    <Text style={iceFishStyles.iceFishModalFish}>
                      X {iceFishResultModal?.fish ?? 0}
                    </Text>
                  </View>
                </View>
                {showIceFishConfetti && (
                  <Image
                    source={require('../../assets/images/icefishаfirework.gif')}
                    style={{
                      position: 'absolute',
                      top: 20,
                    }}
                  />
                )}
              </ImageBackground>

              <View style={iceFishStyles.iceFishNextBtns}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={iceFishStyles.iceFishNextBtn}
                  onPress={() => navigation.popToTop()}
                >
                  <Image
                    source={require('../../assets/images/icefishhome.png')}
                  />
                </TouchableOpacity>

                {iceFishResultModal?.text !==
                  'No casts left. Deliver your catch in the shop!' && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={iceFishStyles.iceFishNextBtn}
                    onPress={iceFishNextRound}
                  >
                    <Image
                      source={require('../../assets/images/icefishrestart.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>

          <Modal
            visible={iceFishExitModal}
            transparent
            animationType="fade"
            statusBarTranslucent={Platform.OS === 'android'}
          >
            {Platform.OS === 'ios' && (
              <BlurView
                style={iceFishStyles.iceFishBlur}
                blurType="light"
                blurAmount={2}
              />
            )}
            <View style={iceFishStyles.iceFishModalOverlay}>
              <ImageBackground
                source={require('../../assets/images/icefishexitmodal.png')}
                style={iceFishStyles.iceFishModalExitBox}
              >
                <Text style={iceFishStyles.iceFishModalText}>
                  Are you sure you want to quit and release all the fish you’ve
                  caught?
                </Text>
              </ImageBackground>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                  gap: 50,
                }}
              >
                <TouchableOpacity
                  onPress={iceFishConfirmExit}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../assets/images/icefishno.png')}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIceFishExitModal(false)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../assets/images/icefishyes.png')}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const iceFishStyles = StyleSheet.create({
  iceFishContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iceFishTool: { position: 'absolute', left: 30, top: 200 },
  iceFishBarContainer: { width: '80%', alignItems: 'center', height: 50 },
  iceFishBarText: {
    color: '#101010',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  iceFishBarTextDur: {
    color: '#101010',
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
    position: 'absolute',
    width: '100%',
  },
  iceFishBarBackground: {
    width: '100%',
    height: 23,
    borderRadius: 13,
    backgroundColor: '#17BEDA',
    padding: 4,
    overflow: 'hidden',
  },
  iceFishBarFill: { height: '100%', borderRadius: 13 },
  iceFishCasts: {
    color: '#101010',
    marginTop: 22,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
  },
  iceFishWarning: {
    color: '#101010',
    marginTop: 16,
    marginBottom: 18,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
  },
  iceFishCatchWeightText: {
    color: '#101010',
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    fontSize: 18,
  },
  iceFishCardsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  iceFishCard: { width: 70, height: 100 },
  iceFishNextBtn: { marginBottom: 43, marginTop: 10 },
  iceFishCollectBtn: {
    width: 169,
    height: 49,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iceFishCollectText: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Sansation-Bold',
  },
  iceFishModalOverlay: {
    flex: 1,
    backgroundColor: '#0000009c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iceFishModalBox: {
    width: 349,
    height: 283,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iceFishModalExitBox: {
    width: 309,
    height: 203,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iceFishModalText: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  iceFishModalFish: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
  iceFishNextBtns: { flexDirection: 'row', marginTop: 20, gap: 40 },
  iceFishBlur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

export default IceFishGameplay;
