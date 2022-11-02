import parsePhoneNumber from 'libphonenumber-js';

export default (phoneNumber: string | null): boolean => {
  if (phoneNumber !== null) {
    const numberTest = parsePhoneNumber(`+${phoneNumber}`);
    if (numberTest) {
      return numberTest.isValid();
    }
  }
  return false;
};
