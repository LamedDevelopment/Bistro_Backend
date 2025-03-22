class CreateDataBusinessDTO {
    constructor(businessName,tradeName,nit,branchoffices,email,movil,phone,img,address,country,countryCod,regionCountry,
        city,zip,billingResolution,tax,services,typeService,description) {
      this.businessName = businessName;
      this.tradeName = tradeName;
      this.nit = nit;
      this.branchoffices = branchoffices;
      this.email = email;
      this.movil = movil;
      this.phone = phone;
      this.img = img;
      this.services = services;
      this.typeService = typeService;
      this.address = address;
      this.country = country;
      this.countryCod = countryCod;
      this.regionCountry = regionCountry;
      this.city = city;
      this.zip = zip;
      this.tax = tax;
      this.billingResolution = billingResolution;
      this.description = description;
    }
  }


class CreateBusinessDTO {
      constructor(businessName,tradeName,nit,branchoffices,email,movil,phone,img, address,country,countryCod,regionCountry,
        city,zip,billingResolution,tax,services,typeService,description,dateCreate) {
      this.businessName = businessName;
      this.tradeName = tradeName;
      this.nit = nit;
      this.branchoffices = branchoffices;
      this.email = email;
      this.movil = movil;
      this.phone = phone;
      this.img = img;
      this.services = services;
      this.typeService = typeService;
      this.address = address;
      this.country = country;
      this.countryCod = countryCod;
      this.regionCountry = regionCountry;
      this.city = city;
      this.zip = zip;
      this.tax = tax;
      this.billingResolution = billingResolution;
      this.description = description;
      this.dateCreate = dateCreate;
    }
  }

  class DataCreateBusinessDTO {
    constructor(businessDB, dateCreate) {
    this.membership = {
      establishments: businessDB._id,
      nit: businessDB.nit,
      businessName: businessDB.businessName,
      tradeName: businessDB.tradeName,
      dateCreate: dateCreate,
    }
  }
}

  module.exports = { 
    CreateDataBusinessDTO,
    CreateBusinessDTO,
    DataCreateBusinessDTO,
  };