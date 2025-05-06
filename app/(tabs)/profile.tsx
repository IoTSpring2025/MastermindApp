import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { profileStyle } from '@/app/styles/profileStyle';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;

      try {
        const gamesRef = collection(firestore, 'games');
        const q = query(
          gamesRef,
          where('player_id', '==', user.email),
          where('completed', '==', true)
        );
        const querySnapshot = await getDocs(q);
        
        const wins = querySnapshot.docs.filter(doc => doc.data().win).length;
        const losses = querySnapshot.docs.filter(doc => !doc.data().win).length;
        
        setStats({ wins, losses });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!user) {
    return (
      <ThemedView style={profileStyle.container}>
        <ThemedText>Please sign in to view your profile</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={profileStyle.container}>
      <ThemedView style={profileStyle.header}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>

      <ThemedView style={profileStyle.content}>
        <ThemedView style={profileStyle.infoSection}>
          <ThemedText type="subtitle">Email</ThemedText>
          <ThemedText style={profileStyle.email}>{user.email}</ThemedText>
        </ThemedView>

        <ThemedView style={profileStyle.statsSection}>
          <ThemedText type="subtitle">Game Statistics</ThemedText>
          <ThemedView style={profileStyle.statsContainer}>
            <ThemedView style={profileStyle.statItem}>
              <ThemedText style={profileStyle.statValue}>{stats.wins}</ThemedText>
              <ThemedText style={profileStyle.statLabel}>Wins</ThemedText>
            </ThemedView>
            <ThemedView style={profileStyle.statItem}>
              <ThemedText style={profileStyle.statValue}>{stats.losses}</ThemedText>
              <ThemedText style={profileStyle.statLabel}>Losses</ThemedText>
            </ThemedView>
            <ThemedView style={profileStyle.statItem}>
              <ThemedText style={profileStyle.statValue}>
                {stats.wins + stats.losses}
              </ThemedText>
              <ThemedText style={profileStyle.statLabel}>Total Games</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedButton
          onPress={handleSignOut}
          style={profileStyle.signOutButton}
          title="Sign Out"
        />
      </ThemedView>
    </ThemedView>
  );
} 