import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    padding:20,
    borderRadius:8
  },
  header: {
    flexDirection: 'row',
    paddingRight:20
  },
  headerView: {
    flexDirection:'row', 
    alignItems:'center'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15
  },
  detail: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 10,
    textAlign:'center',
    lineHeight:17
  },
  moneyText: {
    fontSize: 45,
    fontWeight: '600',
    marginTop: 25,
    fontFamily: 'Hind Vadodara',
  },
});