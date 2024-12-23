import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";

const Welcome = () => {
  return (
    <ScreenWrapper bg="#121212">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View>
          <Image
            style={styles.welcomeImage}
            source={require("../assets/images/welcome.png")}
            resizeMode="contain"
          ></Image>
          <Text style={styles.title}>
            TAWK<Text style={{ fontSize: 20 }}>2</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.punchline}>By</Text>
          <Text style={styles.punchline}>Blank Canvas & Design Co.</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 200,
    paddingBottom: 40,
    backgroundColor: "#121212",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(25),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    color: "white",
    fontSize: hp(4),
    marginTop: 8,
    textAlign: "center",
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: 10,
    color: "white",
  },
});
