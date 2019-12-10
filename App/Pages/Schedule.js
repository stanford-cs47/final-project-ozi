
import React from 'react';
import { StyleSheet,
         Text, View, SafeAreaView, StatusBar, Platform, Dimensions, Image,
         TextInput, TouchableOpacity, FlatList, ActivityIndicator, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { Images, Colors } from '../Themes';
import {AntDesign, EvilIcons} from  '@expo/vector-icons';//name: 'bars'
import firebase from 'firebase';
import firestore from '../../firebase';





var { height, width } = Dimensions.get('window');
var statusBarHeight = StatusBar.currentHeight;
const schedColRef = firestore.collection('schedule');
const schedDocRef = firestore.doc('schedule/schedule');
export default class App extends React.Component {
  state = {
    loading: true,
    dates : {},
    unsubscribe: null,
    monthToString: {0: "Jan",
                    1: "Feb",
                    2: "Mar",
                    3: "Apr",
                    4: "May",
                    5: "Jun",
                    6: "Jul",
                    7: "Aug",
                    8: "Sept",
                    9: "Oct",
                    10: "Nov",
                    11: "Dec"}
  }
  loadSchedule = async () => {
    this.setState({loading:true});
    let newSchedule = {};//JSON.parse(JSON.stringify(this.state.attendees));
    let doc = await schedDocRef.get();
    if(doc.exists) {
        const keys = Object.keys(doc.data())
        for (const key of keys) {
          seconds = doc.data()[key][0]["seconds"]
          const date = new Date(0);
          date.setUTCSeconds(seconds);
          newSchedule[date] = doc.data()[key][1]
        }
      this.setState({dates:newSchedule,loading:false});
    } else {
      console.log("Error, schedule doc doesn't exist")
    }
  }
  componentDidMount() {
    let unsubscribe = schedColRef.onSnapshot(() => {
      this.loadSchedule();
    });
    this.setState({ unsubscribe });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  static navigationOptions = {
    tabBarLabel:"Bus Schedule",
    tabBarIcon: ({tintColor}) => <EvilIcons name="calendar" size ={40} color= {tintColor}/>,

    tabBarOptions:{
      activeTintColor: '#42AE4A',
      style: {
        backgroundColor:'#f0f0f0'
      }
    }
  };

  renderDateItem = (item,index) => {
    var date = new Date(item);
    const month = this.state.monthToString[date.getMonth()]
    const dt = date.getDate();
    const str = month + " " + dt;
    const busAvailable = this.state.dates[date];
    var logoName = (busAvailable)? "checkcircle" : "closecircle"
    var logoColor = (busAvailable)? '#42AE4A' : 'red'
    return (
      <View style = {{backgroundColor: '#d0d0d0',
                      width: '100%',
                      alignItems:'center',
                      padding:10,
                      flexDirection:'row',
                      justifyContent:'flex-end',
                      borderRadius:5,
                      marginTop:width*0.05}} >
        <View style = {{flex:15, alignItems:'center',justifyContent:'center'}}>
          <Text style = {{color:'black'}}>{str}</Text>
        </View>
        <AntDesign style = {{flex:1}} name={logoName} color={logoColor} size = {17}>
        </AntDesign>
      </View>
    );
  }

  keyExtractor = index => {
    return index.toString();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
      <Image
        style = {{height:width*0.2, width:width,
                  marginTop: Platform.OS === 'android' ? statusBarHeight : 0}}
        source = {require("../Images/nbcclogo.png")}
        resizeMode = 'contain'
      />

      <View style = {{flexDirection:'column', justifyContent:'center',
                      alignItems:'center',
                      borderTopWidth:1,
                      borderTopColor:'#f0f0f0',
                      borderBottomWidth:1.5,
                      borderBottomColor:'#f0f0f0',
                      width:'100%',
                      paddingTop:5,
                      paddingBottom:5}}>
        <Text style = {{fontWeight: 'bold',color:'white', fontSize:12}}>Pickup Spots:
        </Text>
        <Text style = {{fontWeight: '300',color:'white', fontSize:12}}>Escondido Turnaround (9:40AM)
        </Text>
        <Text style = {{fontWeight: '300',color:'white', fontSize:12}}>Black Community Services Center (9:50AM)
        </Text>
      </View>
      <View style = {{flex:1,width:'100%',backgroundColor:'#f0f0f0',flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
        <View style = {{flex:1, width:'90%',flexDirection:'column',alignItems:'center',justifyContent: 'center',
              backgroundColor:'#f0f0f0'}}>
              <FlatList style = {{width:'100%'}}
                        data = {Object.keys(this.state.dates)}
                        renderItem = {({ item, index }) => this.renderDateItem(item, index)}
                        keyExtractor={(item, index) => this.keyExtractor(index)}>
              </FlatList>
        </View>
      </View>



      </SafeAreaView>
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
