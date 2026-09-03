const storage = window.localStorage;

const COLUMNS_KEY = 'lorcana.columns';
const DEFAULT_COLUMNS = '3';

export function getColumns() {
    return Number.parseInt(storage.getItem(COLUMNS_KEY) ?? DEFAULT_COLUMNS);
}

export function setColumns(nbColumns: number) {
    storage.setItem(COLUMNS_KEY, nbColumns.toString());
}
