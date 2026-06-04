interface EventMapProps {
  location?: string | null;
}
const EventMap = ({ location }: EventMapProps) => {
  if (!location?.trim()) {
    //if location don't exist or is empty
    return <div className="event-map-empty">No location available.</div>;
  }

  const encodedLocation = encodeURIComponent(location);
  // Converte caratteri speciali e spazi in un formato sicuro per gli URL.
  // Esempio:
  // "Via Roma 10, Milano"
  // diventa
  // "Via%20Roma%2010%2C%20Milano"

  return (
    <div className="event-map">
      {/* 
        Iframe incorpora Google Maps direttamente nella pagina
        Nel src:
        q=  ->  indirizzo da cercare
        output=embed -> modalità incorporata (senza menu Google completo)
      */}
      <iframe
        title={`Map of ${location}`} // titolo accessibilità
        src={`https://www.google.com/maps?q=${encodedLocation}&output=embed`}
        loading="lazy" // carica la mappa solo quando entra nel viewport
        referrerPolicy="no-referrer-when-downgrade" // Invia l'URL della pagina come referrer solo quando la destinazione
        // è altrettanto sicura (HTTPS). Impedisce l'invio dei dati del referrer
        // a pagine HTTP meno sicure.
      />
      {/*
        Link esterno per aprire Google Maps in una nuova scheda.
      */}
      <a
        className="event-map-link"
        href={`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
        target="_blank" // nuova scheda
        rel="noreferrer" // sicurezza  privacy
      >
        Open map
      </a>
    </div>
  );
};
export default EventMap;
