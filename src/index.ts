import { exec } from 'child_process';
import { CURRENT_VERSION, TELEGRAM_URL } from './constants';

export { AminoDorks } from './core/aminodorks';
export { AminoDorksNDC } from './core/aminodorksNdc';
export * as types from './types/additional';

console.log(`\x1b[34mVisit our community:\x1b[32m ${TELEGRAM_URL}\x1b[0m`);
exec('npm view amino.dorks version', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error retrieving npm package version for amino.dorks: ${stderr.trim()}`);
        return;
    };
    
    if (stdout.trim() !== CURRENT_VERSION) {
        console.log(`\x1b[33mYou're using outdated version. amino.dorks v${CURRENT_VERSION} is available.\x1b[0m`);
    };
});
