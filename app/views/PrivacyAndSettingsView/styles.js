import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {},
  header: {
    paddingHorizontal: 16,
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Hind Vadodara',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },
  modalContent: {
    backgroundColor: 'red',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontWeight: '600',
    fontFamily: 'Hind Vadodara',
    fontSize: 18,
    lineHeight: 28,
    marginVertical: 8,
    textAlign: 'center',
  },

  editProfileTxtBtn: {
    width: 357,
    height: 46,
    borderRadius: 14,
    marginTop: 14,
    marginBottom: 14,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  editProfileTxt: {
    fontSize: 16,
    fontWeight: '500',
  },
});