import { StyleSheet, Platform } from 'react-native';
import { componentStyle } from './componentStyle';

export const historyStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  gameCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  gameDetails: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    color: '#666666',
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  winResult: {
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  lossResult: {
    color: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  date: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 16,
    fontStyle: 'italic',
    color: '#666666',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
}); 