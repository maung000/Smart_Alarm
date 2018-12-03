import React, {Component} from 'react';
import {
	Text,
	Image,
	View,
	StyleSheet,
	Button,
	StatusBar,
	TextInput,
	TouchableOpacity,
	AsyncStorage,
	Slider,
	Picker,ScrollView, Alert
} from 'react-native';
import Sound from 'react-native-sound';
import {StackNavigator} from 'react-navigation';
import ListAlarm from './ListAlarm';
import Icon_Ion from 'react-native-vector-icons/Ionicons';

const closeIcon = (<Icon_Ion name="md-close" size={30} color={'#fff'} style={{paddingRight: 10, paddingLeft: 15,paddingTop:5,paddingBottom:5}}/>);
const saveIcon = (<Icon_Ion name="md-checkmark" size={30} color={'#fff'} style={{paddingRight: 10, paddingLeft: 15,paddingTop:5 ,paddingBottom:5}}/>);

class SetAlarm extends Component {
	constructor(props) {
		super(props);
		
		const {params} = this.props.navigation.state;
		this.state = {
			lastedKey: -1,
			numList: 0,
			alarmList: [],
			alarm: {
				key: "",
				alarmName: "",
				address: params.name,
				latitude: params.latitude,
				longitude: params.longitude,
				minDisToAlarm: 100,
				ringtone: "default",
				enable: true,
			},
			min: 100,
			name: "Báo thức 1",
			distance: params.distance,
			ringtone: "WayBackHome.mp3",
			check_save: false
		}
	}

		componentDidMount()
		{
			this.loadAllAlarm();
		}

		static navigationOptions = {
			title: 'Alarm Settings',
			tabBarVisible: false,
			header:
			<View></View>
		};


		addAlarm = () => {
			var tempAlarm = {
				key: new Date(),
				alarmname: this.state.name,
				address: this.state.alarm.address,
				latitude: this.state.alarm.latitude,
				longitude: this.state.alarm.longitude,
				minDisToAlarm: this.state.min,
				ringtone: this.state.ringtone,
				enable: this.state.alarm.enable,
			}

			var tempList = this.state.alarmList;
			tempList.push(tempAlarm);
			this.setState({alarmList: tempList});
			this.setData(tempAlarm.key, tempAlarm);
			this.props.navigation.state.params.onGoBack();
			this.props.navigation.goBack();
		}

		loadAllAlarm()
		{
				AsyncStorage.getAllKeys()
				.then(keys => {
					this.getAllData(keys);
			});
		}

		getAllData(keyArray)
		{
			var tempList = new Array();
			AsyncStorage.multiGet(keyArray).then(
			value => {
				for(var i = 0; i < value.length; i++)
				{
					AsyncStorage.getItem(keyArray[i])
					.then(itemValue => {
						const objValue = JSON.parse(itemValue);
						tempList.push(objValue);
						this.setState({
							alarmList: tempList
						})
					});
				}
				this.setState({numList: value.length});
			}
			);
		}

		setData(keyAlarm, alarmObj)
		{
			AsyncStorage.setItem(keyAlarm, JSON.stringify(alarmObj));
		}

		updateData(keyAlarm, alarmObj)
		{
			AsyncStorage.mergeItem(keyAlarm, JSON.stringify(alarmObj));
		}

		
		turnOnRingStone(nameFile){
			this.setState({ringtone: nameFile})// => set value for Picker when value change
			

			this.ringtone = new Sound(
				nameFile,
				undefined,
			   error => {
					if (error) {
					 // Means the file was never loaded.
					 console.warn(error);
					 return;
				   }
				   this.ringtone.setVolume(1);
				   this.ringtone.play(success => {
					//  if (!success) {
					//    this.ringtone.reset();
					//  }
					if (success) {
						console.log('successfully finished playing');
					  } else {
						console.log('playback failed due to audio decoding errors');
						// reset the player to its uninitialized state (android only)
						// this is the only option to recover after an error occured and use the player again
					  }
				   });
				 }
			   );
		}


		render() {
		return(

			<View style={{flex: 1, position: "relative"}}>
				<View style={styles.statusBar}>
					<TouchableOpacity onPress = {() => this.props.navigation.goBack()}>
						{closeIcon}
					</TouchableOpacity>
					<Text style = {{paddingLeft: 0,textAlign:'center',alignSelf: 'center', flex: 1, fontSize: 22, color: 'black'}}>Add Alarm</Text>

					<TouchableOpacity onPress={this.addAlarm} >
						{saveIcon} 
					</TouchableOpacity>
				</View>

				<View style = {{height: 50}}></View>
				
				<View style={styles.titleBox}>
					<Text style = {styles.propertiesTitle}>Alarm name</Text>
					<TextInput
						style = {{marginLeft: 25, padding: 0}}
						underlineColorAndroid='transparent'
						autoFocus = {true}
						onChangeText={(nameAlarm) => this.setState({name:nameAlarm})}
						value={this.state.name}/>
				</View>

				<View style={styles.titleBox}>
					<Text style = {styles.propertiesTitle}>Destination</Text>
					<Text style = {{paddingLeft: 25}}>{this.state.alarm.address}</Text>
				</View>

				<View style={styles.titleBox}>
					<Text style = {styles.propertiesTitle}>Distance</Text>
					<Text style = {{paddingLeft: 25}}>{this.state.distance + "m"}</Text>
				</View>

				<View style={styles.titleBox}>
					<Text style = {styles.propertiesTitle}>Min Distance</Text>
					<Text style = {{paddingLeft: 25}}>{this.state.min + "m"}</Text>
					<Slider
						style={{ width: 320, marginLeft: 20}}
						step={1}
						thumbTintColor = {"#ffa000"}
						minimumTrackTintColor = {"#ffa000"}
						minimumValue={100}
						maximumValue={1000}
						value={this.state.min}
						onValueChange={val => this.setState({ min: val })}/>
				</View>

				<View style={styles.titleBox}>
					<Text style = {styles.propertiesTitle}>Ringtone</Text>
					<Picker style = {styles.picker}
					  selectedValue={this.state.ringtone}
					//   onValueChange={(itemValue, itemIndex) => this.setState({ringtone: itemValue})}
					// onValueChange={(itemValue, itemIndex) => this.ABC(this.state.ringtone)}
					onValueChange={(itemValue, itemIndex) => this.turnOnRingStone(itemValue)}
					  >
					  <Picker.Item label="Way Back Home" value="way_back_home.mp3" />
					  <Picker.Item label="Hello OMFG" value="hello_omfg_ringtone.mp3" />
					  <Picker.Item label="Chicken Disco" value="chicken_disco.mp3" />
					  <Picker.Item label="Despacito Marimba" value="despacito_marimba.mp3" />
					</Picker>
				</View>
			</View>
			)
		}
//

		
	}

	const styles = StyleSheet.create({
		picker: {
			height: 20,
			marginLeft: 20,
			opacity: 0.6,
		},
		statusBar:{
			flexDirection: 'row',
			backgroundColor: "#7986cb",
			alignSelf: 'flex-start',
			position: 'absolute',
			right: 0,
			top: 0,
		},
		titleBox: {
			paddingBottom: 10
		},
		propertiesTitle: {
			marginBottom: 10,
			color: "black",
			fontWeight: 'bold',
			padding: 10,
			backgroundColor: "#D7D7D7",
			paddingLeft: 20
		}
	});

	export default SetAlarm;