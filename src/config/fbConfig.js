import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Replace this with your own config details
var config = {
  apiKey: "AIzaSyBFgLCQmisHYerGEvvo-2NbXyfdIoB8Sh8",
  authDomain: "booklibrary-yakipudding.firebaseapp.com",
  databaseURL: "https://booklibrary-yakipudding.firebaseio.com",
  projectId: "booklibrary-yakipudding",
};
firebase.initializeApp(config);

export const firestore = firebase.firestore();
export default firebase