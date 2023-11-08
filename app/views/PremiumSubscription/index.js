import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import StatusBar from '../../containers/StatusBar';
import {withTheme} from '../../theme';
import styles from './styles';
import sharedStyles from '../Styles';
import {setUser as setUserAction} from '../../actions/login';
import images from '../../assets/images';
import {COLOR_YELLOW, themes} from '../../constants/colors';
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import scrollPersistTaps from '../../utils/scrollPersistTaps';

const PremiumSubscription = props => {
  const navigation = useNavigation();
  const {theme, user, setUser} = props;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerView}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => navigation.goBack()}>
            <VectorIcon
              size={20}
              name={'arrowleft'}
              type={'AntDesign'}
              color={themes[theme].activeTintColor}
              style={{marginLeft: 18}}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, {color: themes[theme].titleColor}]}>{I18n.t('back')}</Text>
        </View>
      ),
      title: null,
      headerStyle: {
        backgroundColor: themes[theme].backgroundColor,
        shadowOpacity: 0,
      },
    });
  }, [theme])

  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: themes[theme].backgroundColor}}>
      <StatusBar />

      <ScrollView contentContainerStyle={{flexGrow:1}} style={{
          paddingHorizontal: 16,
          paddingTop:15
        }}
        {...scrollPersistTaps}>
        <View style={[styles.container, {backgroundColor: themes[theme].commentCardBox}]}>
          <Image source={images.premium} />

          <Text style={[styles.title, {color: themes[theme].activeTintColor}]}>{I18n.t('premium_title')}</Text>
          <Text style={[styles.detail, {color: themes[theme].textColor}]}>{I18n.t('premium_detail')}</Text>
          <Text style={[styles.moneyText, {color: themes[theme].activeTintColor}]}>{'$5000'}</Text>
          <Text style={[styles.detail, {color: themes[theme].textColor, marginTop: 0}]}>{I18n.t('per_month')}</Text>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  )

}

export default withTheme(PremiumSubscription);