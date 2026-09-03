export function map2Json<K, V>(map: Map<K, V>) {
    const result: any = {};
    map.keys().forEach(k => {
        result[k] = map.get(k);
    });
    return result;
}
