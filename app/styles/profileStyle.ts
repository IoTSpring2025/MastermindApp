import { StyleSheet } from 'react-native';

export const profileStyle = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    infoSection: {
      marginBottom: 24,
    },
    email: {
      marginTop: 8,
      opacity: 0.7,
    },
    statsSection: {
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      padding: 16,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333333',
    },
    statLabel: {
      marginTop: 4,
      fontSize: 14,
      color: '#666666',
    },
    signOutButton: {
      marginTop: 'auto',
      backgroundColor: '#FF3B30',
    },
  });