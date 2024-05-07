import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';

/**
 * Typed useSelector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Typed useDispatch hook
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
