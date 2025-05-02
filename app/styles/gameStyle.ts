import { StyleSheet } from 'react-native';
import { componentStyle } from './componentStyle';

export const gameStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  table: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  communityCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: 60,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  handContainer: {
    marginBottom: 20,
  },
  hand: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  actionContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonContainer: componentStyle.buttonContainer,
  button: componentStyle.buttonLarge,
  winButton: componentStyle.buttonSuccess,
  lossButton: componentStyle.buttonDanger
}); 