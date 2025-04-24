import React, { useState } from 'react';
import { 
  StyleSheet,
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform, 
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  View
} from 'react-native';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoadingScreen } from '@/components/LoadingScreen';
import { authStyle } from '@/app/styles/authStyle';

function AuthScreen() {
  const { createAccount, signInWithEmail, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  const handleCreateAccount = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match');
      return;
    }

    // Firebase requires at least 6 characters
    if (password.length < 6) {
      Alert.alert('Password Error', 'Password must be at least 6 characters');
      return;
    }

    setIsCreatingAccount(true);
    try {
      await createAccount(email, password);
    } catch (error) {
      Alert.alert('Unable to create account');
    } finally {
      setIsCreatingAccount(false);
    }
  };
  
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password');
      return;
    }
    
    setIsSigningIn(true);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      Alert.alert('Unable to sign in');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaView style={authStyle.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyle.keyboardView}
      >
        <ScrollView contentContainerStyle={authStyle.scrollContent}>
          <ThemedView style={authStyle.container}>
            <ThemedView style={authStyle.headerContainer}>
              <ThemedText type="title">Welcome to Mastermind</ThemedText>
              <ThemedText style={authStyle.subtitle}>
                {isSignUp ? 'Create an account' : 'Sign in to continue'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={authStyle.formContainer}>
              <TextInput
                style={authStyle.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <TextInput
                style={authStyle.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              {isSignUp && (
                <TextInput
                  style={authStyle.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              )}
              
              {isSignUp ? (
                <TouchableOpacity 
                  style={authStyle.button}
                  onPress={handleCreateAccount}
                  disabled={isCreatingAccount}
                >
                  {isCreatingAccount ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={authStyle.buttonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={authStyle.button}
                  onPress={handleSignIn}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={authStyle.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={authStyle.toggleButton}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={authStyle.toggleText}>
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </Text>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AuthScreen; 