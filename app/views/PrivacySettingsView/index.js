import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {withTheme} from '../../theme';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import {themes} from '../../constants/colors';
import I18n from 'i18n-js';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {VectorIcon} from '../../containers/VectorIcon';
import styles from './styles';
import sharedStyles from '../Styles';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import FloatingTextInput from '../../containers/FloatingTextInput';
import KeyboardView from '../../containers/KeyboardView';
import images from '../../assets/images';
import PhoneInput from '../../containers/PhoneAuthenticationInput';
import { useState } from 'react';
import firebaseSdk, { DB_ACTION_UPDATE } from '../../lib/firebaseSdk';
import {showErrorAlert, showToast} from '../../lib/info';
import { setUser as setUserAction } from '../../actions/login'

const PrivacySettingsView = props => {
  const {theme, user, setUser} = props;
  const [state, setState] = useState({
    email: user.email ?? '',
    phone: user.phone ?? ''
  });
  const emailInput = useRef(null);
  const phoneInput = useRef(null);

  useEffect(() => {
    const {navigation} = props;
    navigation.setOptions({
      headerTitleStyle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Hind Vadodara',
        color: themes[theme].activeTintColor,
        marginTop: 10,
        alignItems: 'center',
      },
      title: I18n.t('Back_to_Privacy_and_settings'),
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginTop: 12,
            marginLeft: 15,
          }}
          onPress={() => navigation.pop()}>
          <VectorIcon
            type={'AntDesign'}
            name={'arrowleft'}
            size={20}
            color={'white'}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            marginTop: 12,
            marginRight: 15,
          }}>
          <VectorIcon
            type="MaterialCommunityIcons"
            name="shield-lock"
            color={themes[theme].titleColor}
            size={20}
          />
        </View>
      ),
    });
  }, []);

  const onEmailChange = () => {
    if (user.email !== state.email) {
      let userInfo = {
        id: user.id,
        email: state.email
      }
      firebaseSdk
        .setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, userInfo)
        .then(() => {
          showToast(I18n.t('Update_profile_complete'));
          setState({...state, isLoading: false});
          const updateUser = {...user, ...userInfo};
          setUser(updateUser);
        })
        .catch(err => {
          showToast(I18n.t(err.message));
          setState({...state, isLoading: false});
        });
    }
  }

  return (
    <KeyboardView
      contentContainerStyle={[
        sharedStyles.container,
        {
          backgroundColor: themes[theme].headerBackground,
        },
      ]}
      keyboardVerticalOffset={128}>
      <StatusBar />
      <ScrollView
        style={{
          flexGrow: 1,
          backgroundColor: themes[theme].backgroundColor,
          paddingTop: 8,
          paddingHorizontal: 16,
        }}
        {...scrollPersistTaps}>
        <SafeAreaView>
          <Text style={[styles.title, {color: themes[theme].titleColor, marginBottom: 16}]}>
            {I18n.t('Privacy_Settings')}
          </Text>
          <FloatingTextInput
            inputRef={emailInput}
            isEdit={true}
            value={state.email}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('Update_Email_Address')}
            placeholder={I18n.t('Email')}
            theme={theme}
            onSubmitEditing={() => {
              emailInput.current.focus();
            }}
            onChangeText={email => setState({...state, email: email})}
            onSubmit={onEmailChange}
          />
          <Text style={[styles.subTitle, {color: themes[theme].titleColor}]}>
            {I18n.t('2_step_verfication')}
          </Text>
          <Text style={[styles.text, {color: themes[theme].normalTextColor}]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum
            vel egestas egestas cras.
          </Text>
          <PhoneInput inputRef={phoneInput} theme={theme} value={state.phone}/>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              styles.container,
              {
                backgroundColor: themes[theme].buttonBackground,
              },
            ]}>
            <View style={styles.item}>
              <View style={styles.itemCenter}>
                <Text
                  style={[styles.itemText, {color: themes[theme].titleColor}]}>
                  Change Password
                </Text>
              </View>
            </View>
            <VectorIcon
              type="MaterialCommunityIcons"
              name="chevron-right"
              color={themes[theme].textColor}
              size={24}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.subTitle,
              {color: themes[theme].titleColor, marginTop: 16},
            ]}>
            You logged in using
          </Text>
          <View style={[styles.container, {marginTop: 8}]}>
            <View style={styles.imageView}>
              <Image source={images.apple} style={styles.image} />
            </View>
            <View style={styles.textsContainer}>
              <Text
                style={[styles.title, {color: themes[theme].normalTextColor}]}>
                Apple iphone 14 Plus
              </Text>
              <Text
                style={[
                  styles.smallText,
                  {color: themes[theme].normalTextColor},
                ]}>
                Login from 12 june 2022 12.30 AM
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardView>
  );
};

const mapStateToProps = state => ({
  user: state.login.user
});

const mapDispatchToProps = dispatch => ({
  setUser: params => dispatch(setUserAction(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(PrivacySettingsView));
