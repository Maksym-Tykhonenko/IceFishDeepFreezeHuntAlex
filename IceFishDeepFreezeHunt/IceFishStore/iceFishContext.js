import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Vibration } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export const StoreContext = createContext(undefined);

export const useStore = () => useContext(StoreContext);

export const ContextProvider = ({ children }) => {
  const [toggleIceFishVibration, setToggleIceFishVibration] = useState(false);
  const [toggleIceFishSound, setToggleIceFishSound] = useState(false);
  const [soundLevel, setSoundLevel] = useState(1.0);
  const [coins, setCoins] = useState(0);
  const [currentTool, setCurrentTool] = useState({
    name: 'Fishing Rod',
    durability: 10,
    casts: 3,
    cost: 0,
    image: require('../../assets/images/icefishrod.png'),
  });

  const [fishCollection, setFishCollection] = useState([]);
  const [castsLeft, setCastsLeft] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('ICEFISH_CASTS_LEFT').then(v => {
      if (v) setCastsLeft(Number(v));
      else setCastsLeft(currentTool?.casts ?? 3);
    });
  }, []);

  const saveCastsLeft = async newVal => {
    setCastsLeft(newVal);
    await AsyncStorage.setItem('ICEFISH_CASTS_LEFT', String(newVal));
  };

  useEffect(() => {
    (async () => {
      try {
        const storedCoins = await AsyncStorage.getItem('iceFishCoins');
        const storedTool = await AsyncStorage.getItem('iceFishTool');
        const storedFish = await AsyncStorage.getItem('iceFishCollection');

        if (storedCoins) setCoins(parseInt(storedCoins, 10));
        if (storedTool) setCurrentTool(JSON.parse(storedTool));
        if (storedFish) setFishCollection(JSON.parse(storedFish));
      } catch (err) {
        console.log('Error', err);
      }
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('iceFishCollection').then(storedFish => {
        if (storedFish) setFishCollection(JSON.parse(storedFish));
      });
    }, []),
  );

  const saveCoins = async newCoins => {
    setCoins(newCoins);
    await AsyncStorage.setItem('iceFishCoins', newCoins.toString());
  };

  const changeTool = async tool => {
    setCurrentTool(tool);
    await AsyncStorage.setItem('iceFishTool', JSON.stringify(tool));
  };

  const addToCollection = async newFish => {
    try {
      if (!newFish || !newFish.id || !newFish.weight || !newFish.image) return;

      const fishToSave = {
        id: newFish.id,
        name: newFish.name,
        weight: newFish.weight,
        image: newFish.image,
      };

      const exists = fishCollection.some(f => f.weight === fishToSave.weight);

      const updated = exists
        ? fishCollection.map(f =>
            f.weight === fishToSave.weight ? fishToSave : f,
          )
        : [...fishCollection, fishToSave];

      setFishCollection(updated);
      await AsyncStorage.setItem('iceFishCollection', JSON.stringify(updated));
    } catch (err) {
      console.log('Error saving fish to collection', err);
    }
  };

  const saveFishCollection = async newCollection => {
    setFishCollection(newCollection);
    await AsyncStorage.setItem(
      'iceFishCollection',
      JSON.stringify(newCollection),
    );
  };

  const clearCollection = async () => {
    setFishCollection([]);
    await AsyncStorage.removeItem('iceFishCollection');
  };

  const vibrate = () => {
    if (toggleIceFishVibration) Vibration.vibrate(100);
  };

  const value = {
    toggleIceFishVibration,
    setToggleIceFishVibration,
    toggleIceFishSound,
    setToggleIceFishSound,
    volume: soundLevel,
    setVolume: setSoundLevel,
    coins,
    saveCoins,
    currentTool,
    changeTool,
    fishCollection,
    addToCollection,
    saveFishCollection,
    clearCollection,
    vibrate,
    castsLeft,
    saveCastsLeft,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
