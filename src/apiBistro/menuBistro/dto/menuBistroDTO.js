class DataMenuBistroDTO {
    constructor(uid, business, menu) {
        this.uid = uid;
        this.business = {
            businessID: business.business,
            nit: business.nit,
            businessName: business.businessName,
            tradename: business.tradename,
            countryCod: business.countryCod
        };
        this.menu =menu
    }
}


class DataViewMenuBistroDTO {
    constructor( business) {
        this.business = {
            businessID: business.businessID,
            nit: business.nit,
            businessName: business.businessName,
            tradename: business.tradename,
            countryCod: business.countryCod
        };
    }
}


module.exports = { 
    DataMenuBistroDTO,
    DataViewMenuBistroDTO
}