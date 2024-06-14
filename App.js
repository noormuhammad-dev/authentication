import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useState, useEffect } from "react";

GoogleSignin.configure({
  webClientId:
    "1044342674370-vid4pr9tf1gj8tgmgnfqmpq9f527vlt4.apps.googleusercontent.com",
});

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscriber;
  }, []);

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  async function onLogoutPress() {
    await auth().signOut();
    await GoogleSignin.signOut();
    setUser(null);
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome, {user.displayName}!</Text>
          <Button title="Logout" onPress={onLogoutPress} />
        </>
      ) : (
        <Button
          title="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log("Signed in with Google!")
            )
          }
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
