import React, {useRef, useState} from 'react';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';
import CsSelectGender from '../../../containers/CsSelectGender';
import CsAutocompleteSelect from '../../../containers/CsAutocompleteSelect';
import FloatingTextInput from '../../../containers/FloatingTextInput';
import I18n from '../../../i18n';

import styles from './style';
import Button from '../../../containers/Button';
import {CsSelect} from '../../../containers/CsSelect';
import KeyboardView from '../../../containers/KeyboardView';
import {showErrorAlert, showToast} from '../../../lib/info';
import {themes, COLOR_RED} from '../../../constants/colors';

const theme = 'light';

const AddExperienceModal = ({
  isVisible,
  onBackdropPress,
  onUpdate,
  setExperienceAdded,
  setExperienceModalOpen,
}) => {
  const [job, setJob] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [salary, setSalary] = useState('');
  const services = [
    '0 - 2 years',
    '2 - 5 years',
    '5 - 7 years',
    '7 - 10 years',
    '10 - 12 years',
  ];
  const jobs = ['IT', 'Real Estate', 'Fintech', 'Healthcare'];
  const salaries = [
    '$0-$50,000',
    '$50,000-$60,000',
    '$60,000-$70,000',
    '$70,000-$80,000',
    '$80,000-$90,000',
    '$90,000-$100,000',
  ];
  const [jobError, setJobError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [yearsOfServiceError, setYearsOfServiceError] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const isValid = () => {
    setJobError('');
    setCompanyError('');
    setRoleError('');
    setYearsOfServiceError('');
    setSalaryError('');

    if (!job.length) {
      setJobError(I18n.t('please_enter_job_name'));
      return false;
    }

    if (!company.length) {
      setCompanyError(I18n.t('please_enter_company_name'));
      return false;
    }

    if (!role.length) {
      setRoleError(I18n.t('please_enter_role'));
      return false;
    }

    if (!yearsOfService.length) {
      setYearsOfServiceError(I18n.t('please_select_years_of_service'));
      return false;
    }

    if (!salary.length) {
      setSalaryError(I18n.t('please_select_salary'));
      return false;
    }

    return true;
  };
  const onSubmit = () => {
    if (isValid()) {
      onUpdate({
        job: job,
        company: company,
        salary: salary,
        role: role,
        years_of_service: yearsOfService,
      });
      setExperienceAdded(true);
      setExperienceModalOpen(false);
    }
  };

  const roleInput = useRef(null);
  const companyInput = useRef(null);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <KeyboardView keyboardVerticalOffset={128}>
          <Text style={styles.title}>{I18n.t('Add_New_Experience')}</Text>
          <Text style={styles.descriptionText}>{I18n.t('premium_detail')}</Text>
          <View style={{height: 15}} />
          {/* <CsAutocompleteSelect
            theme={theme}
            placeholder={'Type Your Job Name'}
            label={I18n.t('Job')}
            onSelectItem={(value)=>console.log(value)}
          /> */}
          <CsSelect
            placeholder={I18n.t('Enter_Your_Job_Title')}
            label={I18n.t('Profession')}
            options={jobs}
            onSelect={value => setJob(value)}
            theme={theme}
            value={job}
            containerStyle={{
              borderColor: jobError ? COLOR_RED : themes[theme].borderColor,
            }}
          />
          <FloatingTextInput
            inputRef={companyInput}
            value={company}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('Employer')}
            placeholder={I18n.t('Enter_Your_Employer_Name')}
            onChangeText={val => setCompany(val)}
            theme={theme}
            onSubmitEditing={() => {
              roleInput.current.focus();
            }}
            error={companyError}
          />
          <FloatingTextInput
            inputRef={roleInput}
            value={role}
            returnKeyType="next"
            keyboardType="default"
            textContentType="oneTimeCode"
            label={I18n.t('Position')}
            placeholder={I18n.t('Enter_Your_Role')}
            onChangeText={val => setRole(val)}
            theme={theme}
            error={roleError}
          />
          <CsSelect
            placeholder={I18n.t('Choose_Duration')}
            label={I18n.t('Length_of_Employment')}
            options={services}
            onSelect={value => setYearsOfService(value)}
            theme={theme}
            value={yearsOfService}
            containerStyle={{
              borderColor: yearsOfServiceError
                ? COLOR_RED
                : themes[theme].borderColor,
            }}
          />
          <CsSelect
            placeholder={I18n.t('Choose_Salary_Range')}
            label={I18n.t('Salary')}
            options={salaries}
            theme={theme}
            value={salary}
            onSelect={value => setSalary(value)}
            containerStyle={{
              borderColor: salaryError ? COLOR_RED : themes[theme].borderColor,
            }}
          />
          <Button
            style={styles.submitBtn}
            title={I18n.t('Update')}
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
