import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Image,
  TouchableHighlight
} from "react-native";
import {BookSearch} from 'react-native-google-books';
import {ListItem,Input} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize'
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
export default class BookRequestScreen extends React.Component {
  //AIzaSyD2trvrp7b12XNK1FCQk49U3Yu6uk4l4FI
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",
      isBookRequestActive:false,
      userDocId:"",
      bookStatus:'',
      requestedBookName:'',
      docId:'',
      userDocId:'',
      requestId:'',
      dataSource:'',
      requestedImageLink: "",
      showFlatList:false
      };
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyD2trvrp7b12XNK1FCQk49U3Yu6uk4l4FI"
    );
    await db.collection("requested_books").add({
      "user_id": userId,
      "book_name": bookName,
      "reason_to_request": reasonToRequest,
      "request_id": randomRequestId,
      "book_status":"requested",
      "image_Link": books.data[0].volumeInfo.imageLinks.thumbnail,
      "date":firebase.firestore.FieldValue.serverTimestamp()
    });
  
     this.getBookRequest();
    db.collection("users").where("email","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
      isBookRequestActive: true
      })
    })
  })
  this.setState({
    bookName: "",
    reasonToRequest: "",
  });

    return Alert.alert("Book Requested Successfully");
  };
  getIsBookRequestActive=()=>{
    db.collection("users").where("email","==",this.state.userId).onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          isBookRequestActive: doc.data().isBookRequestActive,
          userDocId : doc.id
        })
      })
    })
  }
  getBookRequest=()=>{
    db.collection("requested_books").where("user_id","==",this.state.userId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().book_status !== "received"){
          this.setState({
            requestedBookName:doc.data().book_name,
            bookStatus:doc.data().book_status,
            docId: doc.id,
            requestId:doc.data().request_id,
            requestedImageLink: doc.data().image_link,
          })
        }
      })
    });
  }
  
  componentDidMount=async()=>{
    this.getIsBookRequestActive();
    this.getBookRequest()
    
  }

  sendNotification=()=>{
    db.collection("users").where("email","==",this.state.userId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().name
        var lastname = doc.data().last_name
        db.collection("all_notification").where("request_id","==",this.state.requestId).get().then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var donorId = doc.data().donor_id
            var bookName =  doc.data().book_name
            db.collection("all_notification").add({
              "target_user_id":donorId,
              "message":  name + " " + lastname + " received the book " + bookName,
              "notification_status":"unread",
              "book_name":bookName
            })
          })
        })
      })
    })
  }

  updateBookRequestStatus=()=>{
    db.collection("request_books").doc(this.state.docId).update({
      "book_status":"received"
    })

    db.collection('users').doc(this.state.userDocId).update({
      "isBookRequestActive":false
    })


  }

  receiveBooks=(bookName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_books').add({
      "user_id":userId,
      "book_name":bookName,
      "request_id":requestId,
      "bookStatus":"received"
    })
  }
  renderItem=({item,i})=>{
    return(
      <TouchableHighlight style={{alignItems:"center",backgroundColor:"#DDDDD",padding:10,width:" 90%"}}
        activeOpacity={0.6}
        underlayColor="#DDDDD"
        onPress={
          ()=>{
            this.setState({
              showFlatList:false,
              bookName:item.volumeInfo.title
            })
          }
        }
        bottomDivider
      >
        <Text>
        {item.volumeInfo.title}
        </Text>
      </TouchableHighlight>
    )
  }

  async getBooksFromApi(bookName){
    console.log(bookName);
    this.setState({
      bookName: bookName,
    });
    if(bookName.length >2){
      var books = await  BookSearch.searchBook(bookName,'AIzaSyD2trvrp7b12XNK1FCQk49U3Yu6uk4l4FI');
      console.log(books);
      this.setState({
        dataSource:books.data,
        showFlatList:true
      })
    }
  }
  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Book Status" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            <Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />
          </View>
          <View
            style={styles.bookstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),

              }}
            >
              Name of the book
            </Text>
            <Text
              style={styles.requestedbookName}
            >
              {this.state.requestedBookName}
            </Text>
            <Text
              style={styles.status}
            >
              Status
            </Text>
            <Text
              style={styles.bookStatus}
            >
              {this.state.bookStatus}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateBookRequestStatus();
                this.receiveBooks(this.state.requestedBookName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Book Recived
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Book Name"}
            placeholder={"Book name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => this.getBooksFromApi(text)}
            onClear={(text) => this.getBooksFromApi()}
            value={this.state.bookName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"Reason"}
                placeholder={"Why do you need the book"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.bookName,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderWidth: 1,
    padding: 10,
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  bookstatus:{
    flex: 0.4,
    alignItems: "center",

  },
  requestedbookName:{
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
    fontWeight: "bold",
    alignItems:'center',
    marginLeft:RFValue(60)
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(30),
  },
  bookStatus:{
    fontSize: RFValue(30),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});