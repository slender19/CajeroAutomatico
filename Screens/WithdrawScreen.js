import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, TextInput, Alert, 
  StyleSheet, ScrollView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { calcularBilletes } from "../Utils/calculateWithdrawalLogic";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RetiroScreen = () => {
  const navigation = useNavigation();
  const fixedAmounts = [20000, 50000, 100000, 200000, 300000, 400000, 500000];
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [otro, setOtro] = useState("");
  const [isOtro, setIsOtro] = useState(false);
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  useEffect(() => {
    const fetchDatosCuenta = async () => {
      const tipo = await AsyncStorage.getItem("tipoCuenta");
      const numero = await AsyncStorage.getItem("numeroCuenta");
      
      setTipoCuenta(tipo);
      setNumeroCuenta(numero);

      generarCodigo(tipo); 
      const interval = setInterval(() => generarCodigo(tipo), 60000);
      
      return () => clearInterval(interval);
    };
    fetchDatosCuenta();
  }, []);

  const generarCodigo = (tipo) => {
    const length = tipo === "Nequi" ? 6 : 4;
    const newCodigo = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, "0");
    setCodigoVerificacion(newCodigo);
  };

  const handleRetiro = async () => {
    if (codigoIngresado !== codigoVerificacion) {
      Alert.alert("Error", "Código de verificación incorrecto.");
      return;
    }

    let target;
    if (isOtro) {
      target = parseInt(otro, 10);
      if (isNaN(target) || target > 2700000) {
        Alert.alert("Error", "El monto debe ser válido y no mayor a $2,700,000.");
        return;
      }
    } else {
      if (!selectedAmount) {
        Alert.alert("Error", "Selecciona un monto.");
        return;
      }
      target = selectedAmount;
    }

    if (target % 10000 !== 0) {
      Alert.alert("Error", "El monto debe ser múltiplo de 10,000.");
      return;
    }

    const result = calcularBilletes(target);
    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      let message = `🔹 Tipo de cuenta: ${tipoCuenta}\n`;
      message += `🔹 Número de cuenta: ${tipoCuenta === "Nequi" ? "1" + numeroCuenta : numeroCuenta}\n\n`;
      message += "- Billetes dispensados:\n";

      for (let i = 0; i < result.denominations.length; i++) {
        if (result.billCount[i] > 0) {
          message += `$${result.denominations[i]} : ${result.billCount[i]} billete(s)\n`;
        }
      }

      message += `\n- Total retirado: $${result.currentSum} pesos.`;

      Alert.alert("Retiro exitoso", message, [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("tipoCuenta");
            await AsyncStorage.removeItem("numeroCuenta");

            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          },
        },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.codeContainer}>
        <Text style={styles.codeTitle}>Código de verificación</Text>
        <TouchableOpacity onPress={() => setMostrarCodigo(!mostrarCodigo)}>
          <Text style={styles.code}>
            {mostrarCodigo ? codigoVerificacion : "●".repeat(codigoVerificacion.length)}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Selecciona un monto a retirar</Text>

      <View style={styles.fixedContainer}>
        {fixedAmounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountButton,
              selectedAmount === amount && !isOtro && styles.selectedButton,
            ]}
            onPress={() => {
              setSelectedAmount(amount);
              setIsOtro(false);
              setOtro("");
            }}
          >
            <Text style={styles.amountText}>${amount.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.amountButton, isOtro && styles.selectedButton]}
          onPress={() => {
            setIsOtro(true);
            setSelectedAmount(null);
          }}
        >
          <Text style={styles.amountText}>Otro...</Text>
        </TouchableOpacity>
      </View>

      {isOtro && (
        <TextInput
          style={styles.input}
          placeholder="Ingresa monto (máximo $2,700,000)"
          keyboardType="numeric"
          value={otro}
          onChangeText={setOtro}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Ingresa el código de verificación"
        keyboardType="numeric"
        maxLength={codigoVerificacion.length}
        value={codigoIngresado}
        onChangeText={setCodigoIngresado}
      />

      <TouchableOpacity style={styles.withdrawButton} onPress={handleRetiro}>
        <Text style={styles.buttonText}>Retirar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  code: {
    fontSize: 24,
    fontWeight: "bold",
  },
  fixedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  amountButton: {
    backgroundColor: "#ddd",
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#6200ee",
  },
  amountText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 15,
    backgroundColor: "#fff",
  },
  withdrawButton: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RetiroScreen;
