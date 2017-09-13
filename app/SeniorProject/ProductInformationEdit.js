/*
* Product Information Scene that displays specific 
* information for a specific product.
* This page can be used in 3 ways:
* 1. View the contents of a current product
* 2. Edit an existing product.
* 3. Create a new product.
*/

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Navigator,
  ScrollView,
  Image,
} from 'react-native';

import ModalPicker from 'react-native-modal-picker'

import Button from 'apsl-react-native-button';

import AllergyPicker from './AllergyPicker.js';

const dismissKeyboard = require('dismissKeyboard');
let GLOBAL = require('./Globals');


/*
*Information Input 
*/
class InformationInput extends Component{
  constructor(props){
    super(props);
    this.state = {text: this.props.init};
  }

  render(){
    return (
          <TextInput style = {styles.textinput} 
            maxLength = {120}
            onChangeText = { (text) => this.setState({text})}
            onSubmitEditing = {dismissKeyboard}
            editable = {this.props.edit} //True if its editable. False otherwise.
            value = {this.state.text}
           />
        );
  }

  get_value(){
    if (this.state.text)
      {
          return this.state.text;
      }
      else return "";
  }
}
//MultiLineInput used for Product Description.
class MultiLineInput extends Component{
  constructor(props){
    super(props);
    this.state = {text: this.props.init};
  }

  render(){
    return (
       <TextInput style = {styles.multiLineInput} 
            multiline =  {true}
            maxLength = {250}
            onChangeText = { (text) => this.setState({text})}
            onSubmitEditing = {dismissKeyboard}
            editable = {this.props.edit} //True if its editable. False otherwise.
            value = {this.state.text}
           />
      )
  }

  get_value(){
    if (this.state.text)
      {
          return this.state.text;
      }
      else return "";
  }


}

//Allergy List Render Used to display the allergens associated with a product.
class AllergyList extends Component{
    constructor(props){
      super(props);
    }
    render(){
      //console.log("Allergy init: " + this.props.init);
      if(this.props.init != null){
      return(
          <Text style = {{fontSize: 14,
          textAlign: 'left',
          color: '#333333',}}>
          {this.props.init}
          </Text>
        )
    }
    else{
      return(
        <Text style = {{fontSize: 20,
          textAlign: 'left',
          color: '#333333',}}>
          None
          </Text>
        )    }
    }
}

//Dynamic product image component
class ProductImage extends Component{
  constructor(props){
    super(props);
    if(this.props.init != null){
      this.state = {source: this.props.init}
    }
    else{
      this.state = {source: 'https://www.getupandgobaked.com/wp-content/uploads/2015/03/smart-cookie-pic-copy.jpg'}
    }
  }
  render(){
    return(
      <Image
        style={{width: 193, height: 110, alignSelf: 'center', margin: 10}}
        source={{uri: this.state.source}}
       />
      )
  }
  get_value(){
    if (this.state.source)
      {
          return this.state.source;
      }
      else return "";
  }


}

class PriceInput extends Component{
  constructor(props){
    super(props);
    this.state = {text: this.props.init};
  }

  render(){
    return(
      <TextInput style = {styles.priceInput}
        maxLength = {2}
        onChangeText = { (text) => this.setState({text})}
        onSubmitEditing = {dismissKeyboard}
        keyboardType = {'numeric'}
        editable = {this.props.edit} //True if its editable. False otherwise.
        value = {this.state.text}/>
      )
  }

  get_value(){
    return(this.state.text);
  }

}

//Dynamic button that changes based on the type of product page
class DynamicButton extends Component{
  constructor(props){
    super(props); //Props: will be props passed from scene.
    this.state = {text: ''};
  }

    render(){
      if(this.props.typeScene === 'NEW'){
        return(
          <Button 
            style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
            textStyle={{fontSize: 20, color: 'black'}}
            onPress = {() => this.refs.ProductImage.setState({source: "http://s18.postimg.org/u0s2v734p/bourbon_biscuit.jpg"})}>
            Submit
          </Button>
          )
      }
    }
  }



export default class ProductInformationEdit extends Component{
  constructor(props){
    super(props) 
    /*Props for this scene:
      typeScene: has 3 possible values:
          'NEW' = new product entry
          'EDIT' = edit a current product
          'VIEW' = view a current product.
      productID: the specific productID (unless it's new)
      merchantID: the current baker viewing the page (if there is one)
      storeID: the current store viewing the page (if there is one)
    */
    //typeScene: 'Submit',
    this.state =  {
      productdata: '', //Data for a specific product. 
      loaded: false,
      //typeScene: "VIEW", //Hard coded for debugging. Change if you want to see the other views.
      dollarPrice: '',
      centPrice: '',
      allergyList: 'Create Product First.',
    }
  }

  render(){
    console.log("RENDERING PRODUCT INFO")
    console.log (this.props.typeScene);
    console.log(this.props.storeID);
    console.log(this.props.merchantID);
    console.log(this.state.productdata);
    console.log(this.state.productdata.name);
    if (!this.state.loaded)
        {
            // Have we loaded this page yet?
            // If not, let's load it and show a loading screen
            return this.renderLoadingView();
        }


  /*BAKER VIEW>*/
  /*<Button 
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}>
              Edit Picture Test Blahblah
          </Button>
          */
    return(
    <TouchableWithoutFeedback onPress = {dismissKeyboard}>
    <ScrollView style = {{flex:1}}>
      <View style = {styles.index}>

        <View style = {styles.pictureframe}>
            <ProductImage ref = 'ProductImage' init = {this.state.productdata.picture}/> 
            <Text style = {{fontSize: 20,textAlign: 'center',color: '#333333'}}>
              Picture Link:
            </Text>
            <InformationInput ref = "ImageLink" init = {this.state.productdata.picture}/>
          </View>


          <View style = {styles.infoContainer}>
          <Text style= {styles.textHeader}> 
             Name:
            </Text>
           <InformationInput ref = "ProductNameInput" init = {this.state.productdata.name} />
          </View>

          <View style = {styles.infoContainer}>
           <Text style = {styles.textHeader2}>
            Description:
            </Text>
            <MultiLineInput ref = "DescriptionInput" init = {this.state.productdata.description}/>
            </View>

          <View style = {styles.infoContainer}>
          <Text style = {styles.textHeader}>
            Type of good:
          </Text>
          <InformationInput ref = "TypeInput" init = {this.state.productdata.type}/>
          </View>

          <View style = {styles.infoContainer}>
              <Text style = {styles.textHeader}>
              Allergy List: 
              </Text>
          <AllergyList ref = "AllergyList" init = {this.state.allergyList}/>
          </View>


          <View style= {styles.infoContainer}>
            <AllergyPicker ref = "AllergyPicker"/>
          </View>

          <View style = {styles.infoContainer}>
            <Button 
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {() => this.postAllergen(this.refs.AllergyPicker.state.allergyState)}>
            Add Allergy
          </Button>
          </View>
        
          <View style = {styles.infoContainer}>
            <Text style= {styles.priceHeader}> 
             Price:
            </Text>
            <Text style = {styles.textHeader}>
             $
            </Text>
            <PriceInput ref = "DollarInput" init = {this.state.dollarPrice}/>
            <Text style = {styles.textHeader}>
             .
            </Text>
            <PriceInput ref = "CentInput" init = {this.state.centPrice}/>
        </View>

          <View style = {styles.infoContainerBottom}>
          <Text style = {styles.textHeader}>
            Unit Amount:
          </Text>
          <PriceInput ref = "UnitInput" init = {this.parseUnit(this.state.productdata.unit_amount)}/>
          </View>

        <View style = {styles.buttonview}>
             <Button 
              style={{backgroundColor: '#dcdcdc', alignSelf: 'center'}} 
              textStyle={{fontSize: 20, color: 'black'}}
              onPress = {() => this.checkType()}>
            Submit
          </Button>
        </View>
      </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )

}

parseUnit(unit_amount){
  if(unit_amount == null){
    return(null);
  }
  else{
    return unit_amount.toString();
  }
}

checkType(){
  if(this.props.typeScene === 'NEW'){
    this.postProduct();
  }
  else{
    this.updateProduct();
  }
}

renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

  componentDidMount() {
    console.log("TypeScene: " + this.props.typeScene);
      if(this.props.typeScene === 'EDIT'){ //TODO: Change to props.
          console.log("Product ID: " + this.props.productID);
          this.fetchAllergens(GLOBAL.BASE_URL + "/products/" + this.props.productID + "/allergens");
          this.fetchData(GLOBAL.BASE_URL + "/products/" + this.props.productID);
      }
      else
        this.setState({loaded: true});
  }

  fetchData(url){
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

  fetchAllergens(url){
    return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                if(!Array.isArray(responseJSON)){
                  responseJSON = [responseJSON];
                }
                this.parseAllergenResponse(responseJSON);
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
        this.parsePrice(responseJSON.price);
        this.setState({'loaded': true, productdata: responseJSON});
        //console.log(responseJSON.price);
    }

    parseAllergenResponse(responseJSON){
      console.log("Parsing allergies");
      //console.log(responseJSON);
      var finalList = [];
      var resultString = "";
      var check= true;
      for(i = 0; i < responseJSON.length; i++){
        if(responseJSON[i].status == 400){
          //console.log("Nothing in Json");
          this.setState({allergyList: null})
          check = false;
          i = responseJSON.length; //Bail out of loop.
        }
        else{
          finalList.push(responseJSON[i].allergen);
        }
      }

      if(check){
        for(i = 0; i < finalList.length; i++){
            resultString = resultString + finalList[i] + ", ";
        }
        this.setState({allergyList: resultString});
      }
    }

  //Update a current product
  updateProduct(){
    let url = GLOBAL.BASE_URL + "/products/" + this.props.productID;
    console.log("Updating product " + this.props.productID);
    let newprice1 = parseFloat(this.refs.DollarInput.get_value() + "." + this.refs.CentInput.get_value());
    let newprice2 = newprice1.toFixed(2);
    console.log("Price to send:" + newprice2);

    let json_to_send = {  
      'name': this.refs.ProductNameInput.get_value(), 
      'price': newprice2,
      'picture': this.refs.ImageLink.get_value(),
      'description': this.refs.DescriptionInput.get_value(),
      'type': this.refs.TypeInput.get_value(),
      'unit_amount': parseInt(this.refs.UnitInput.get_value()),
    };

     fetch(url,
          {
              method: 'PUT',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(json_to_send)
          }).then((responseData) => {
          console.log(responseData);
          this.props.navigator.pop(); /* go back to login screen */
          Alert.alert('Ok!', 'Product has been updated!', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
      })
          .done();


  }

  //Post a new product
  postProduct(){
    let url = GLOBAL.BASE_URL + "/products/";

    console.log("Posting new product");
    let newprice1 = parseFloat(this.refs.DollarInput.get_value() + "." + this.refs.CentInput.get_value());
    let newprice2 = newprice1.toFixed(2);
    var imageLink;
    console.log("Picture link: " + this.refs.ImageLink.get_value());
    if(this.refs.ImageLink.get_value() == "" || this.refs.ImageLink.get_value() == null){
            imageLink = 'https://www.getupandgobaked.com/wp-content/uploads/2015/03/smart-cookie-pic-copy.jpg';
      }
      else{
        imageLink = this.refs.ImageLink.get_value();
      }
    console.log("Price to enter: " + newprice2);
      let json_to_send =
      {
          'store_id': this.props.storeID,   
          'name': this.refs.ProductNameInput.get_value(), 
          'price': newprice2,
          'picture': imageLink,
          'description': this.refs.DescriptionInput.get_value(),
          'type': this.refs.TypeInput.get_value(),
          'unit_amount': parseInt(this.refs.UnitInput.get_value()),
      };
      console.log(json_to_send);
      fetch(url,
          {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(json_to_send)
          }).then((responseData) => {
          console.log(responseData);
          this.props.navigator.pop(); /* go back to login screen */
          Alert.alert('Ok!', 'Product has been posted!', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
      })
          .done();

  }

  /*
    Post a new Allergy */
  postAllergen(allergyType){
    let url = GLOBAL.BASE_URL + "/products/allergens";

    if(this.props.productID == null){ //Check conditions. 
    Alert.alert('Uh...', "Can't add allergies to a non existing product. Create the product first.", 
      [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
      return;
    }

    if(allergyType == null){ //If either product ID or allergy type is null, return.
      Alert.alert('Uh...', "Please select an allergy first.", [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
      return;
    }

    console.log("Posting new allergen.");

    let json_to_send = 
    {
      'product_id': this.props.productID,
      'allergen' : allergyType,
    };

    console.log(json_to_send);

    fetch(url,{
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          },
      body: JSON.stringify(json_to_send)
    }).then((responseData) => {
          console.log(responseData);
          console.log("Post response above.")
          this.setState({allergyList: this.state.allergyList + allergyType + ", "}); //Don't re-load the allergies, but do this.
          Alert.alert('Ok!', 'Allergen has been added', [{text: 'OK', onPress: () => console.log('OK Pressed')} ])
      })
          .done();
  }

  parsePrice(price){
    let str = price.toString();
    let res = str.split(".");
    //console.log(res);

    if(res[0].length == 1){
      res[0] = "0" + res[0];
    }

    if(res.length == 1){
      res[1] = "0";
    }

    if(res[1].length == 1){
      res[1] = res[1] + "0";
    }

    let test1 = res[0];
    let test2 = res[1];

    //console.log(res);
    this.setState({dollarPrice: test1, centPrice: test2});

    //console.log(this.state.dollarPrice);
    //console.log(this.state.centPrice);
  }



}


const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  infoContainerBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
    paddingBottom: 20
  },
  priceInput: {
    height: 40,
    paddingRight: 30,

  },
  textHeader: {
    //flex:1,
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
    //paddingRight: 0
  },
  textHeader2: {
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
  },
  index:{
    flex:1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
  margin: 0
  },
  pictureframe:{
    alignSelf: 'center',
    marginTop: 55,
  },

  buttonview:{
    paddingTop: 10  
  },

  textinput:{
    height: 40,  
    width: 250,
  },
  multiLineInput:{
    height: 60,
    width: 250
  },
  priceHeader:{
    paddingRight: 30,
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
  }

});