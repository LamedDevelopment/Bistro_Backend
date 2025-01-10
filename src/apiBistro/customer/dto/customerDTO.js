class CreateDataCustomerDTO {
    constructor(userData) {
      this.fullName = userData.fullName || '';
      this.document = userData.document || '';
      this.movil = userData.movil || '';
      this.email = userData.email || '';
      this.birthdate = userData.birthdate || '';
      this.gender = userData.gender || '';
      this.address = {
        homeAddress:  userData.homeAddress || '',
        addressComplement:  userData.addressComplement || '',
        city:  userData.city || '',
        country:  userData.country || '',
        countryCod:  userData.countryCod || '',
        regionCountry:  userData.regionCountry || '',
        zip:  userData.zip || '',
        dialingCode:  userData.dialingCode || 0,
        coordinates: userData.coordinates || [0,0]
      };
      this.terms = userData.terms || false;
      this.userUnique = `${userData.fullName}_${userData.movil}_${userData.homeAddress}`;
      this.dateCreate = userData.dateCreate || '' 
    }
  }

module.exports = {
  CreateDataCustomerDTO,
};