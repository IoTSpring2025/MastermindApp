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

function AuthScreen() {
  const { createAccount, signInWithEmail, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Show loading indicator while auth is initializing
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
      // Success is handled by the auth state observer
    } catch (error) {
      // Error is handled in the createAccount function
      console.error('Account creation error:', error);
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
      // Success is handled by the auth state observer
    } catch (error) {
      // Error is handled in the signInWithEmail function
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
              <ThemedText type="title">Welcome to Mastermind</ThemedText>
              <ThemedText style={styles.subtitle}>
                {isSignUp ? 'Create an account' : 'Sign in to continue'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              {isSignUp && (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              )}
              
              {isSignUp ? (
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleCreateAccount}
                  disabled={isCreatingAccount}
                >
                  {isCreatingAccount ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleSignIn}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.toggleButton}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.toggleText}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 10,
    opacity: 0.7,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1E88E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    padding: 12,
  },
  toggleText: {
    color: '#1E88E5',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthScreen; 