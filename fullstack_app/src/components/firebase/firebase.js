import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCPORgice7JUk9bG9yxLwEYRwjmr949zoo",
  authDomain: "my-fyp-f70c1.firebaseapp.com",
  databaseURL: "https://my-fyp-f70c1.firebaseio.com",
  projectId: "my-fyp-f70c1",
  storageBucket: "my-fyp-f70c1.appspot.com",
  messagingSenderId: "226608235721 "
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
