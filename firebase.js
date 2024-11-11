// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQuzhT9kh6CvwzIE-diZ21XzKB8N_Ypz8",
  authDomain: "wad2-3b994.firebaseapp.com",
  databaseURL:
    "https://wad2-3b994-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad2-3b994",
  storageBucket: "wad2-3b994.appspot.com",
  messagingSenderId: "841306816388",
  appId: "1:841306816388:web:1e089a4bdb598e5d7227d1"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// import { getFirestore, doc, getDoc, updateDoc, arrayUnion, addDoc, collection } from  "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js"

const db = firebase.firestore();

function getProduct(productID) {
  return db.collection("Products").doc(productID)
        .get()
        .then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        })
        .catch((error) => {
        console.log("Error getting document:", error);
        });
}

function getReview(reviewID) {
    return db.collection("Reviews").doc(reviewID)
            .get()
            .then((doc) => {
            if (doc.exists) {
                return doc.data()
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            })
            .catch((error) => {
            console.log("Error getting document:", error);
            });
}

function getUser(userID) {
    return db.collection("Users").doc(userID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
}

function getBooking(userID, productID) {
    let bookingID = userID+productID
    return db.collection("Bookings").doc(bookingID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
}

function getAllReviews() {
  let storage = {};
  return db.collection("Reviews")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        let id = doc.id;
        storage[id] = doc.data();
      });
      return storage
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function getAllUsers() {
  let storage = {};
  return db.collection("Users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        let id = doc.id;
        storage[id] = doc.data();
      });
      return storage
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function getAllProducts() {
  let storage = {};
  return db.collection("Products")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        let id = doc.id;
        storage[id] = doc.data();
      });
      return storage
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function getAllBookings() {
    let storage = {};
    return db.collection("Bookings")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          let id = doc.id;
          storage[id] = doc.data();
        });
        return storage
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
}


function setReviews(rate, revdesc, author, productID) {
  // Add a new document with a generated id.
  db.collection("Reviews")
    .add({
      date: firebase.firestore.FieldValue.serverTimestamp(),
      productid: productID,
      rating: rate,
      review: revdesc,
      reviewuser: author
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      let newid = docRef.id;

      //Updates Review Array in User 
      db.collection("Users")
        .doc(author)
        .update({
          reviews: firebase.firestore.FieldValue.arrayUnion(newid)
        })
        .then(console.log("Updated Review Array of ", author))
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      // Updates Review Array of Product
      db.collection("Products")
        .doc(productID)
        .update({
          reviews: firebase.firestore.FieldValue.arrayUnion(newid)
        })
        .then(console.log("Updated Review Array of ", productID))
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function setProducts(lat, long, featarr, imagelink, local, toolname, ownername, sgd, taskarr, vidlink) {
    // Add a new document with a generated id.
    db.collection("Products")
    .add({
      coordinates: { latitude: lat, longditude: long },
      features: featarr,
      img: imagelink,
      location: local,
      name: toolname,
      ownerid: ownername,
      price: sgd,
      reviews: [],
      tasks: taskarr,
      video: vidlink
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      let newid = docRef.id;

      // Updates Ownership Array of Users
      db.collection("Users")
        .doc(ownername)
        .update({
          listings: firebase.firestore.FieldValue.arrayUnion(newid)
        })
        .then(console.log("Updated Ownership Array of ", ownername))
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    });
}

function setUser(mailaddress, pw, pfp, name) {
  // Add a new document with a generated id.
  db.collection("Users")
    .add({
      bookings: [],
      email: mailaddress,
      listings: [],
      password: pw,
      profilepicture: pfp,
      reviews: [],
      username: name
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function setBooking(dollar, startwhen,  endwhen, image, toolname, ownerID, owNusername, productID, renterID, renTusername) {
    // Add a new document with a generated id.
    let bookingID = renterID + productID
    db.collection("Bookings").doc(bookingID)
      .set({
        cost: dollar,
        enddate: endwhen,
        img: image,
        name: toolname, 
        ownerid: ownerID,
        ownerusername: owNusername,
        productid : productID,
        renterid : renterID,
        renterusername : renTusername, 
        startdate: startwhen
      })
      .then(
        //Updates Booking Array in rentUser  
        db.collection("Users")
          .doc(renterID)
          .update({
            bookings: firebase.firestore.FieldValue.arrayUnion(productID)
          })
          .then(console.log("Updated Booking Array of ", renterID))
          .catch((error) => {
            console.error("Error adding document: ", error);
          })
      )
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
}

async function deleteUser(userID) {
    let user = await getUser(userID)
    let productarr = user.listings
    let reviewarr = user.reviews
    let bookingarr = user.bookings
    db.collection("Users").doc(userID).delete()
    .then(() => {
        console.log("Document successfully deleted!");
        for (productID of productarr) {
            db.collection("Products").doc(productID).delete()
            .then(console.log(`Removed Product ${productID}`))
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
        for (reviewID of reviewarr) {
            db.collection("Reviews").doc(reviewID).delete()
            .then(console.log(`Removed Review ${reviewID}`))
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
        }

        for (bookingID of bookingarr) {
            let combineID = userID + bookingID
            db.collection("Bookings").doc(combineID).delete()
            .then(console.log(`Removed Booking ${combineID}`))
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
        }

    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

async function deleteReview(reviewID) {
    let review = await getReview(reviewID)
    let productID = review.productid
    db.collection("Reviews").doc(reviewID).delete()
    .then(() => {
        console.log("Document successfully deleted!");
        db.collection("Products").doc(productID)
        .update({
            reviews: firebase.firestore.FieldValue.arrayRemove(reviewID)
        })
        .then(console.log(`Removed From Product ${productID}`))
        .catch((error) => {
            console.error("Error removing document: ", error);
        });
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


async function deleteProduct(productID) {
    let product = await getProduct(productID)
    let ownerID = product.ownerid
    db.collection("Products").doc(productID).delete()
    .then(() => {
        console.log("Document successfully deleted!");
        db.collection("Users").doc(ownerID)
        .update({
            listings: firebase.firestore.FieldValue.arrayRemove(productID)
        })
        .then(console.log(`Removed From Owner ${ownerID}`))
        .catch((error) => {
            console.error("Error removing document: ", error);
        });
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

async function deleteBooking(userID, productID) {
    let bookingID = userID+productID
    let booking = await getBooking(userID,productID)
    let renterID = booking.renterid
    db.collection("Bookings").doc(bookingID).delete()
    .then(() => {
        console.log("Document successfully deleted!");
        db.collection("Users").doc(renterID)
        .update({
            bookings: firebase.firestore.FieldValue.arrayRemove(productID)
        })
        .then(console.log(`Removed Product From Owner ${renterID}`))
        .catch((error) => {
            console.error("Error removing document: ", error);
        });
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}