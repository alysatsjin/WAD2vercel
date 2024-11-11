// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQuzhT9kh6CvwzIE-diZ21XzKB8N_Ypz8",
  authDomain: "wad2-3b994.firebaseapp.com",
  databaseURL: "https://wad2-3b994-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad2-3b994",
  storageBucket: "wad2-3b994.firebasestorage.app",
  messagingSenderId: "841306816388",
  appId: "1:841306816388:web:1e089a4bdb598e5d7227d1"
};

// Initialize Firebase
const firebaseapp = firebase.initializeApp(firebaseConfig);
// import { getFirestore, doc, getDoc, updateDoc, arrayUnion, addDoc, collection } from  "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js"

const db = firebaseapp.firestore();

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
      console.log(`Error accessing database: ${error}`);
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
      console.log(`Error accessing database: ${error}`);
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
      console.log(`Error accessing database: ${error}`);
    });
}

function getBooking(bookingID) {
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
      console.log(`Error accessing database: ${error}`);
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
      console.log(`Error accessing database: ${error}`);
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
      console.log(`Error accessing database: ${error}`);
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
      console.log(`Error accessing database: ${error}`);
    });
}


function setReviews(rate, revdesc, author, productName, productID) {
  // Add a new document with a generated id.
  db.collection("Reviews")
    .add({
      date: firebase.firestore.FieldValue.serverTimestamp(),
      rating: rate,
      review: revdesc,
      reviewuser: author,
      reviewproductname: productName,
      reviewedproductid: productID,
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

async function setProducts(lat, long, featarr, imagelink, local, toolname, ownerid, ownerusername, sgd, taskarr, vidlink) {
  // Add a new document with a generated id.
  return new Promise((resolve, reject) => {
    db.collection("Products")
      .add({
        coordinates: { latitude: lat, longditude: long },
        features: featarr,
        img: imagelink,
        location: local,
        name: toolname,
        ownerid: ownerid,
        ownerusername: ownerusername,
        price: sgd,
        reviews: [],
        tasks: taskarr,
        video: vidlink
      })
      .then((docRef) => {
        let newid = docRef.id;

        // Updates Ownership Array of Users
        db.collection("Users").doc(ownerid).update({
          listings: firebase.firestore.FieldValue.arrayUnion(newid)
        })
          .then(() => { resolve(`New Item Added with ID: ${newid}`) })
          .catch((error) => { reject(`Error Adding New Item. Error Code: ${error}`) });
      })
      .catch((error) => { reject(`Error Adding New Item. Error Code: ${error}`) });;
  })
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
      username: "@" + name,
      cart: []
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function setBooking(dollar, startwhen, endwhen, image, toolname, ownerID, owNusername, productID, renterID, renTusername) {
  // Add a new document with a generated id.
  db.collection("Bookings")
    .add({
      cost: dollar,
      enddate: firebase.firestore.Timestamp.fromDate(endwhen),
      img: image,
      name: toolname,
      ownerid: ownerID,
      ownerusername: owNusername,
      productid: productID,
      renterid: renterID,
      renterusername: renTusername,
      startdate: firebase.firestore.Timestamp.fromDate(startwhen)
    })
    .then((docRef) => {
      let newid = docRef.id;
      console.log("Document written with ID: ", newid);

      //Updates Booking Array in rentUser  
      db.collection("Users").doc(renterID)
        .update({
          bookings: firebase.firestore.FieldValue.arrayUnion(newid)
        })
        .then(console.log("Updated Booking Array of ", renterID))
        .catch((error) => {
          console.error("Error adding document: ", error);
        })
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

async function deleteUser(userID) {
  let user = await getUser(userID)
  let productarr = user.listings
  let reviewarr = user.reviews
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
          .then(console.log(`Removed Product ${reviewID}`))
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
  return new Promise((resolve, reject) => {
    db.collection("Products").doc(productID).delete()
      .then(() => {
        // console.log("Document successfully deleted!");
        db.collection("Users").doc(ownerID)
          .update({ listings: firebase.firestore.FieldValue.arrayRemove(productID) })
          .then(() => {
            resolve(`Item ${product.name} successfully removed`)
          })
          .catch((error) => {
            reject(`Error removing item. Error Code: ${error}`);
          });
      }).catch((error) => {
        reject(`Error removing item. Error Code: ${error}`);
      });
    // 
  })
}

async function deleteBooking(bookingID) {
  let booking = await getBooking(bookingID)
  let renterID = booking.renterid
  db.collection("Bookings").doc(bookingID).delete()
    .then(() => {
      console.log("Document successfully deleted!");
      db.collection("Users").doc(renterID)
        .update({
          bookings: firebase.firestore.FieldValue.arrayRemove(bookingID)
        })
        .then(console.log(`Removed Product From Owner ${renterID}`))
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function formatDate(date) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(',', '');
}

function capitalizeWords(str) {
  return str.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

async function getLocationName(lat, lon) {
  const apiKey = 'AIzaSyDacCc9DnnoMNKLMRZC9IaGIoj20FnB4qs'; // Replace with your Google Maps API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    fetch(url).then(response => {
      response.json().then(data => {
        if (data.status === "OK") {
          resolve(data.results[0].formatted_address)
        }
        else (
          reject(data.status)
        )
          .catch(error => reject(error))
      })
    })
      .catch(error => reject(error))
  })
}

async function getLatLong(location) {
  const apiKey = 'AIzaSyDacCc9DnnoMNKLMRZC9IaGIoj20FnB4qs'; // Replace with your Google API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    fetch(url).then(response => {
      response.json()
        .then((data) => {
          if (data.status === "OK") {
            const location = data.results[0].formatted_address;
            if (location.search("Singapore") != -1) {
              const lat = data.results[0].geometry.location.lat;
              const lng = data.results[0].geometry.location.lng;
              resolve([lat, lng, location]);
            }
            else {
              reject("Please provide a Singapore address")
            }
          }
          else {
            reject("Invalid address given")
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
      .catch((error) => {
        reject(error)
      })
  })
}
async function setBookings(cost, enddate, img, name, ownerid, productid, renterid, startdate) {
  console.log("Adding booking with data:", {
    cost,
    enddate,
    img,
    name,
    ownerid,
    productid,
    renterid,
    startdate
  });

  return new Promise((resolve, reject) => {
    db.collection("Bookings")
      .add({
        cost: cost,
        enddate: enddate,
        img: img,
        name: name,
        ownerid: ownerid,
        productid: productid,
        renterid: renterid,
        startdate: startdate
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        resolve(docRef.id);  // Resolve the promise with the document ID
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        reject(`Error Adding New Item. Error Code: ${error}`);
      });
  });
}

function updateProduct(productID, lat, long, featarr, imagelink, local, toolname, ownerid, ownerusername, sgd, taskarr, vidlink) {
  return new Promise((resolve, reject) => {
    db.collection("Products").doc(productID).update({
      "coordinates.latitude": lat,
      "coordinates.longditude": long,
      "features": featarr,
      "img": imagelink,
      "location": local,
      "name": toolname,
      "ownerid": ownerid,
      "ownerusername": ownerusername,
      "price": sgd,
      "reviews": [],
      "tasks": taskarr,
      "video": vidlink
    }).then(() => resolve(console.log(`Updated ${productID}`)))
      .catch((error) => {
        reject(`Error adding document: ${error}`);
      });
  })
}
function getUsername(userID) {
  return db.collection("Users").doc(userID)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().username;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}