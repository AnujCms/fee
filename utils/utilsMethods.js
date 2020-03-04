const lodash = require('lodash');

module.exports = {
    
    getUnionOfBGMeters : function(accountDetail){
        let childSupportedBgmeter = accountDetail.supportedbgmetertype !== null ? accountDetail.supportedbgmetertype.split(',').map(Number): [];
        let parentSupportedBgmeter = accountDetail.parentsupportedbgmetertype !== null ? accountDetail.parentsupportedbgmetertype.split(',').map(Number): [];
    
        let supportedBgList = lodash.union(childSupportedBgmeter,parentSupportedBgmeter);
    
        if(supportedBgList.length > 0){
            return supportedBgList.join(',');
        } else {
            return null;
        }
    }
}