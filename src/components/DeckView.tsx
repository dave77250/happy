import { StepInput, MessageStrip, FlexBox, FlexBoxDirection, FlexBoxJustifyContent, Button } from "@ui5/webcomponents-react";
import { Card, CardId } from "../model/Card"
import { createDeck, pickCard, DECK_SIZE, Deck, getDeckSize, getDeckColors, MAX_COLORS, completeDeck, MAX_IDENTICAL_CARDS, excludeAllSelected } from "../model/Deck";
import { DeckCard, getAvailable } from "../model/DeckCard";
import { SearchableCardGrid } from "./SearchableCardGrid";
import { useState } from "react";
import { CardCollection } from "../model/Collection";
import { debugLog } from "../tools/Debug";
import "@ui5/webcomponents-icons/dist/reset.js"

export type DeckViewProps = {
    collection: CardCollection,
    cardDefinitions: Card[]
}

enum DeckBuilderState {
  NotEnoughCards,
  NeedMoreColors,
  PartialDeck,
  CompleteDeck
};

function computeDeckState(deck: Deck, allCards: Card[]): DeckBuilderState {
  debugLog('Computing deck state for deck');
  debugLog(deck);
  debugLog('deck size = ' + getDeckSize(deck).toString());
    if (getDeckSize(deck) === DECK_SIZE) {
        return DeckBuilderState.CompleteDeck;
    }
    const deckMap = new Map<CardId, DeckCard>();
    deck.forEach(dc => {
        deckMap.set(dc.id, dc);
    });
    const cards4Deck = allCards.reduce((total, card) => {
        const deckCard = deckMap.get(card.id);
        return total + getAvailable(deckCard) + (deckCard?.selected ?? 0);
    }, 0);
    debugLog('cards potential = ' + cards4Deck.toString());
    if (cards4Deck < DECK_SIZE) {
        return DeckBuilderState.NotEnoughCards;
    }
    const deckColors = getDeckColors(deck, allCards);
    debugLog('deck colors = ' + JSON.stringify(deckColors));
    if (deckColors.length < MAX_COLORS) {
        return DeckBuilderState.NeedMoreColors;
    }
    // tous les autres cas: deck partiel, possible de compléter
    return DeckBuilderState.PartialDeck;
}

function getHeaderMessage(state: DeckBuilderState, doCompleteDeck: () => void, doNextDeck: () => void) {
    switch(state) {
      case DeckBuilderState.NotEnoughCards:
        return <MessageStrip design="Critical" hideCloseButton={true}>Désolé, vous n'avez pas assez de cartes pour créer un deck</MessageStrip>;
      case DeckBuilderState.NeedMoreColors:
        return <MessageStrip design="Information" hideCloseButton={true}>Choisissez des cartes de 2 couleurs différentes pour créer votre deck.</MessageStrip>
      case DeckBuilderState.PartialDeck:
        return <FlexBox direction={FlexBoxDirection.Row} justifyContent={FlexBoxJustifyContent.SpaceBetween}>
            <MessageStrip design="Positive" hideCloseButton={true}>Cliquez sur le bouton pour compléter automatiquement ce deck.</MessageStrip>
            <Button onClick={doCompleteDeck}>Compléter</Button>
        </FlexBox>
      case DeckBuilderState.CompleteDeck:
        return <FlexBox direction={FlexBoxDirection.Row} justifyContent={FlexBoxJustifyContent.SpaceBetween}>
            <MessageStrip design="Positive" hideCloseButton={true}>Deck complet, cliquez sur le bouton pour créer un autre deck sans ces cartes.</MessageStrip>
            <Button onClick={doNextDeck}>Deck suivant</Button>
        </FlexBox>
    }
}

function getDeckKey(deck: Deck) {
  const BASE="DECK-";
  const nbCards = deck.reduce((total, card) => total + (card?.selected ?? 0), 0);
  return BASE + nbCards.toString();
}

export function DeckView(props: DeckViewProps) {
    const [deck, setDeck] = useState(createDeck(props.collection));
    const [searchText, setSearchText] = useState("");
    const deckState = computeDeckState(deck, props.cardDefinitions);
    const deckMap = new Map<CardId, DeckCard>();
    deck.forEach(dc => {
      deckMap.set(dc.id, dc);
    });
    debugLog("rendering DeckView");
    const displayedCards = props.cardDefinitions.filter(card => {
        const deckCard = deckMap.get(card.id);
        const isUsableCard = deckCard?.isUsable ?? false;
        const nbSelected = deckCard?.selected ?? 0;
        const isAvailableOrSelected = (getAvailable(deckCard) > 0) || (nbSelected > 0);
        return isUsableCard && isAvailableOrSelected;
    });
    debugLog("displayedCards has length " + displayedCards.length.toString());
    const setIncluded = (id: CardId, nb:number) => {
      setDeck(pickCard(deck, props.cardDefinitions, id, nb));
    }
    const getDeckDetailsView = (id: CardId) => {
        const deckCard = deckMap.get(id);
        const nbSelected = deckCard?.selected ?? 0; // max selectable = available + currently selected
        return (
          <FlexBox direction={FlexBoxDirection.Column}>
            <FlexBox direction={FlexBoxDirection.Row} justifyContent={FlexBoxJustifyContent.Center}>
              <StepInput disabled={deckState === DeckBuilderState.CompleteDeck} min={0} max={Math.min(nbSelected + getAvailable(deckCard), MAX_IDENTICAL_CARDS)} value={nbSelected} onChange={(event) => {
                setIncluded(id, event.target.value);
              }}/>
            </FlexBox>
          </FlexBox>
        );
      };
    const shouldHighlightCard = (cardId: CardId) => {
      const deckCard = deckMap.get(cardId);
      return deckCard?.isAutoPicked ?? false;
    }
    // la toolbar pour le switch et le bouton reset
    const extraToolbar = <FlexBox direction={FlexBoxDirection.Row} alignItems="Center">
      <Button icon="reset" onClick={() => { setDeck(createDeck(props.collection)); }}/>
    </FlexBox>;
    const deckKey = getDeckKey(deck);
    debugLog("deck key is " + deckKey);
    return (
      <>
        {getHeaderMessage(deckState, () => {
          debugLog('Now calling completeDeck');
          setDeck(completeDeck(deck, props.cardDefinitions));
          }, () => {
            setDeck(excludeAllSelected(deck));
          })}
        <SearchableCardGrid
          key={deckKey}
          cardCollection={displayedCards}
          getExtraCardComponent={getDeckDetailsView}
          extraToolBarComponent={extraToolbar}
          shouldHighlight={shouldHighlightCard}
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
      </>
    );
}