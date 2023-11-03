import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    position:'absolute', 
    bottom:0, 
    left:0,
    margin:0
  },
  modal_view: {        
    borderTopLeftRadius:16,
    borderTopRightRadius:16,  
    paddingTop:40,
    paddingBottom:60,
    paddingHorizontal:15     
  },
  headerText: {
    fontFamily: 'Raleway',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 10,
  },
  label: {
    fontFamily: 'Raleway',
    fontWeight: '400',
    fontSize: 12,
    paddingLeft:15
  },
  contentView: {
    padding:15,
    marginTop:10
  },
  contentText: {
    fontFamily: 'Raleway',
    fontWeight: '500',
    fontSize: 14,
    lineHeight:24
  },
  buttonView: {
    flexDirection:'row',
    paddingLeft:15,
    marginTop:15
  },
  button: {
    width:40,
    height:40,
    marginRight:15
  },
  urlView: {
    width:'100%',
    height:35,
    borderRadius:30,
    backgroundColor:'#FFCC4D',
    flexDirection:'row',
    marginTop:15,
    paddingHorizontal:15,
    justifyContent:'space-between',
    alignItems:'center'
  },
  invite_text: {
    fontFamily: 'Raleway',
    fontWeight: '600',
    fontSize: 10,
    color:'#fff'
  },
  copy_text: {
    fontFamily: 'Raleway',
    fontWeight: '600',
    fontSize: 10,
    color:'#000'
  }
});
