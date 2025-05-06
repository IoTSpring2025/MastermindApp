import { StyleSheet, Platform } from 'react-native';
import { componentStyle } from './componentStyle';

export const gameStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  centeredContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  table: {
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
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
  stageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  actionContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    ...componentStyle.buttonContainer,
    marginHorizontal: 60,
    marginBottom: 80,
    paddingHorizontal: 30,
  },
  button: componentStyle.buttonLarge,
  winButton: componentStyle.buttonSuccess,
  lossButton: componentStyle.buttonDanger,
  
  // AI Advice Components
  adviceContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'rgba(45, 45, 45, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(45, 45, 45, 0.2)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  recommendationBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 8,
  },
  recommendationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  adviceText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 14,
    marginBottom: 15,
    opacity: 0.8,
  },
  confidenceBar: {
    height: 20,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5,
    position: 'relative',
  },
  confidenceFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  confidenceText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  adviceButton: {
    ...componentStyle.button,
    backgroundColor: '#4285F4',
    marginBottom: 15,
  },
  placeholderAdvice: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(66, 133, 244, 0.2)',
  },
  placeholderAdviceText: {
    fontSize: 14,
    color: '#4285F4',
    textAlign: 'center',
  }
});