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

export async function wrapExcelLogic(
    logic: (context: Excel.RequestContext) => any,
    errorHandler?: (error: OfficeExtension.Error) => any
) {
    try {
        await Excel.run(logic);
    } catch (error) {
        if (errorHandler) {
            errorHandler(error);
        } else {
            OfficeHelpers.UI.notify(error);
        }
    }
}

export function stringify(obj) {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (_key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

    return JSON.stringify(obj, getCircularReplacer());
}

// from https://stackoverflow.com/a/2117523
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function mapColumnIntoArrayOfValues(column: any[][]) {
    // this is an array of arrays, where each array consists of only one element
    // we remove 1st array because it is header
    return column.slice(1).map(elem => elem[0]);
}

export function getArrayWithMultipleItems(item, countToMultiply) {
    let result = [];
    for (let i = 0; i < countToMultiply; i++) {
        result.push(item);
    }
    return result;
}
