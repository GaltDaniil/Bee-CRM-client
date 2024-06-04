import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from '@lodash';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { removeList } from './listsSlice';
import { removeCard, updateCard } from './cardSlice';
import { BoardSliceType } from './boardSlice';
import { CardsType, CardType } from '../types/CardType';
import { BoardType } from '../types/BoardType';

type AppRootStateType = RootStateType<[CardsSliceType, BoardSliceType]>;

/**
 * Get Cards
 */
export const getCards = createAppAsyncThunk<CardsType, string>(
    'scrumboardApp/cards/getCards',
    async (boardId) => {
        const response = await axios.get(`/api/scrumboard/boards/${boardId}/cards`);

        const data = (await response.data) as CardsType;

        return data;
    },
);

/**
 * Create New Card
 */
export const newCard = createAppAsyncThunk<
    CardType,
    { listId: string; newData: Partial<CardType> }
>('scrumboardApp/cards/newCard', async ({ listId, newData }, { getState }) => {
    const AppState = getState() as AppRootStateType;
    const board = AppState.scrumboardApp.board.data as BoardType;
    const response = await axios.post(
        `/api/scrumboard/boards/${board.board_id}/lists/${listId}/cards`,
        newData,
    );

    const data = (await response.data) as CardType;

    return data;
});

export const newCardFromChat = createAppAsyncThunk<
    string,
    {
        contact_id: string;
        contact_first_name: string;
        contact_last_name: string;
        contact_email: string;
        contact_phone: string;
        card_deal_offers: string[];
        chat_id: string;
        list_id: string;
        board_id: string;
    }
>('scrumboardApp/cards/newCardFromChat', async (data) => {
    const response = await axios.post(`/api/scrumboard/boards/${data.board_id}/cards/create`, data);

    //const data = (await response.data) as CardType;

    return 'data';
});

const cardsAdapter = createEntityAdapter<CardType>({
    selectId: (card) => card.card_id,
});

export const { selectAll: selectCards, selectById } = cardsAdapter.getSelectors(
    (state: AppRootStateType) => state.scrumboardApp.cards,
);

/**
 * The Scrumboard Cards Slice.
 */
export const cardsSlice = createSlice({
    name: 'scrumboardApp/cards',
    initialState: cardsAdapter.getInitialState({}),
    reducers: {
        resetCards: () => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCards.fulfilled, (state, action) =>
                cardsAdapter.setAll(state, action.payload),
            )
            .addCase(removeList.fulfilled, (state, action) => {
                const listId = action.payload;
                const { selectAll } = cardsAdapter.getSelectors();
                const cards = selectAll(state);
                const removedCardIds = _.map(_.filter(cards, { listId }), 'id');
                return cardsAdapter.removeMany(state, removedCardIds);
            })
            .addCase(newCard.fulfilled, (state, action) =>
                cardsAdapter.addOne(state, action.payload),
            )
            .addCase(updateCard.fulfilled, (state, action) =>
                cardsAdapter.setOne(state, action.payload),
            )
            .addCase(removeCard.fulfilled, (state, action) =>
                cardsAdapter.removeOne(state, action.payload),
            );
    },
});

export const { resetCards } = cardsSlice.actions;

export const selectCardById = (id: CardType['card_id']) => (state: AppRootStateType) =>
    selectById(state, id);

export type CardsSliceType = typeof cardsSlice;

export default cardsSlice.reducer;
