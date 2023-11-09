import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    marginVertical: 16,
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: 0.8,
    borderColor: 'grey',
  },
  userContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft:10
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  userName: {
    marginLeft: 15,
    fontWeight: '600',
    fontSize:16
  },
  roundInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    marginVertical:10
  },
  underlineInput: {
    marginHorizontal: 8,
    marginTop: 12,
  },
  imageStyle: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  videoContainer: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
  textStyle: {
    height: 200,
    textAlignVertical: 'top'
  },
  inputContainer: {
    // flexGrow: 1,
    paddingVertical: 10
  },
  video: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  playIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 300,
  },
  button: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  updateText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
