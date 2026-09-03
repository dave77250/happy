import "@ui5/webcomponents-icons/dist/list.js";
import "@ui5/webcomponents-icons/dist/card.js";
import { useEffect, useState } from 'react';
import { Card, loadCards } from './model/Card';
import { TabWrapper } from './components/TabWrapper';
import { IllustratedMessage } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-fiori/dist/illustrations/tnt/User2.js";

function App() {
  const [cards, setCards] = useState<Card[] | undefined>(undefined);
  useEffect(() => {
    loadCards().then(setCards);
  }, []);
  return cards 
    ? <TabWrapper cards={cards}/>
    : <IllustratedMessage name="TntUser2" titleText="Chargement en cours..."/>
}

export default App;
