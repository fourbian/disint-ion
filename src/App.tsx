import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import Menu2 from './components/Menu2';
import HomeLayout from './pages/HomeLayout';
import './App.css';


/* Theme variables */
import { CancelDrop, closestCenter, defaultDropAnimationSideEffects, DndContext, DragEndEvent, DragOverlay, DragStartEvent, DropAnimation, KeyboardSensor, MeasuringStrategy, MouseSensor, PointerSensor, TouchSensor, useDndMonitor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';
import { selectionService } from './services/dnd/SelectionService';
import { createPortal } from 'react-dom';
import { CommentNavigatorItem } from './components/comments/CommentNavigatorItem';
import { ChakraProvider, theme } from '@chakra-ui/react';

// TODO: if you need custom measuring: https://github.com/clauderic/dnd-kit/issues/830
const App: React.FC = () => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const [activeDomId, setActiveDomId] = useState("");
  const [activeItemId, setActiveItemId] = useState("");
  const [activeContainerId, setActiveContainerId] = useState("");

  const onDragStart = (event: DragStartEvent): void => {
    selectionService.onDragStart(event);

    let active = event.active
    setActiveDomId(active.id.toString());
    setActiveContainerId(active.data?.current?.containerId || "no container id specified by CommentNavigatorItem?");
    setActiveItemId(active.data?.current?.itemId || "no item id specified by CommentNavigatorItem?")
  }

  const onDragEnd = (event: DragEndEvent): void => {
    selectionService.onDragEnd(event);

    setActiveDomId("");
    setActiveContainerId("");
  }

  return (
    <ChakraProvider theme={theme}>
      <DndContext
        sensors={sensors}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={onDragStart}
        onDragMove={selectionService.onDragMove.bind(selectionService)}
        onDragOver={selectionService.onDragOver.bind(selectionService)}
        onDragEnd={onDragEnd}
        onDragCancel={selectionService.onDragCancel.bind(selectionService)}
        modifiers={selectionService.modifiers}
        collisionDetection={selectionService.collisionDetectionStrategy}

      >

        <Router>

          <Menu />
          <Menu2 />
          <Switch>
            <Route path="/HomeLayout" exact={true}>
              <Redirect to="/page/Inbox" />
            </Route>
            <Route path="/" exact={true}>
              <HomeLayout />
            </Route>
            <Route path="/comments/:commentId" exact={true}>
              <HomeLayout />
            </Route>
          </Switch>
          {createPortal(
            <DragOverlay className='dnd-overlay'>
              <CommentNavigatorItem containerId={activeContainerId} domId={activeDomId} commentId={activeItemId}></CommentNavigatorItem>
            </DragOverlay>,
            document.body
          )}
        </Router>
      </DndContext>

    </ChakraProvider>


  );
};

export default App;
