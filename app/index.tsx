import {
  Image,
  StyleSheet,
  Button,
  NativeModules,
  Modal,
  ActivityIndicator,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {
  // Get a reference to the Veriph.One SDK from React's Native Modules
  const { VeriphOneModule } = NativeModules;

  const [isLoading, setIsLoading] = useState(false);

  // Remember to set these values in your .env file
  // As recommended by the README, migrate your API Key to a more secure storage mechanism
  const apiKey = process.env.EXPO_PUBLIC_VERIPH_ONE_API_KEY;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // This is just an example, you can implement and interact with your API as you see fit.
  // Veriph.One is agnostic to how this endpoint behaves, it just needs to return a session
  // UUID when everything goes well, and an error when it doesn't.
  // More info: https://developer.veriph.one/docs/server/start-endpoint
  const makeStartVerificationRequest = (type: "sign-up" | "mfa") => {
    setIsLoading(true);
    // This example assumes different endpoints for a sign up and MFA flow, once again, this
    // is not mandatory, you can reuse it or make as many as your software needs.
    fetch(`${apiUrl}/${type}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Get locale from the device to ensure proper localization
        locale: "en",
        // Pass a user, transaction, or operation ID so your server knows what to do
        transaction: "123abc",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setIsLoading(false);
        // Request was successful, now its time to pass the resulting session UUID to
        // the Veriph.One SDK like so:
        const sessionUuid = json.sessionUuid;
        startVerificationWithUuid(sessionUuid);
      })
      .catch((error) => {
        setIsLoading(false);
        // Handle errors from your server as you normally would
        console.error(error);
        alert("Request to server failed!");
      });
  };

  // In a similar fashion, this endpoint can have any shape or form your software requires.
  // It just needs to received the sessionUuid returned by the SDK to determine what to do
  // next in your flow. Your app should behave accordingly.
  const makeResultVerificationRequest = (sessionUuid: string) => {
    setIsLoading(true);

    // You can use a single endpoint or multiple based on the type of operations you are
    // performing. No specific structure required by the Veriph.One SDK.
    fetch(`${apiUrl}/result`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Pass the same session UUID to get the verification results and decide what
        // to do next in your flow.
        sessionUuid: sessionUuid,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setIsLoading(false);
        // Verification was successfull and your server should now return sufficient
        // information for your app to move to the next screen or part of the flow.
        console.log(json);
        alert("Verification was successful!");
      })
      .catch((error) => {
        setIsLoading(false);
        // Handle errors from your server as you normally would, in this case either
        // the verification failed or the server rejected the transaction.
        console.error(error);
        alert("Request to server failed!");
      });
  };

  // This method is a bridge between your code and the Veriph.One SDK, it relies on
  // a callback to give you a hint of the verification; remember your server is the
  // only one that should tell your app whether it was successfull or not.
  // A null result usually means an interrupted process, and a non-null one means
  // the SDK has a result available; which can be either positive or negative.
  const startVerificationWithUuid = (sessionUuid: string) => {
    VeriphOneModule.subscribeToVerificationEvent(
      apiKey,
      sessionUuid,
      (result: string | null) => {
        console.log(`Session UUID: ${result}`);
        if (result) {
          // Ask your server for a result and instructions on what to do next
          makeResultVerificationRequest(sessionUuid);
        } else {
          // The flow was interrupted by the user or finished unsuccessfully
          alert("Verification failed :(");
        }
      }
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Option 1:</ThemedText>
          <ThemedText>
            Capture a phone number using Veriph.One's SDK.
          </ThemedText>
          <Button
            onPress={() => {
              makeStartVerificationRequest("sign-up");
            }}
            title="Go to flow"
          />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Option 2:</ThemedText>
          <ThemedText>
            Go through an MFA flow expecting an specific phone number.
          </ThemedText>
          <Button
            onPress={() => {
              makeStartVerificationRequest("mfa");
            }}
            title="Go to flow"
          />
        </ThemedView>
      </ParallaxScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          setIsLoading(!isLoading);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" />
            <Button
              onPress={() => setIsLoading(!isLoading)}
              title="Close dialog"
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
