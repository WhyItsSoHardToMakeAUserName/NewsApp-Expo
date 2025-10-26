import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useState } from "react";
import { Alert, Button, Text, View } from "react-native";

export default function SettingsScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert("Ошибка", "Ваше устройство не поддерживает биометрию.");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert("Ошибка", "Биометрические данные не настроены.");
        return;
      }

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const supportsFaceID = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      const supportsFingerprint = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

      console.log("Поддержка Face ID:", supportsFaceID);
      console.log("Поддержка отпечатка пальца:", supportsFingerprint);

      let result;

      // Попытка Face ID
      if (supportsFaceID) {
        result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Войти с помощью Face ID",
          cancelLabel: "Отмена",
          disableDeviceFallback: true,
        });

        if (result.success) {
          setIsAuthenticated(true);
          Alert.alert("Успешно", "Вход выполнен через Face ID.");
          return;
        }
      }

      // Попытка отпечатком пальца
      if (supportsFingerprint) {
        result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Войти с помощью отпечатка пальца",
          cancelLabel: "Отмена",
          disableDeviceFallback: true,
        });

        if (result.success) {
          setIsAuthenticated(true);
          Alert.alert("Успешно", "Вход выполнен через отпечаток пальца.");
          return;
        }
      }

      // Последняя попытка — PIN / пароль устройства
      result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Введите PIN / пароль устройства",
        fallbackLabel: "Использовать пароль",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        Alert.alert("Успешно", "Вход выполнен с помощью PIN / пароля.");
      } else {
        Alert.alert("Ошибка", "Аутентификация не удалась.");
      }
    } catch (error) {
      console.error("Ошибка биометрии:", error);
      Alert.alert("Ошибка", "Произошла ошибка при попытке аутентификации.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsAuthenticated(false);
    Alert.alert("Выход", "Вы успешно вышли из аккаунта.");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Настройки аккаунта</Text>

      <Button title="Войти с Face ID / Touch ID / PIN" onPress={handleBiometricAuth} />

      {isAuthenticated && (
        <View style={{ marginTop: 20 }}>
          <Button title="🚪 Выйти" color="red" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
}
