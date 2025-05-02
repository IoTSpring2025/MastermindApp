import { StyleSheet, Platform } from 'react-native';

export const homeStyle = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    headerContainer: {
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Platform.select({
        ios: '#A1CEDC',
        default: '#A1CEDC'
      }),
    },
    reactLogo: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
    },
    titleContainer: {
      padding: 20,
      alignItems: 'center',
    },
    stepContainer: {
      padding: 20,
      marginBottom: 10,
    },
    title: {
      marginBottom: 30,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      backgroundColor: '#fff',
      marginRight: 10,
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
    },
    button: {
      width: 200,
      height: 50,
    },
    cameraButton: {
      backgroundColor: '#4CAF50',
    },
  });