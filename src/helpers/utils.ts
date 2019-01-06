// returns current server protocol, host, and port like 'protocol://servername:port'  e.g. http://localhost:3000
export function getServerHost() {
    let host = '';
    if (typeof window !== 'undefined' && window.location) {
        const loc = window.location;
        host = `${loc.protocol}//${loc.host}`;
    }
    return host;
}