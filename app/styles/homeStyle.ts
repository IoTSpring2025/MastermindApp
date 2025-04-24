import { StyleSheet, Platform } from 'react-native';

export const homeStyle = StyleSheet.create({
    container: {
      flex: 1,
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
  });