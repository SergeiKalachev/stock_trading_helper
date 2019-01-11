import * as OfficeHelpers from '@microsoft/office-js-helpers';

// returns current server protocol, host, and port like 'protocol://servername:port'  e.g. http://localhost:3000
export function getServerHost() {
    let host = '';
    if (typeof window !== 'undefined' && window.location) {
        const loc = window.location;
        host = `${loc.protocol}//${loc.host}`;
    }
    return host;
}

export async function wrapExcelLogic(logic) {
    try {
        return await Excel.run(logic);
    }
    catch (error) {
        OfficeHelpers.UI.notify(error);
        throw error;
    }
}

// from https://stackoverflow.com/a/2117523
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}