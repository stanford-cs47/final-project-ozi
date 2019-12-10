
import React from 'react';
import { StyleSheet,
         Text, View, SafeAreaView, StatusBar, Platform, Dimensions, Image,
         TextInput, TouchableOpacity, FlatList,
         ActivityIndicator, Keyboard, TouchableWithoutFeedback,
         AsyncStorage, Button} from 'react-native';
import { Images, Colors } from '../Themes';
import Attendees from '../Components/Attendees';
import NameInput from '../Components/NameInput';
import uuid from 'uuid/v4'
import firebase from 'firebase';
import firestore from '../../firebase';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';




const haversine = require('haversine')
const DismissKeyboard = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
}

var { height, width } = Dimensions.get('window');
var statusBarHeight = StatusBar.currentHeight;
var myID  = "";
const usersRef = firestore.collection('users/');
var myRef = "";
//GEO-FENCE TASK:
_markAttendance = async (isPresent,regionName) => {
  let doc  = await myRef.get();
  if(doc.exists){
    if(regionName == 'escondido'){
      await myRef.set({ atEscondido:isPresent }, { merge: true });
    } else {
      await myRef.set({ atBlackHouse:isPresent }, { merge: true });
    }
  }
}

TaskManager.defineTask("markAttendance", ({ data: { eventType, region }, error }) => {
  if (error) {
    console.log("GEOFENCING ERROR!")
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("You've entered region:", region);
    _markAttendance(true,region["identifier"]);

  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("You've left region:", region);
    _markAttendance(false,region["identifier"]);
  }
});

//COMPONENT
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      attending: false,
      name : "",
      loading:true,
      pickUpRegions : [{identifier:"escondido",
                        latitude:37.425112,
                        longitude:-122.164589,
                        radius:85,
                        notifyOnEnter: true,
                        notifyOnExit: true},
                      {identifier:"blackHouse",
                       latitude:37.424496,
                       longitude:-122.172606,
                       radius:85,
                       notifyOnEnter: true,
                       notifyOnExit: true}],
      errorMessage:"",

    }
    this._askPermission();
  }

  static navigationOptions = {
    tabBarLabel:"MyAttendance",
    tabBarIcon: ({tintColor}) => <MaterialIcons name="person" size ={32} color= {tintColor}/>,
    tabBarOptions:{
      activeTintColor:'#42AE4A',
      style: {
        backgroundColor:'#f0f0f0'
      }
    }
  };

  _askPermission = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      console.log(status)
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied'
        });
        alert("Please Enable Location Services!")
        return;
      } else {
        let taskManaged = await Location.startGeofencingAsync("markAttendance", this.state.pickUpRegions)
        if(Platform.OS == 'android'){
          //need this line to properly record lactions on android for whatever reason
          await Location.watchPositionAsync({"accuracy":5,"timeInterval":1000,"distanceInterval":0}, (location) => {console.log(location)})
        }
      }
    };


  _retrieveData = async (onComplete) => {
    this.setState({loading:true})
    try {
      const value = await AsyncStorage.getItem('myID');
      if(value !== null){
        myID = value;
        myRef = firestore.doc('users/'+myID);
        onComplete();
      } else {
        myID = uuid();
        await AsyncStorage.setItem('myID',myID);
        myRef = firestore.doc('users/'+myID);
        this.setState({loading:false})
      }
    } catch (error){
      console.log(error);
    }
};

  onComplete = async () => {
    let doc  = await myRef.get();
    if(doc.exists){
      this.setState(doc.data())
    }
    this.setState({loading:false})
  };

  componentDidMount() {
    this._retrieveData(this.onComplete);
  }

  onToggle = async (name, going) => {
    await myRef.set({ name: name, attending: going }, { merge: true });
  }

  onEmptyString = async () => {
      await myRef.set({ name: "", attending: false }, { merge: true });
  }

  getAttendeeInfo = () => {
    const loading = this.state.loading;
    let contentDisplayed = null;
    if(loading){
      contentDisplayed = <ActivityIndicator size = "large" color ="black"></ActivityIndicator>;
    } else {
      contentDisplayed = <NameInput onToggle = {this.onToggle}
                                 attending = {this.state.attending}
                                 name = {this.state.name}
                                 onEmptyString = {this.onEmptyString}/>;
    }
    return (<View style = {{flex:1, width:'100%',flexDirection:'column',alignItems:'center',justifyContent: loading?'center':'flex-start',
                            backgroundColor:'#f0f0f0'}}>
              {contentDisplayed}
            </View>);
  }

  render() {
    return (
      <DismissKeyboard>
      <SafeAreaView style={styles.container}>
      <Image
        style = {{height:width*0.2, width:width,
                  marginTop: Platform.OS === 'android' ? statusBarHeight : 0}}
        source = {require("../Images/nbcclogo.png")}
        resizeMode = 'contain'
      />

        {/*Name Input*/}
        {this.getAttendeeInfo()}


      </SafeAreaView>
      </DismissKeyboard>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#42AE4A',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

});
