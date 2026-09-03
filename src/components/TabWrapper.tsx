import { Tab, TabContainer } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/list.js";
import "@ui5/webcomponents-icons/dist/card.js";
import { Card, CardId } from '../model/Card';
import { CardCollectionView } from './CardCollectionView';
import { useState } from 'react';
import { loadCollection, setOwned, replaceCollection } from '../model/Collection';
import { DeckView } from './DeckView';
import { map2Json } from '../model/Helpers';
import { CardCollection } from '../model/Collection';
import { debugLog } from '../tools/Debug';

export interface TabWrapperProps {
    cards: Card[]
};

function getCollectionKey(collection: CardCollection) {
  const BASE = 'coll-';
  const nb = collection.keys().reduce((total, k) => {
    return total + (collection.get(k) ?? 0);
  }, 0);
  return BASE + nb.toString();
}

export function TabWrapper(props: TabWrapperProps) {
  debugLog('Rendering TabWrapper')
  const [collection, setCollection] = useState(loadCollection(props.cards));
  debugLog(JSON.stringify(map2Json(collection)));
  const setInCollection = (id: CardId, owned: number) => {
    debugLog('Collection updated');
    setCollection(setOwned(collection, id, owned));
  };
  const updateCollection = (collection: CardCollection) => {
    debugLog('Collection replaced');
    replaceCollection(props.cards, collection);
    setCollection(collection);
  };
  return (
    <TabContainer
      contentBackgroundDesign="Solid"
      headerBackgroundDesign="Solid"
      tabLayout="Standard"
      style={{width: '100%'}}
    >
      <Tab
        icon="list"
        selected
        text="Ma collection de cartes"
      >
        <CardCollectionView cardDefinitions={props.cards} collection={collection} setInCollection={setInCollection} setCollection={updateCollection}/>
      </Tab>
      <Tab
        icon="card"
        text="Deck Builder"
      >
        <DeckView key={getCollectionKey(collection)} cardDefinitions={props.cards} collection={collection}/>
      </Tab>
    </TabContainer>
  );
}
