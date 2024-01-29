import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    // margin: 20,
    paddingLeft: 10,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'column',
    marginHorizontal: 16,
  },
  avatarContainer: {
    borderRadius: 10,
    borderWidth: 4,
    overflow: 'hidden',
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
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  actionText: {
    fontWeight: '600',
    fontFamily: 'Raleway',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})