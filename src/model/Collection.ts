import { Card, CardId } from "./Card";
import { debugLog } from "../tools/Debug";

export type CardCollection = Map<CardId, number>;

export type DreambornCollectionCard = {
    setCode: string,
    number: number,
    owned: number
};
export type DreambornCollection = DreambornCollectionCard[];

const storage = window.localStorage;
const COLLECTION_PREFIX = 'lorcana.collection';

function getCardKey(cardId: CardId) {
    return `${COLLECTION_PREFIX}.${cardId}`;
}

export function loadCollection(existingCards: Card[]): CardCollection {
    const result = new Map<CardId, number>();
    existingCards.forEach(c => {
        const storedCount = Number.parseInt(storage.getItem(getCardKey(c.id)) ?? '0');
        result.set(c.id, storedCount);
    });
    return result;
}

export function setOwned(collection: CardCollection, cardId: CardId, owned: number): CardCollection {
    const result = new Map<CardId, number>(collection);
    result.set(cardId, owned);
    storage.setItem(getCardKey(cardId), owned.toString());
    return result;
}

function clearCollection(existingCards: Card[]) {
    existingCards.forEach(card => {
        const key = getCardKey(card.id);
        const currentlyOwned = storage.getItem(key);
        if(currentlyOwned === null) {
            storage.removeItem(key);
        }
    })
}

export function replaceCollection(existingCards: Card[], collection: CardCollection) {
    clearCollection(existingCards);
    collection.keys().forEach(cardId => {
        const owned = collection.get(cardId) ?? 0;
        storage.setItem(getCardKey(cardId), owned.toString());
    });
}

export function importDreambornCollection(exported: DreambornCollection, existingCards: Card[]): CardCollection {
    const result = new Map<CardId, number>();
    exported.forEach(expCard => {
        debugLog("Recherche de setCode " + expCard.setCode + " et number " + expCard.number);
        const knownCard = existingCards.find(card => Number.parseInt(card.setCode) === Number.parseInt(expCard.setCode) && card.number === expCard.number);
        if (knownCard !== undefined) {
            result.set(knownCard.id, expCard.owned);
        }
    });
    return result;
}

