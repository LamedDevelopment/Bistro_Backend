class CreateStaffDTO {
    constructor(data, countryCod, dateCreate) {
      this.name = data.name;
      this.lastName = data.lastName;
      this.movil = data.movil;
      this.document = data.document;
      this.email = data.email;
      this.pass = data.pass;
      this.role = data.role;
      this.country = data.country;
      this.countryCod = countryCod;
      this.city = data.city;
      this.zip = data.zip;
      this.membership = data.membership;
      this.terms = data.terms;
      this.userUnique = `${data.document}_${data.movil}_${data.email}`;
      this.dateCreate = dateCreate 
    }
  }

class CreateDataStaffDTO {
    constructor(userData, DataCreateBusinessDto, lowerCaseEmail, properCaseName, properCaseLastName) {
      this.name = properCaseName;
      this.lastName = properCaseLastName;
      this.movil = userData.movil;
      this.document = userData.document;
      this.email = lowerCaseEmail;
      this.pass = userData.pass;
      this.role = userData.role;
      this.country = userData.country;
      this.countryCod = userData.countryCod;
      this.city = userData.city;
      this.zip = userData.zip;
      this.membership = DataCreateBusinessDto.membership;
      this.terms = userData.terms;
      this.userUnique = `${userData.document}_${userData.movil}_${userData.email}`;
      this.dateCreate = userData.dateCreate 
    }
  }

module.exports = { 
    CreateStaffDTO,
    CreateDataStaffDTO,
};