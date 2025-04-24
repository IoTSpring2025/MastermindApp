import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

function LoginScreen() {
  const router = useRouter();
  
  React.useEffect(() => {
    // Redirect to the auth screen
    router.replace('/(auth)/auth');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting to login...</Text>
    </View>
  );
}

export default LoginScreen;
