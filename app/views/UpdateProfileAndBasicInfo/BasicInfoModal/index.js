import React, {useState, useRef} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import CsSelectGender from '../../../containers/CsSelectGender';
import ExGender from '../../../containers/ExGender';
import CsAutocompleteSelect from '../../../containers/CsAutocompleteSelect';
import FloatingTextInput from '../../../containers/FloatingTextInput';
import I18n from '../../../i18n';

import styles from './style';
import CsDatePicker from '../../../containers/CsDatePicker';
import Button from '../../../containers/Button';
import ExDatePicker from '../../../containers/ExDatePicker';
import KeyboardView from '../../../containers/KeyboardView';
import {showErrorAlert, showToast} from '../../../lib/info';

const theme = 'light';

const BasicInfoModal = ({isVisible, onBackdropPress}) => {

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [topScrollEnable, setTopScrollEnable] = useState(false);
  const [city, setCity] = useState('');

  const nameRef = useRef(null);
  const cityRef = useRef(null);
  const phoneRef = useRef(null);

  const isValid = () => {
    if (!name.length) {
      showToast(I18n.t('please_enter_name'));
      nameRef.current.focus();
      return false;
    }
    if (!city.length) {
      showToast(I18n.t('please_enter_city'));
      cityRef.current.focus();
      return false;
    }
    if (!phone.length) {
      showToast(I18n.t('type_phone_number'));
      phoneRef.current.focus();
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    console.log(name)
    
    isValid();
  };

  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <KeyboardView keyboardVerticalOffset={128}>
          <Text style={styles.title}>{I18n.t('update_basic_information')}</Text>
          <Text style={styles.descriptionText}>{I18n.t('premium_detail')}</Text>
          <View style={{height: 20}}/>
          <FloatingTextInput
            inputRef={nameRef}
            value={name}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('Name')}
            placeholder={I18n.t('enter_name')}
            onChangeText={name => setName(name)}
            theme={theme}
            onSubmitEditing={() => {
              cityRef.current.focus();
            }}
          />
          <ExGender
            containerStyle={styles.selectStyle}
            label={I18n.t('Select_Your_Gender')}
            value={gender}
            topScrollEnable={()=>setTopScrollEnable(topScrollEnable)}
            toggleShow={show => {
              setTopScrollEnable(!show)
            }}
            action={({value}) => {
              if (!value) {
                return;
              }
              setGender(value);
            }}
            theme={theme}
          />
          {/* <CsSelectGender
            label="Select Your Gender"
            theme={theme}
            onChange={value => setGender(value)}
            value={gender}
          /> */}
          <FloatingTextInput
            inputRef={cityRef}
            value={city}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('City')}
            placeholder={I18n.t('select_city')}
            onChangeText={value => setCity(value)}
            theme={theme}
            onSubmitEditing={() => {
              phoneRef.current.focus();
            }}
          />
          <FloatingTextInput
            inputRef={phoneRef}
            value={phone}
            returnKeyType="next"
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            label={I18n.t('Phone_number')}
            placeholder={'Type phone number'}
            onChangeText={phone => setPhone(phone)}
            theme={theme}
            onSubmitEditing={() => {
              // websiteInput.current.focus();
            }}
          />
          <ExDatePicker
            theme={theme}
            placeholder={I18n.t('select_birthday')}
            value={birthday}
            topScrollEnable={topScrollEnable}
            toggleShow={show => {
              setTopScrollEnable(!show)
            }}
            action={({value}) => {
              if (!value) {
                return;
              }
              setBirthday(value);
            }}
            label={I18n.t('Birthday')}
          />
          <Button
            style={styles.submitBtn}
            title={I18n.t('update')}
            size="W"
            onPress={onSubmit}
            testID="login-submit"
            //   loading={isLoading}
            theme={theme}
            pressingHighlight
          />
          </KeyboardView>
        </View>
    </Modal>
  );
};

export default BasicInfoModal;
