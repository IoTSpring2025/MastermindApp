import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Connection = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.');
  const [port, setPort] = useState('5000');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const router = useRouter();

  const connectToRaspberryPi = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://${ipAddress}:${port}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setIsConnected(true);
        setStatus('Connected');
        Alert.alert('Success', 'Connected to Raspberry Pi successfully!');
        router.push('/game');
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      setIsConnected(false);
      setStatus('Connection failed');
      Alert.alert('Error', 'Failed to connect to Raspberry Pi. Please check IP and port.');
      console.error('Connection error:', error);
    }
  };

  const disconnectFromRaspberryPi = () => {
    setIsConnected(false);
    setStatus('Disconnected');
    Alert.alert('Disconnected', 'Connection to Raspberry Pi closed.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons 
            name="raspberry-pi" 
            size={50} 
            color="#e34f26"
          />
          <Text style={styles.title}>Raspberry Pi Connection</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>IP Address</Text>
            <TextInput
              style={styles.input}
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="Enter Raspberry Pi IP"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Port</Text>
            <TextInput
              style={styles.input}
              value={port}
              onChangeText={setPort}
              placeholder="Enter Port"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statusContainer}>
            <MaterialCommunityIcons 
              name={isConnected ? "wifi-check" : "wifi-off"} 
              size={24} 
              color={isConnected ? '#4CAF50' : '#F44336'}
            />
            <Text style={[
              styles.statusText,
              { color: isConnected ? '#4CAF50' : '#F44336' }
            ]}>
              {status}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isConnected ? '#F44336' : '#4CAF50' }
            ]}
            onPress={isConnected ? disconnectFromRaspberryPi : connectToRaspberryPi}
          >
            <MaterialCommunityIcons 
              name={isConnected ? "lan-disconnect" : "lan-connect"} 
              size={24} 
              color="#fff" 
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#000000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Connection;
