import { useDispatch, useSelector,type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Hook per sostituire useDispatch() - dispatch TIPIZZATO con AppDispatch
// (quando dispatchi un thunk o un'azione, TypeScript controlla i tipi)
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook per sostituire useSelector()
// TypedUseSelectorHook permette di tipizzare automaticamente lo stato
// Così useSelector sa quali proprietà esistono dentro lo store (RootState)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;