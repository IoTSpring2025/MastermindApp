import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LoadingScreen } from '@/components/LoadingScreen';
import { profileStyle } from '@/app/styles/profileStyle';

function ProfileScreen() {
  const { user, signOut, loading } = useAuth();
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) return null;
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  return (
    <ThemedView style={profileStyle.container}>
      <ThemedView style={profileStyle.header}>
        <IconSymbol 
          name="person.crop.circle.fill" 
          size={80} 
          color="#4285F4" 
        />
        <ThemedText type="title" style={profileStyle.name}>
          {'Player ' +user?.email?.split('@')[0] || 'Player'}
        </ThemedText>
        <ThemedText style={profileStyle.email}>{user.email}</ThemedText>
      </ThemedView>

      <ThemedView style={profileStyle.section}>
        <ThemedText type="subtitle">Account</ThemedText>
        
        <ThemedView style={profileStyle.itemContainer}>
          <TouchableOpacity 
            style={profileStyle.signOutButton}
            onPress={handleSignOut}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FF3B30" />
            <ThemedText style={profileStyle.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

export default ProfileScreen; 