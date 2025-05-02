import { StyleSheet, Platform } from 'react-native';

export const historyStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    alignItems: 'center',
  },
  gameCard: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  result: {
    fontWeight: 'bold',
  },
  gameDetails: {
    gap: 5,
  },
  label: {
    fontWeight: '600',
    marginTop: 5,
  },
}); 