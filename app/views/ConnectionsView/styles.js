import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {},
  header: {
    paddingHorizontal: 16,
    flex: 1,
    flexDirection: 'row',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    width: '33%',
  },
  tabLabel: {
    textAlign: 'center',
    paddingVertical: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
  },
  activeTab: {
    borderBottomWidth: 1,
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  tabText: {
    fontFamily: 'Raleway',
    fontWeight: '500',
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemText: {
    fontFamily: 'Raleway',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },
  itemPost: {
    fontFamily: 'Raleway',
    fontSize: 12,
    lineHeight: 20,
  },
  followingText: {
    paddingVertical: 4,
    textAlign: 'center',
  },
})
