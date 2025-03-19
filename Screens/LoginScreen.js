import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Config/firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!numero || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, `${numero}@mail.com`, password);
      const user = userCredential.user;
  
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const tipoCuenta = userData.tipoCuenta;
        const numeroCuenta = userData.numero; 
  
        if (numeroCuenta) {
          await AsyncStorage.setItem("numeroCuenta", numeroCuenta);
        } else {
          console.warn("⚠ Advertencia: 'numeroCuenta' no encontrado.");
        }
  
        await AsyncStorage.setItem("tipoCuenta", tipoCuenta);
  
        navigation.navigate("WithdrawScreen");
      } else {
        Alert.alert("Error", "No se encontró información del usuario.");
      }
    } catch (error) {
      Alert.alert("Error", "Número o contraseña incorrectos.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de cuenta"
        keyboardType="numeric"
        maxLength={11}
        value={numero}
        onChangeText={setNumero}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        keyboardType="numeric"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#6200ee",
    marginTop: 10,
  },
});

export default LoginScreen;
