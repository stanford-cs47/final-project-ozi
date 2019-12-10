import React, { Component } from 'react';
import PropTypes from 'prop-types'; //consider using this!
import { StyleSheet, SafeAreaView, View, FlatList, Text, Linking, Dimensions,TouchableWithoutFeedback} from 'react-native';
import { material } from 'react-native-typography'; //consider using this!
import { Metrics, Colors } from '../Themes';

var { height, width } = Dimensions.get('window');
export default class Attendees extends Component {
  static defaultProps = { attendees: [] }

  static propTypes = {
    attendees: PropTypes.array
  }


  //you can change the props above to whatever you want/need.
  renderAttendeeItem = (item,index) => {
    return (
      <TouchableWithoutFeedback>
      <View style = {{backgroundColor: (!item["atBlackHouse"] && !item["atEscondido"])? ('#d0d0d0') : '#42AE4A',
                      width: '100%',
                      alignItems:'center',
                      padding:10,
                      marginTop:.05*width,
                      borderRadius:5}} >
        <Text style = {{color:'black'}}>{item["name"]}</Text>
      </View>
      </TouchableWithoutFeedback>
    );
  }
  keyExtractor = index => {
    return index.toString();
  }

  render () {
    const {attendees} = this.props;
    return (
      <View style={styles.container}>
        <FlatList style = {{width : '100%'}}
                  data = {attendees}
                  renderItem = {({ item, index }) => this.renderAttendeeItem(item, index)}
                  keyExtractor={(item, index) => this.keyExtractor(index)}
          >
        </FlatList>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
