'use strict';
import React, { Component } from 'react';
import {Text, Image, View, StyleSheet, ScrollView, ActivityIndicator, Slider, Alert, TextInput,} from 'react-native';
import Button from 'apsl-react-native-button';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modalbox';
import ProductInformationView from './ProductInformationView.js';
import WriteReview from './WriteReview.js';
let GLOBAL = require('./Globals');
const dismissKeyboard = require('dismissKeyboard')


/*Information Input used in this class as a search bar*/
class InformationInput extends Component{
  constructor(props){
    super(props);
    this.state = {text: ''};
  }

  render(){
    return (
          <TextInput
            style = {{flex: 1}}
            onChangeText = { (text) => this.setState({text})}
            onSubmitEditing = {dismissKeyboard}
           />
        );
  }

  get_value()
  {
      if (this.state.text)
      {
          return this.state.text;
      }
      else return "";
  }
}

/* A Class representing the JSON response.
   Not this is not a React class, this is a pure JavaScript class
   responseJSON is a JSON object response from the RESTFul API
 */
class Product {
    constructor(responseJSON)
    {
        this.product_id = responseJSON.product_id;
        this.product_name = responseJSON.product_name;
        this.product_price = responseJSON.product_price;
        this.product_description = responseJSON.product_description;
        this.picture_url = {'uri': responseJSON.product_picture }; /* Must tell it we are supplying an URI */
        console.log("pic");
        console.log(responseJSON.picture);
        this.quantity = 0; /* This is set from the slider, not from the JSON response from the API */
        this.getPrice = this.getPrice.bind(this);
    }

    getPrice() {
        return parseFloat(this.product_price) * parseInt(this.quantity);

    }
}


/* ProductListing is for each `card` shown, one instance exists for each product on Products tab */
class ProductListing extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            products_to_show: new Map(), /* <product_id, Product class mapping> */
        };
        this.render = this.render.bind(this); /* required by ES6 */
        this.parseResponse = this.parseResponse.bind(this);
    }

    render() {
        let pic = {
            uri: 'https://www.getupandgobaked.com/wp-content/uploads/2015/03/smart-cookie-pic-copy.jpg' /* default */
        };
        console.log("render product listing tab");
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        let me = this; /* Hack to get access to `this` inside nested function scope */
        let array_of_products = Array.from(this.state.products_to_show.values());
        if (this.state.products_to_show.size == 0)
        {
            Alert.alert("This baker does not sell anything.");
            this.props.navigator.pop();
            return;
        }
        var ret_val = array_of_products.map(
            function (individual_product_item) {
                // if (!me.state.product_id_quantity_map.has(individual_product_item.product_id)) {
                //     /* If there's nothing in our map, create an entry of 0 */
                //     me.state.product_id_quantity_map.set(individual_product_item.product_id, 0); // start at quantity 0
                //     me.state.product_id_price_map.set(individual_product_item.product_id, individual_product_item.product_price);
                // }
                console.log("rendering product...");
                console.log(individual_product_item);
                return <View style={styles.card} key={individual_product_item.product_id}>
                    <Button 
                        textStyle = {styles.elementTitle}
                        onPress = {() => me._navigateView(individual_product_item)}>
                        {individual_product_item.product_name}
                    </Button>
                    <Image source={individual_product_item.picture_url} style={{width: 193, height: 110, margin: 10}}/>
                    <Text>Cost ${individual_product_item.product_price.toFixed(2)}</Text>
                    <Slider minimumValue={0} maximumValue={10} step={1}
                            onValueChange={(value) => me.quantityChange(individual_product_item.product_id, value)}/>
                    <Text>Quantity: {me.state.products_to_show.get(individual_product_item.product_id).quantity}</Text>

                </View>;
            }
        );
        return <View>{ret_val}</View>;
    }

    /* Every time quantity changes, loop through our maps that contain <product_id, quantity> and
      <product_id, cost> to update the parent's state for total cost
     */
    quantityChange(product_id, new_quantity) {
        product_id = parseInt(product_id);
        new_quantity = parseInt(new_quantity);
        this.state.products_to_show.get(product_id).quantity = new_quantity;
        this.forceUpdate(); /* Force a re-render */

        let total_price = 0.0;
        for (var product_obj of this.state.products_to_show.values())
        {
            total_price = total_price + product_obj.getPrice();
        }

        this.props.parent.products_to_show = this.state.products_to_show; /* Propagate up the chain */
        this.props.parent.setState({cart_total: total_price});
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

    _navigateView(individual_product_item){
        var product_id
        this.props.navigator.push({
            title: individual_product_item.product_name,
            component: ProductInformationView,
            passProps:{
                productID: individual_product_item.product_id
            }   
        })
    }

    /* Called whenever a component is first shown */
    componentDidMount() {
        var store_id; 
        if(this.props.storeInfo.id){
            store_id = this.props.storeInfo.id.toString();
        }
        else{
            store_id = this.props.storeInfo.store_id.toString();
        }
         this.fetchData(GLOBAL.BASE_URL + "/store_menu/" + store_id);
        
    }

    /* Parses the responses for products*/
    parseResponse(responseJSON) {
        console.log("parse response");
        console.log(responseJSON);
        if (responseJSON.status == 400 || responseJSON == null)
        {
            console.log(responseJSON);
            /* Could not create, so throw up an alert and go back */
            Alert.alert("This store does not sell any products.");
            this.props.navigator.pop();
            return;
        }
        /* Convert the JSON response to JavaScript classes */

        if (!(responseJSON instanceof Array))
        {
            /* Only one object */
            let currentProductObj = new Product(responseJSON);
            this.state.products_to_show.set(currentProductObj.product_id, currentProductObj);
        }
        else {
            /* It is an array, so we should loop through it */
            for (var currentProductJSON of responseJSON) {
                /* Create the pure JavaScript object */
                let currentProductObj = new Product(currentProductJSON);
                /* Have mapping of <product_id, Product Object> for easy O(1) search */
                this.state.products_to_show.set(currentProductObj.product_id, currentProductObj);
            }
        }

        // this.setState({'loaded': true}); /* Force re-render */
        this.state.loaded = true;
        this.forceUpdate();
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

}

/* Component powering the content inside the Reviews Tab */
class ReviewListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, ratings_to_show: []};
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        /* Hack to get access to `this` inside nested function scope */
        let counter = 0;
        var ret_val;
        if (this.state.ratings_to_show.length == 0)
        {
            ret_val = <View><Text>No reviews yet!</Text></View> ;
        }
        else if (!(this.state.ratings_to_show instanceof Array))
        {
            /* Only one review */
            let individual_rating = this.state.ratings_to_show;
            ret_val = <View style={styles.card} key={1}>
                <Text
                    style={styles.elementTitle}>{1 + '. ' + individual_rating.reviewer_first_name}</Text>
                <Text style={styles.reviewText}>{individual_rating.feedback_text}</Text>
                <Text style={styles.dateText}>{individual_rating.feedback_date}</Text>
            </View>;
        }
        else {
            /* Multiple reviews */
             ret_val = this.state.ratings_to_show.map(
                function (individual_rating) {
                    return <View style={styles.card} key={counter++}>
                        <Text
                            style={styles.elementTitle}>{counter + '. ' + individual_rating.reviewer_first_name}</Text>
                        <Text style={styles.reviewText}>{individual_rating.feedback_text}</Text>
                        <Text style={styles.dateText}>{individual_rating.feedback_date}</Text>
                    </View>;
                }
            );
        }
        return <View>{ret_val}
		
		<Button 
              style={{backgroundColor: '#dcdcdc', marginTop: 5}} 
              textStyle={{fontSize: 20, color: 'black'}}
              //TODO: Manage Products Page
             onPress = {()=> this.showWriteReview()}>
              Add Review
          </Button>
		  </View>;
    }

    /* Shows the write review page */
    showWriteReview() {

        var store_id;
        if(storeInfo.id){
            store_id = this.props.storeInfo.id.toString();
        }
        else{
            store_id = this.props.storeInfo.store_id.toString();
        }
        this.props.navigator.push(
            {
                component: WriteReview,
                passProps: {
                    title: "Write A Review",
                    userID: this.props.userID.toString(),
                    storeID: store_id,
                    parentRef: this,
                    navigator: this.props.navigator,
                }
            }
        );

    }


    /* Called whenever a component is first shown */
    componentDidMount() {
        this.loadFromServer();
    }

    /* Called whenever a component is updated */
    componentDidUpdate() {
      // this.loadFromServer();
    }

    loadFromServer()
    {
        var store_id;
        if(this.props.storeInfo.id){
            store_id = this.props.storeInfo.id.toString();
        }
        else{
            store_id = this.props.storeInfo.store_id.toString();
        }
        this.fetchData(GLOBAL.BASE_URL + "/storefeedback/" + store_id);
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

export default class ProductPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false, /* Is the data loaded from the API yet */
            cart_total: 0.0, /* The price of all items selected */
            modal_text: "",
            show_spinner: true,
            searchData: "",
        };

        this.render = this.render.bind(this);
        this.products_to_show = new Map(); /* Set from the child component, ProductListing class */
    }

    render() {
        console.log("render product page");
        return (
        <ScrollableTabView
                parent_ref={this}
                style={{marginTop: 60,}}
                renderTabBar={() => <DefaultTabBar />}>
            <ScrollView style={{flex: 1}} tabLabel="Products">
            <View style = {{flexDirection: 'row'}}>
                <InformationInput ref = "SearchBar"/>
                <Button
                  style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}}
                  textStyle={{fontSize: 20, color: 'black'}}
                  onPress = {() => this.searchProduct()}>
                 Search
              </Button>
            </View>
                <ProductListing ref = "ProductListing" storeInfo={this.props.storeInfo} parent={this} navigator={this.props.navigator} userID={this.props.userID} searchData = {this.state.searchData}/>
                <Button onPress={() => this.buttonPressed()}>Purchase ${this.state.cart_total.toFixed(2)}</Button>
                <Modal swipeToClose={false} swipeArea={0} animationDuration={600} position={"center"} backdropPressToClose={false} ref={"purchaseModal"}>
                    <View style={styles.modalCard}>
                        <Text style={{textAlign: 'center'}}>{this.state.modal_text}</Text>
                        <ActivityIndicator
                            animating={this.state.show_spinner}
                            color="green"
                            size="large"
                        />
                    </View>
                </Modal>
            </ScrollView>
                <ScrollView tabLabel="Reviews" style={styles.tabView}>
                    <ReviewListing storeInfo={this.props.storeInfo} navigator={this.props.navigator} userID={this.props.userID}/>
                </ScrollView>
            </ScrollableTabView>
        )
            ;

    }

    buttonPressed()
    {
        // Called when the Purchase button is pressed
        // It opens up a modal screen
        // And places the order
        console.log("Logging! " + this.products_to_show);
        console.log(this.products_to_show);
        /* First make sure they have ordered at least one item */
        let non_zero_quantity_counter = 0;
        for (var product_obj of this.products_to_show.values())
        {
            if (product_obj.quantity > 0)
                non_zero_quantity_counter++;
        }
        if (non_zero_quantity_counter <= 0)
        {
            Alert.alert("You must order at least one item");
            return;
        }

        /* At this point they have ordered at least one item, so show a modal and kick off the request */
        this.state.modal_text = "Placing order, please wait ... ";
        this.forceUpdate();
        this.state.show_spinner = true;
        this.refs.purchaseModal.open(); /* Open the modal dialog */
        let me = this;
        setTimeout(() => {me.placeOrder()}, 3000); /* Wait 3 seconds to make nice visual */
    }

    // Called after the user presses a button to place an order
    placeOrder()
    {
        /* Called after the user presses the Purchase button */
        let url = GLOBAL.BASE_URL + "/orders";
        // convert our map of <product_id, Product obj> to an array of [Product]
        let array_of_products = Array.from(this.products_to_show.values());

        // convert our array of [Product] to [{json}]
        let array_of_products_json = array_of_products.map(function convert_to_json(productObj)
        {
            return {'product_id': productObj.product_id,
                    'quantity': productObj.quantity
            }
        });
        let json_to_send = {'user_id': this.props.userID,
                            'delivery': 1,  /* Assume delivery for now */
                            'address': null, /* Use address on file for now */
                            'products': array_of_products_json};

        console.log(array_of_products);
        fetch(url,
            {
                method: 'POST',
                body: JSON.stringify(json_to_send)
            }).then((responseData) => {
            this.responseAfterOrderPlaced(responseData);
        })
            .done();
    }

    responseAfterOrderPlaced(responseData)
    {
        /* TODO: Make sure the response is okay. Assume success for now!*/
        console.log("after order placed");
        console.log(responseData);
        console.log(responseData.json());
        this.state.modal_text = 'Success! Thank you for the business.';
        this.state.show_spinner = false;
        this.forceUpdate();
        let me = this; /* hack to get reference inside nested scope */
        setTimeout(() => {me.refs.purchaseModal.close(); me.forceUpdate(); }, 3000);
    }

    //Listener for Search bar
    searchProduct(){
        if(!this.refs.SearchBar.get_value()){
            Alert.alert('Uh...', 'Please enter something to search.', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
            return(null);
        }
        this.setState({searchData: this.refs.SearchBar.get_value()});
        Alert.alert('Uh...', 'Searching products is broken for now.', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
        this.forceUpdate();
    }

}

const styles = StyleSheet.create({
	titleText: {
		fontFamily: 'Arial',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	
	elementTitle: {
		fontFamily: 'Arial',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center'
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
    modalCard: {
        borderWidth: 3,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        marginTop: 120,
        margin: 5,
        padding: 25,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,


    },
    container:{
        flex: 1,
        marginTop: 30,
        backgroundColor: '#F5FCFF',
    },
	
});



