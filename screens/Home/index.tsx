/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  FlatList,
  NativeEventEmitter,
  NativeModules,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {userDataReq, selectUserInfo} from '../../redux/app/Home/slice';
import {RootState} from '../../redux/store';
import {isPending} from '@reduxjs/toolkit';
import {isEnableBioMetric} from '../../redux/app/Auth/slice';

const HomeScreen: () => Node = () => {
  var dispatch = useDispatch();
  // var object: any = [
  //   {name: 'anupama', age: 30},
  //   {name: 'Chahath', age: 4},
  // ];
  const {isBioMetricEnabled} = useSelector((state: RootState) => state.auth);
  console.log('status of biometric id', isBioMetricEnabled);

  useEffect(() => {
    authenticateDevice();
    var params = {email: 'some email', password: '1234'};
    dispatch(userDataReq(params));
    //storeData();
  }, [dispatch]);

  var storeData = async () => {
    try {
      const jsonValue = JSON.stringify(object);

      await AsyncStorage.setItem('Anupama', jsonValue);
    } catch (error) {
      // Error saving data
    }
  };

  const getData = async () => {
    try {
      const objectData = await AsyncStorage.getItem('Anupama');
      console.log('get data returns:', objectData);
      return objectData != null ? JSON.parse(objectData) : null;
    } catch (e) {
      // error reading value
    }
  };
  async function authenticateDevice() {
    console.log(isBioMetricEnabled);
    if (isBioMetricEnabled) {
      NativeModules.SecurityModule.authenticateDevice();
      const eventEmitter = new NativeEventEmitter(NativeModules.SecurityModule);
      eventEmitter.addListener('SecurityAuth', event => {
        /**Get biometric status enabled/disabled from native module */
        var n1 = event.eventProperty.localeCompare(
          'E_AUTH_NOT_RECOGNIZED_SUCCESS',
        );
        /**If not authorized user then exist the app */
        // if (n1 === 0) {
        //   RNExitApp.exitApp();
        //   //Platform.OS === STRINGS.IOS ? authenticateDevice() : BackHandler.exitApp();
        // }
      });
      /**Remove the NativeEventEmitter listener */
      return function cleanup() {
        eventEmitter.removeAllListeners('SecurityAuth');
      };
    }
  }
  const {isLoading, DataResponse, userResponseError} = useSelector(
    (state: RootState) => state.home,
  );
  console.log('loading state', isLoading);
  console.log('success state', DataResponse);
  console.log('error state', userResponseError);

  var renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: 'green',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>{item.title}</Text>
      </View>
    );
  };
  var enableBioMetricMethod = () => {
    // setIdBiometricEnabled(true);
    // console.log('status of biometric id', idBiometricEnabled);
    // getData();
    dispatch(isEnableBioMetric());
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          flex: 1,
          borderWidth: 5,
        }}>
        <Pressable onPress={() => enableBioMetricMethod()}>
          <Text>{'BIOMETRIC ENABLED :'}</Text>
          <Text>{isBioMetricEnabled}</Text>
        </Pressable>
        <FlatList data={DataResponse?.Data || []} renderItem={renderItem} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;
