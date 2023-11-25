import React, {useRef, useState} from 'react';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';
import CsSelectGender from '../../../containers/CsSelectGender';
import CsAutocompleteSelect from '../../../containers/CsAutocompleteSelect';
import FloatingTextInput from '../../../containers/FloatingTextInput';
import I18n from '../../../i18n';

import styles from './style';
import Button from '../../../containers/Button';
import { CsSelect } from '../../../containers/CsSelect';
import KeyboardView from '../../../containers/KeyboardView';
import {showErrorAlert, showToast} from '../../../lib/info';

const theme = 'light';

const AddExperienceModal = ({isVisible, onBackdropPress}) => {

  const [job, setJob] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [salary, setSalary] = useState('');
  const services = ['0 - 2 years', '2 - 5 years', '5 - 7 years', '7 - 10 years', '10 - 12 years'];
  const salleries = ['$0-$50,000', '$50,000-$60,000', '$60,000-$70,000', '$70,000-$80,000', '$80,000-$90,000', '$90,000-$100,000'];

  const onSubmit = () => {};

  const roleInput = useRef(null);
  const companyInput = useRef(null);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <KeyboardView keyboardVerticalOffset={128}>
          <Text style={styles.title}>{I18n.t('add_experience')}</Text>
          <Text style={styles.descriptionText}>{I18n.t('premium_detail')}</Text>
          <View style={{height: 15}}/>
          {/* <CsAutocompleteSelect
            theme={theme}
            placeholder={'Type Your Job Name'}
            label={I18n.t('Job')}
            onSelectItem={(value)=>console.log(value)}
          /> */}
          <CsSelect
            placeholder={I18n.t('type_job')}
            label={I18n.t('Job')}
            options={services}
            onSelect={(value)=>setJob(value)}
            theme={theme}
            value={job}
          />
          <FloatingTextInput
            inputRef={companyInput}
            value={company}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('Company')}
            placeholder={I18n.t('enter_company')}
            onChangeText={val => setCompany(val)}
            theme={theme}
            onSubmitEditing={() => {
              roleInput.current.focus();
            }}
          />
          <FloatingTextInput
            inputRef={roleInput}
            value={role}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('Role')}
            placeholder={I18n.t('type_role')}
            onChangeText={val => setRole(val)}
            theme={theme}
            onSubmitEditing={() => {
              
            }}
          />
          <CsSelect
            placeholder={I18n.t('select')}
            label={I18n.t('Years_of_service')}
            options={services}
            onSelect={(value)=>setYearsOfService(value)}
            theme={theme}
            value={yearsOfService}
          />
          <CsSelect
            placeholder={I18n.t('select_sallery')}
            label={I18n.t('sallery')}
            options={salleries}
            theme={theme}
            value={salary}
            onSelect={(value)=>setSalary(value)}
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

export default AddExperienceModal;
