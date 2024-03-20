import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useParams } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import { useDeepCompareEffect } from '@fuse/hooks';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { getBoard, reorderCard, reorderList, resetBoard, selectBoard } from '../store/boardSlice';
import BoardAddList from './board-list/BoardAddList';
import BoardList from './board-list/BoardList';
import BoardCardDialog from './dialogs/card/BoardCardDialog';
import BoardSettingsSidebar from './sidebars/settings/BoardSettingsSidebar';
import { getCards } from '../store/cardsSlice';
import { getLists } from '../store/listsSlice';
import { getLabels } from '../store/labelsSlice';
import BoardHeader from './BoardHeader';
import { updateCard, updateCardStatus } from '../store/cardSlice';
import socket from 'src/app/socket';
import { getUsers } from 'app/store/user/userListSlice';

/**
 * The board component.
 */
function Board() {
    const dispatch = useAppDispatch();
    const { data: board } = useAppSelector(selectBoard);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

    const routeParams = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { boardId } = routeParams;

    useDeepCompareEffect(() => {
        dispatch(getBoard(boardId));
        dispatch(getCards(boardId));
        dispatch(getLists(boardId));
        dispatch(getUsers());
        //dispatch(getLabels(boardId));

        return () => {
            dispatch(resetBoard());
        };
    }, [dispatch, routeParams]);

    useEffect(() => {
        socket.on('updateBoard', () => {
            dispatch(getBoard(boardId));
            dispatch(getCards(boardId));
        });
    }, []);

    function onDragEnd(result: DropResult) {
        const { source, destination } = result;

        // dropped nowhere
        if (!destination) {
            return;
        }

        // did not move anywhere - can bail early
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // reordering list
        if (result.type === 'list') {
            dispatch(reorderList(result));
        }

        // reordering card
        if (result.type === 'card') {
            if (result.destination.droppableId === result.source.droppableId) {
                dispatch(reorderCard(result));
            } else {
                dispatch(reorderCard(result));
                //@ts-ignore
                dispatch(
                    updateCardStatus({
                        card_id: result.draggableId,
                        list_id: result.destination.droppableId,
                    }),
                );
            }
        }
    }
    if (!board) {
        return null;
    }
    return (
        <>
            <FusePageSimple
                header={<BoardHeader onSetSidebarOpen={setSidebarOpen} />}
                content={
                    board?.board_lists ? (
                        <div className="flex flex-1 overflow-x-auto overflow-y-hidden h-full">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="list" type="list" direction="horizontal">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            className="flex py-16 md:py-24 px-8 md:px-12"
                                        >
                                            {board.board_lists?.map((list, index) => (
                                                <BoardList
                                                    key={list.list_id}
                                                    listId={list.list_id}
                                                    cardIds={list.list_cards}
                                                    index={index}
                                                />
                                            ))}

                                            {provided.placeholder}

                                            <BoardAddList />
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    ) : null
                }
                rightSidebarOpen={sidebarOpen}
                rightSidebarContent={<BoardSettingsSidebar onSetSidebarOpen={setSidebarOpen} />}
                rightSidebarOnClose={() => setSidebarOpen(false)}
                scroll={isMobile ? 'normal' : 'content'}
                rightSidebarWidth={320}
            />
            <BoardCardDialog />
        </>
    );
}

export default withRouter(Board);
