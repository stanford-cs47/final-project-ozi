
import React, { Component } from 'react'
import PropTypes from 'prop-types' //consider using this!
import { StyleSheet, View, Button, TextInput, TouchableOpacity, Keyboard, Switch,Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { Metrics, Colors } from '../Themes';
import { AntDesign } from '@expo/vector-icons';



export default class NameInput extends Component {

  constructor(props) {
	   super(props); // Allows you to use “this”
	    // Initialize state
      this.state = {
        text : props.name,
        switchVal: props.attending,
        switchDisabled: false
      }
}


  // state = {
  //   text : "",
  //   switchVal: false,
  //   switchDisabled: false
  // }

  componentDidMount(){
    // this.setState({text:this.props.name, switchVal:this.props.attending})
    // console.log(this.state.switchVal);
    if(this.state.text === ""){
      this.setState({switchDisabled:true})
    }
  }

  onChangeText = (text) => {
    this.setState({text:text})
    if(text === ""){
      this.setState({switchVal:false,switchDisabled:true});
      this.props.onEmptyString();
    } else {
      this.setState({switchDisabled:false});
    }
  }
  onValueChange = (switchVal) => {
    Keyboard.dismiss();
    if(this.state.text === ""){
      this.setState({switchVal:false,switchDisabled:true});
    } else {
      this.setState({switchVal,switchDisabled:false});
      this.props.onToggle(this.state.text,switchVal);
    }
  }

  getText = () => {
    return (this.state.switchVal)? "Attending":"Not Attending";
  }
  render () {
    return (
      <View style = {{height:190,width:'95%' ,borderRadius:5,backgroundColor: '#d0d0d0', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'space-around',margin : 50}}>
        <TextInput style = {styles.textinput}
                   placeholder = "Your Name"
                   textAlign = {'center'}
                   onChangeText = {text => {this.onChangeText(text)}}
                   value = {this.state.text}>
        </TextInput>
        <View style = {styles.switch}>
          <Switch
                onValueChange = {this.onValueChange}
                value = {this.state.switchVal}
                disabled = {this.state.switchDisabled}/>
          <View>
            <Text style = {{marginBottom:10,marginTop:10}}>{this.getText()}</Text>
          </View>
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  textinput: {
    width: '85%',
    height:'25%',
    backgroundColor : '#f0f0f0',
    borderRadius:5,
    padding:5
  },
  switch: {
    height:'25%',
    flexDirection:'column',
    alignItems:'center'
  }
});
