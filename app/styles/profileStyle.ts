import { StyleSheet } from 'react-native';

export const profileStyle = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    name: {
      marginTop: 16,
    },
    email: {
      marginTop: 4,
      opacity: 0.7,
    },
    section: {
      marginTop: 20,
    },
    itemContainer: {
      marginTop: 16,
      borderRadius: 12,
      overflow: 'hidden',
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    signOutText: {
      color: '#FF3B30',
      marginLeft: 12,
      fontWeight: '600',
    },
  });