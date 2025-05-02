import { StyleSheet } from 'react-native';

export const componentStyle = StyleSheet.create({
  // ThemedButton styles
  button: {
    backgroundColor: '#0070f3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonSuccess: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  buttonLarge: {
    width: 200,
    height: 50,
  },

  // ThemedText styles
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },

  collapsibleHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  collapsibleContent: {
    marginTop: 6,
    marginLeft: 24,
  },

  parallaxContainer: {
    flex: 1,
  },
  parallaxHeader: {
    height: 250,
    overflow: 'hidden',
  },
  parallaxContent: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },

  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gap: {
    gap: 10,
  },
}); 