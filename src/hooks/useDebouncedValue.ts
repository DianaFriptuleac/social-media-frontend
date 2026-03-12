import { useEffect, useState } from "react";
// Hook custom generico per ottenere un valore "debounced":
// il valore restituito viene aggiornato solo dopo un certo ritardo
// utile per non filtrare o cercare ad ogni singolo tasto premuto
export function useDebouncedValue<T>(value: T, delayMs: number) {
    const [debounced, setDebounced] = useState(value);       // il valore ritardato

    // Ogni volta che value o delayMs cambiano
    useEffect(() => {
        // timer che dopo delayMs millisecondi aggiorna debounced
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);    // se value cambia prima che scada il timer, il timer precedente viene cancellato
    }, [value, delayMs]);

    return debounced;
}