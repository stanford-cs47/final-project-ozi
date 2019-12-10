import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Attendance from './App/Pages/Attendance';
import MainScreen from './App/Pages/MainScreen';
import Schedule from './App/Pages/Schedule';

const TabNav = createBottomTabNavigator({
  MyAttendance: {screen: MainScreen},
  GeneralAttendance: {screen: Attendance},
  Schedule:{screen:Schedule}
});


const MyApp = createAppContainer(TabNav);
export default MyApp;
