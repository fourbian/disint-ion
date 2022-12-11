import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Menu2 from './components/Menu2';
import HomeLayout from './pages/HomeLayout';
import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { DragDropContext } from 'react-beautiful-dnd';
import { useMouseSensor, useTouchSensor } from 'react-beautiful-dnd';
import { CancelDrop, closestCenter, defaultDropAnimationSideEffects, DndContext, DragEndEvent, DragOverlay, DragStartEvent, DropAnimation, KeyboardSensor, MeasuringStrategy, MouseSensor, PointerSensor, TouchSensor, useDndMonitor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';
import { SortableItem } from './components/test/SortableItem';
import { selectionService } from './services/dnd/SelectionService';
import { createPortal } from 'react-dom';
import { coordinateGetter } from './components/test/MultipleContainersKeyboardCoordinates';
import { CommentNavigatorItem } from './components/comments/CommentNavigatorItem';

//console.log(process.env);


const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

setupIonicReact();

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



  /*
    return (
      <DndContext
        autoScroll={true}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={selectionService.onDragStart.bind(selectionService)}
        onDragMove={selectionService.onDragMove.bind(selectionService)}
        onDragOver={selectionService.onDragOver.bind(selectionService)}
        onDragEnd={selectionService.onDragEnd.bind(selectionService)}
        onDragCancel={selectionService.onDragCancel.bind(selectionService)}
  
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map((id, index) => <SortableItem key={id} id={id} />)}
        </SortableContext>
      </DndContext>
  )*/
  //        collisionDetection={selectionService.collisionDetectionStrategy}

  return (
    <IonApp>

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

        <IonReactRouter>
          <IonSplitPane contentId="main">

            <Menu />
            <Menu2 />
            <IonRouterOutlet id="main">
              <Route path="/HomeLayout" exact={true}>
                <Redirect to="/page/Inbox" />
              </Route>
              <Route path="/" exact={true}>
                <HomeLayout />
              </Route>
              <Route path="/comments/:commentId" exact={true}>
                <HomeLayout />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
          {createPortal(
            <DragOverlay className='dnd-overlay'>
              <CommentNavigatorItem  containerId={activeContainerId} domId={activeDomId} commentId={activeItemId}></CommentNavigatorItem>
            </DragOverlay>,
            document.body
          )}
        </IonReactRouter>
      </DndContext>

    </IonApp>
  );
};

export default App;
