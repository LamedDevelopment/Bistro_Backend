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


module.exports = { 
    DataMenuBistroDTO 
}