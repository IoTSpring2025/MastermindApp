import { StyleSheet, Platform } from 'react-native';

export const profileStyle = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#ffffff',
    },
    header: {
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 60 : 20,
      paddingBottom: 20,
    },
    content: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    infoSection: {
      width: '100%',
      marginBottom: 32,
      alignItems: 'center',
    },
    email: {
      marginTop: 8,
      opacity: 0.7,
      fontSize: 16,
    },
    statsSection: {
      width: '100%',
      marginBottom: 32,
      alignItems: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      padding: 20,
      width: '100%',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: '#666666',
      textAlign: 'center',
    },
    signOutButton: {
      marginTop: 40,
      backgroundColor: '#FF3B30',
      width: '80%',
    },
  });