const isDebugLogEnabled = true;

export function debugLog(message: any) {
    if (isDebugLogEnabled) {
        console.log(message);
    }
}