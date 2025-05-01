import { StyleSheet } from 'react-native';

export const authStyle = StyleSheet.create({
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
  
