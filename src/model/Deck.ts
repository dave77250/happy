import { CardId, Card } from "./Card";
import { DeckCard, createDeckCardFrom, getAvailable, setUsable, pick, exclude } from "./DeckCard";
import { CardCollection } from "./Collection";
import { debugLog } from "../tools/Debug";

export const DECK_SIZE = 60;
export const MAX_IDENTICAL_CARDS = 4;
export const MAX_COLORS = 2;

export type Deck = DeckCard[];

export function getDeckSize(deck: Deck) {
    return deck.reduce((total, card) => total + card.selected, 0);
}

function makeCardMap(cards: Card[]) {
    const result = new Map<CardId, Card>();
    cards.forEach(card => result.set(card.id, card));
    return result;
}

export function getDeckColors(deck: Deck, allCards: Card[]) {
    const colorMap = new Map<string, boolean>();
    const cardMap = makeCardMap(allCards);
    deck.forEach(card => {
        if (card.selected > 0) {
            colorMap.set(cardMap.get(card.id)?.color ?? 'unknown', true);
        }
    });
    return colorMap.keys().toArray();
}

export function createDeck(collection: CardCollection): Deck {
    const result: Deck = [];
    collection.keys().forEach(id => {
        const owned = collection.get(id) ?? 0;
        if (owned > 0) {
            result.push(createDeckCardFrom(id, owned));
        }
    });
    return result;
}

export function pickCard(deck: Deck, allCards: Card[], id: CardId, picked: number, isAutoPicked = false) {
    // reset usability for all cards
    var result = deck.map(c => setUsable(c, true));
    // pick the desired card
    result = result.map( c => c.id === id? pick(c, picked, isAutoPicked): c);
    // now check the colors rule, and exclude cards of the wrong colors
    const colors = getDeckColors(result, allCards);
    if (colors.length >= MAX_COLORS) {
        const cardMap = makeCardMap(allCards);
        result = result.map(c => {
            const color = cardMap.get(c.id)?.color ?? 'unknown';
            if (colors.find(col => col === color) !== undefined) {
                return c;
            } else {
                return setUsable(c, false);
            }
        });
    }
    // Finally ensure that if the deck is full, all non-selected cards are not usable
    // and the deck remains under the allowed size
    const currentDeckSize = getDeckSize(result);
    if (currentDeckSize >= DECK_SIZE) {
        result = result.map(c => c.selected > 0 ? c : setUsable(c, false));
    }
    return result;
}

export function excludeCard(deck: Deck, id: CardId, excluded: number) {
    return deck.map(dc => dc.id === id? exclude(dc, excluded): dc);
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function addRandomCard(deck: Deck, allCards: Card[]) {
    const availableCards = deck.filter(dc => { return getAvailable(dc) > 0; });
    if (availableCards.length === 0) {
        return deck;
    }
    const pickedCard = availableCards[getRandomInt(availableCards.length)];
    const updatedSelected = pickedCard.selected + 1;
    debugLog('picking card ' + pickedCard.id + ' with selected = ' + updatedSelected);
    return pickCard(deck, allCards, pickedCard.id, updatedSelected, true);
}

export function completeDeck(deck: Deck, allCards: Card[]) {
    debugLog('Appel de completeDeck');
    var result = deck;
    var deckSize = getDeckSize(result);
    debugLog('deck size = ' + deckSize.toString());
    while (deckSize < DECK_SIZE) {
        debugLog('dans while, deck size = ' + deckSize.toString());
        result = addRandomCard(result, allCards);
        const updatedDeckSize = getDeckSize(result);
        debugLog('deck size apres pick = ' + updatedDeckSize.toString());
        if (updatedDeckSize === deckSize) {
            break;
        }
        deckSize = updatedDeckSize;
    }
    debugLog('completeDeck fini, deck size = ' + getDeckSize(result).toString());
    return result;
}

export function excludeAllSelected(deck: Deck) {
    return deck.map(dc => {
        return { ...dc, excluded: dc.selected, selected: 0, isUsable: true, isAutoPicked:false };
    });
}
