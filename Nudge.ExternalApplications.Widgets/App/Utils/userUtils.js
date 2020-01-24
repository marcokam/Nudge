import { uriToID } from "../Utils/uriUtils.js";

export function mapUserDetailData(data) {
    return {
        ...data,
        id: parseInt(uriToID(data.uri), 10),
        locality: {
            cty: data.city,
            stt: data.state,
            cnt: data.country
        },
        // map to old property names (commented properties don't exist on new endpoint)
        usrIdn: parseInt(uriToID(data.uri), 10),
        usrDspNam: data.name,
        usrFstNam: data.firstName,
        usrLstNam: data.lastName,
        usrEml: data.email,
        // crtDte,
        // crtDteUnx,
        tmeZneId: data.timeZoneID,
        tmeZne: {
            // stdName,
            stnNamOff: data.timeZone,
            // posOff,
        },
        // updEml,
        // locDetId,
        locDet: {
            // adr
            locality: {
                // lat,
                // lon,
                cty: data.city,
                stt: data.state,
                cnt: data.country
            }
        },
        jobTtl: data.jobTitle,
        cmpNam: data.companyName,
        usrImgUrl: data.imageUrl,
        isTstUsr: data.isTestUser,
        ntfEml: data.notificationEmail
    };
}

export function mapUser(data) {
    return {
        uri: data.uri,
        id:uriToID(data.uri),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        imageUrl: data.usrImgUrl,
        jobTitle: data.jobTtl,
        hasAccessedChromeExtension: data.hasAccessedChromeExtension,
        licenses: data.licenses,
        impersonatedBy: data.impersonatedBy
    };
}