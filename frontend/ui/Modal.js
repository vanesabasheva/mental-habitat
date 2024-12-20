import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useAssets } from "expo-asset";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deviceHeight, deviceWidth } from "../constants/Dimensions";

function CustomModal({
  children,
  imageSrc,
  title,
  description,
  modalVisible,
  setModalVisible,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}>
      <ScrollView
        contentContainerStyle={{ marginTop: deviceHeight / 6 }}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* {assets ? (
              <ImageBackground
                source={assets[0]}
                style={{
                  flex: 1,
                  resizeMode: "cover",
                  justifyContent: "center",
                }}
              />
            ) : null} */}
            <Pressable
              style={({ pressed }) => (pressed ? [{ opacity: 0.7 }] : null)}
              onPress={() => setModalVisible(!modalVisible)}>
              <Ionicons name="remove" size={32} color="black" />
            </Pressable>
            <Text style={styles.modalText}>{title}</Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "robotomono-bold",
                marginBottom: 10,
                textAlign: "center",
              }}>
              {description}
            </Text>
            {children}
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    //marginTop: 22,
  },
  modalView: {
    //height: deviceHeight / 1.2,
    width: deviceWidth,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    padding: 40,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
});

export default CustomModal;
