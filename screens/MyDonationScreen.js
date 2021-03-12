import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader.js";
import firebase from "firebase";
import db from "../config";
import {RFValue} from 'react-native-responsive-fontsize';
export default class MyDonationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      donorId : firebase.auth().currentUser.email,
      allDonations: [],
      userId: firebase.auth().currentUser.email,
      donorName:'',
    };
    this.requestRef = null;
  }
  getAllDonations = () => {
    console.log("function executed");
    this.requestRef = db
      .collection("all_donation")
      .where("donor_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allDonations = []
        snapshot.docs.map((doc)=>{
          var donation = doc.data();
          donation["doc_id"] = doc.id
          allDonations.push(donation)
        })
      
        this.setState({
          allDonations : allDonations
        });
      });
  };
  sendBook = (bookDetails) => {
    if (bookDetails.request_status === "Book Sent") {
      var requestStatus = "Donor Interested";
      db.collection("all_donation").doc(bookDetails.doc_id).update({
        request_status: "Donor Interested",
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = "Book Sent";
      db.collection("all_donation").doc(bookDetails.doc_id).update({
        request_status: "Book Sent",
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  getDonorDetails=(donorId)=>{
    db.collection("users").where("email","==",donorId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          "donorName":doc.data().name + " " + doc.data().last_name,
        })
      })
    })
  }
  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.donor_id;
    db.collection("all_notification")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var message = '';
          if(requestStatus == "Book Sent"){
            message = this.state.donorName + " Has sent the book to you!"
          }
          else{
            message = this.state.donorName + " Has shown interest in donating the book!"
          }
          db.collection("all_notfication").doc(doc.id).update({
            "message":message,
            "notification_status":"unread",
            "date":firebase.firestore.FieldValue.serverTimestamp()
          })
        })
      })
  }
  componentDidMount() {
    this.getAllDonations();
    this.getDonorDetails(this.state.donorId);
  }
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{item.book_name}</ListItem.Title>

          <View style={styles.subtitleView}>
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {"Requested By : " +
                item.requested_by +
                "\nStatus : " +
                item.request_status}
            </ListItem.Subtitle>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    item.request_status === "Book Sent" ? "green" : "#ff5722",
                },
              ]}
              onPress={() => {
                this.sendBook(item);
              }}
            >
              <Text style={{ color: "#ffff" }}>
                {item.request_status === "Book Sent"
                  ? "Book Sent"
                  : "Send Book"}
              </Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };
  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="My Donations" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  button: {
    flex: 0.2,
    width: 100,
    height: 30,
    alignSelf: "end",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  subtitleView: {
    flex: 1,
    flexDirection: "row",
    padding: 2,
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
