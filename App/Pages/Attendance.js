
import React from 'react';
import { StyleSheet,
         Text, View, SafeAreaView, StatusBar, Platform, Dimensions, Image,
         TextInput, TouchableOpacity, FlatList, ActivityIndicator, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { Images, Colors } from '../Themes';
import Attendees from '../Components/Attendees';
import NameInput from '../Components/NameInput';
import firebase from 'firebase';
import firestore from '../../firebase';
import {FontAwesome} from  '@expo/vector-icons';//name: 'bars'



const DismissKeyboard = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
}

var { height, width } = Dimensions.get('window');
var statusBarHeight = StatusBar.currentHeight;

const usersRef = firestore.collection('users/');
export default class App extends React.Component {

  state = {
    loading: true,
    attendees : [],
    unsubscribe: null
  }

  static navigationOptions = {
    tabBarLabel:"General Attendance",
    tabBarIcon: ({tintColor}) => <FontAwesome name="bars" size ={32} color= {tintColor}/>,

    tabBarOptions:{
      activeTintColor: '#42AE4A',
      style: {
        backgroundColor:'#f0f0f0'
      }
    }
  };

  loadAttendees = async () => {
    this.setState({loading:true});
    let newAttendees = [];//JSON.parse(JSON.stringify(this.state.attendees));
    let docs = await usersRef.where("attending","==",true).get();
    docs.forEach((doc) => newAttendees.push(doc.data()));
    this.setState({attendees:newAttendees, loading:false});
  }
  componentDidMount() {
    let unsubscribe = usersRef.onSnapshot(() => {
      this.loadAttendees();
    });
    this.setState({ unsubscribe });
    //this.loadAttendees();
    //console.log(this.state.attendees)
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }


  getAttendance = () => {
    const {attendees, loading} = this.state;
    let contentDisplayed = null;
    if(loading){
      contentDisplayed = <ActivityIndicator size = "large" color ="black"></ActivityIndicator>;
    } else {
      contentDisplayed = <Attendees attendees = {this.state.attendees}></Attendees>;
    }
    return (<View style = {{flex:1, width:'100%',flexDirection:'column',alignItems:'center',justifyContent: 'center',
                            backgroundColor:'#f0f0f0'}}>
              {contentDisplayed}
            </View>);
  }

  render() {
    return (
      <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        {/*NYT LOGO*/}

        <Image
          style = {{height:width*0.2, width:width,
                    marginTop: Platform.OS === 'android' ? statusBarHeight : 0}}
          source = {require("../Images/nbcclogo.png")}
          resizeMode = 'contain'
        />


        {/*Article List*/}
        {this.getAttendance()}
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
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

});
