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
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {userDataReq, selectUserInfo} from './slice';
import {RootState} from '../../redux/store';

const HomeScreen: () => Node = () => {
  var dispatch = useDispatch();
  useEffect(() => {
    var params = {email: 'some email', password: '1234'};

    dispatch(userDataReq(params));
  }, [dispatch]);

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
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          flex: 1,
          borderWidth: 5,
        }}>
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
