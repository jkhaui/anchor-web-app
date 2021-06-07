/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBWlk1KY16SFu7VES06h3wRcib20VE7X3M',
  authDomain: 'fcm-test-26055.firebaseapp.com',
  projectId: 'fcm-test-26055',
  storageBucket: 'fcm-test-26055.appspot.com',
  messagingSenderId: '823490469792',
  appId: '1:823490469792:web:9499ddd14486262c27cec5',
  measurementId: 'G-GRHXHP1YRM',
});

const messaging = firebase.messaging();

//messaging.onBackgroundMessage((payload) => {
//  console.log('[firebase-messaging-sw.js] Received background message ', payload);
//});