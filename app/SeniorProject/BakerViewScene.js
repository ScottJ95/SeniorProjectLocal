import React, {Component} from "react";
import {
    Alert,
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableWithoutFeedback,
    Navigator,
    ActivityIndicator,
    ScrollView
} from "react-native";
import ModalPicker from "react-native-modal-picker";
import Button from "apsl-react-native-button";
import HourPicker from "./HourPicker.js";
import MinutePicker from "./MinutePicker.js";
import BakerProductList from "./BakerProductList.js";
let GLOBAL = require('./Globals');

const dismissKeyboard = require('dismissKeyboard');

class AmPmPicker extends Component {
   constructor(props) {
        super(props);

        this.state = {
            ampmState: 'AM'
        }
    }

    render() {
        let index = 0;
        const data = [
            { key: index++, label: 'AM'},
            { key: index++, label: 'PM'},
        ];
        return (
                <ModalPicker
                    data={data}
                    initValue='AM'
                    onChange={(option)=>{ this.setState({ampmState: option.label})}}
                    style = {{flex:1}}
                    selectTextStyle = {{fontSize: 14}}>
                </ModalPicker>
           );
    }
}

class TimeView extends Component{
  constructor(props){
    super(props);
    this.state = {textState: this.props.text};
  }

  render(){
    if(this.props.type === 'open'){


    return (
          <Text style = {styles.timeview2} >
          Current Open Time: {this.state.textState}
          </Text>
        );
  }
  else{
    return (
          <Text style = {styles.timeview2} >
          Current Close Time: {this.state.textState}
          </Text>
        );
  }
  }
}


export default class BakerViewScene extends Component {
	
  constructor(props){
    super(props);
    this.state = {
      loaded: false, //Is data loaded yet?
      test: false,
      data: 0,
    }
  }

  _navigateProducts(storeID, merchantID, type){
      this.props.navigator.push({
        component: BakerProductList,
        passProps:{
          storeID: storeID,
          merchantID: merchantID
        },
        type:type
      })
  }

render() {
  var test = <TimeView type = 'open' text = {this.state.data.open}/>

   console.log("RENDERING");
   console.log(this.props.merchantID);
   console.log(this.props.storeID);
        if (!this.state.loaded)
        {
            // Have we loaded this page yet?
            // If not, let's load it and show a loading screen
            return this.renderLoadingView();
        }


      //For now, current store is just store ID 1 in the callback.
    return ( 
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView style = {{flex:1}}>
       <View style = {styles.index}>
	   
     <View style = {styles.usernameview}>
	 
           <Text style={styles.title}>
              {this.state.data.name} 
            </Text>
          </View>
		  
		 <View>
		    <Text style={styles.timeview1}>
              Opening Time: 
            </Text>
          <View style = {{flex:1,  flexDirection: 'row'}}>
            <HourPicker ref = "OpenHour" />
            <MinutePicker ref = "OpenMinute" />
            <AmPmPicker ref = "OpenAMPM"/>
          </View>
		 </View>
		 
		 <View>
		    <Text style={styles.timeview1}>
              Closing Time: 
            </Text>
		  <View style = {{flex:1, flexDirection: 'row', paddingBottom: 30}}>
            <HourPicker ref = "CloseHour" />
            <MinutePicker ref = "CloseMinute" />
            <AmPmPicker ref = "CloseAMPM"/>
          </View>
		 </View>
				
		
		<View style = {styles.buttonview}>
    
          <Button 
              style={{backgroundColor: '#dcdcdc'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this.renderTimes()}>
              Set Times
          </Button>
        </View>

		<View style = {styles.buttonview}>
		
          <Button 
              style={{backgroundColor: '#dcdcdc'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this.props.navigator.push({
				          component: OrderListing,
				          passProps: {
					       bakerID: this.props.bakerID,
                 storeID: this.props.storeID,
				        },
				        type: 'OrderList',
                storeID: this.props.storeID})}>
            View Orders
          </Button>
      </View>
		
		 <View style = {styles.buttonview}>
    
          <Button 
              style={{backgroundColor: '#dcdcdc'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              //TODO: Manage Products Page
             onPress = {()=> this._navigateProducts(this.props.storeID, this.props.merchantID,'Normal')}>
              Manage Products
          </Button>
        </View>

		<View style = {styles.buttonview}>
       
          <Button 
              style={{backgroundColor: '#dcdcdc'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              //TODO Statistics Page
              //onPress = {()=> this.go_back_pressed('RUBaked', 'Normal')}>
              >
              Business Statistics
          </Button>
        </View>
		
		<View style = {styles.buttonview}>
		
          <Button 
              style={{backgroundColor: '#dcdcdc'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {()=> this.props.navigator.push({
				        component: ReviewListing,
				        passProps: {
					        storeID: this.props.storeID,
                  merchantID: this.props.merchantID,
				        },
				        type: 'Normal'
				       })}>
              Reviews
          </Button>
        </View>
		
		
		
		 <View style = {{flexDirection: 'row', flex: 1}}>
        <Text style = {{color: '#333333', fontSize: 20, paddingTop: 10}}>
          Current Open Time:
          </Text>
        <TextInput value =  {this.state.data.open} editable = {false} style = {styles.timeview2}/>
		 </View>
		 
		 <View style = {{flexDirection: 'row', flex: 1}}>
        <Text style = {{color: '#333333', fontSize: 20, paddingTop: 10}}>
          Current Close Time:
          </Text>
		     <TextInput value =  {this.state.data.close} editable = {false} style = {styles.timeview2}/>
		 </View>
		 
       </View>
       </ScrollView>
     </TouchableWithoutFeedback>
    );
  }

  // show Loading while we are waiting
    renderLoadingView()
    {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    renderTimes(){
      dismissKeyboard();
        // Set both the open and close at one
        this.putTime();
    }

    putTime() {
      let open_time = this.refs.OpenHour.state.hourState + ":" + 
                      this.refs.OpenMinute.state.minuteState + " " +
                      this.refs.OpenAMPM.state.ampmState;

      let close_time = this.refs.CloseHour.state.hourState + ":" + 
                        this.refs.CloseMinute.state.minuteState + " " + 
                        this.refs.CloseAMPM.state.ampmState;

      console.log(open_time + " " + open_time.length);
      console.log(close_time + " " + close_time.length);
        if (open_time.length < 8 || close_time.length < 8) /* Prevent useless network calls */
        {
            return;
        }
        console.log(open_time);
        fetch(GLOBAL.BASE_URL + '/stores/' + this.props.storeID, {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'open': open_time,
                'close': close_time,
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    data: responseData,
                    test: !this.state.test

                });
                console.log(responseData);
            })
            .done();

    }

    componentDidMount()
    {
        // This method is called when the screen is first shown
        // Your web server should be running locally
        // To connect from Android VM to local web server, 10.0.2.2 is the IP that must be used.
        // I have no idea why Android defaults to this IP10.0.2.2
        this.fetchData(GLOBAL.BASE_URL + "/stores/" + this.props.storeID);
    }

    fetchData(url) {
        // Fetch data for a given URL
        // And update the dataSource, which will call render again
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    loaded: true,
                    data: responseData
                });
                console.log(responseData);
            })
            .done();
    }
}

/* Taken directly from ProductPage Modified view style margin to fit on device */
/* Component powering the content inside the Reviews Tab */
class OrderListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, orders: []};
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        /* Hack to get access to `this` inside nested function scope */
        let counter = 0;
        var return_val = this.state.orders.map(
            function (individual_order) {
                return <View style={styles.card} key={counter++}>
					
                    <Text>{counter + '. ' + individual_order.user_first_name + ' ' + individual_order.user_last_name}</Text>
					<Text>{individual_order.address}</Text>
                    <Text>{individual_order.date}</Text>
                </View>;
            }
        );
        return <ScrollView><View style={{marginTop: 100}}>{return_val}</View></ScrollView>;
    }

    /* Called whenever a component is first shown */
    componentDidMount() {
		//let store_id = this.state.data.id.toString();
        this.fetchData(GLOBAL.BASE_URL + "/stores/" + this.props.storeID + "/orders" );
    }

    /* Do the fetching and call parseResponse() with the result */
    fetchData(url) {
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.parseResponse(responseJSON);
            })
            .catch((error) => {
                console.error(error);
            })
            .done();

    }

    /* Parses the responses for order data */
    parseResponse(responseJSON) {
        console.log("parse response");
        console.log(responseJSON);
        /* Prevent error by checking to make sure orders are available */
        if (responseJSON.status == 400)
        {
            Alert.alert("No orders available for this store");
            this.props.navigator.pop();
            return;
        }
        this.setState({'loaded': true, 'orders': responseJSON});
    }

    /* Called when we are waiting for the response from the network. Shows a spinning icon */
    renderLoadingView()
    {
        return (
            <ActivityIndicator
                animating={!this.state.loaded}
                color="green"
                size="large"
            />
        );
    }
}

/* Taken directly from ProductPage Modified view style margin to fit on device */
/* Component powering the content inside the Reviews Tab */
class ReviewListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, ratings_to_show: []};
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        /* Hack to get access to `this` inside nested function scope */
        let counter = 0;
        var ret_val = this.state.ratings_to_show.map(
            function (individual_rating) {
                return <View style={styles.card} key={counter++}>
					
                    <Text style={styles.elementTitle}>{counter + '. ' + individual_rating.reviewer_first_name}</Text>
                    <Text style={styles.reviewText}>{individual_rating.feedback_text}</Text>
                    <Text style={styles.dateText}>{individual_rating.feedback_date}</Text>
                </View>;
            }
        );
        return <View style={{marginTop: 100}}>{ret_val}</View>;
    }

    /* Called whenever a component is first shown */
    componentDidMount() {
		//let store_id = this.state.data.id.toString();
        this.fetchData(GLOBAL.BASE_URL + "/storefeedback/" + this.props.storeID);
    }

    /* Do the fetching and call parseResponse() with the result */
    fetchData(url) {
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.parseResponse(responseJSON);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    /* Parses the respones */
    parseResponse(responseJSON) {
        console.log("parse response");
        console.log(responseJSON);
        this.setState({'loaded': true, 'ratings_to_show': responseJSON});
    }

    /* Called when we are waiting for the response from the network. Shows a spinning icon */
    renderLoadingView()
    {
        return (
            <ActivityIndicator
                animating={!this.state.loaded}
                color="green"
                size="large"
            />
        );
    }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 100
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#333333',
    marginTop: 10,
    marginBottom: 0
  },
   password: {
    fontSize: 20,
    textAlign: 'justify',
    color: '#333333',
    paddingTop: 20,
    marginBottom: 0
  },
  index:{
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginLeft: 16,
    marginRight: 16

  },
  usernameview:{
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 0,
    paddingTop: 50
  },
  
timeview1:{
    flexDirection: 'row',
    fontSize: 20,
    color: '#333333',
    alignSelf: 'flex-start',
    paddingBottom: 0,
    paddingTop: 0
  },

  timeview2:{
    flex:1,
    flexDirection: 'row',
	 fontSize: 20,
	 color: '#333333',
    paddingBottom: 20,
    paddingTop: 0,
    paddingLeft: 20
  },

  passwordview:{
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 0,
    paddingTop: 0
  },

  buttonviewRow:{
	  flex:1,
	  flexDirection:'row',
	  alignItems:'center',
	  justifyContent: 'center',
	  alignSelf: 'stretch',
    paddingTop: 70,
    paddingBottom: 0
  },
  buttonview:{
  paddingTop: 0,
	paddingBottom: 0
  },
  	reviewText: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    dateText: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
	
	tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 3,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  
  },
  currentTimeView:{
    flexDirection: 'row', 
    flex: 1
  },
});