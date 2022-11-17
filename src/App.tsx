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
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useDndMonitor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { SortableItem } from './components/test/SortableItem';
import { selectionService } from './services/dnd/SelectionService';
import { createPortal } from 'react-dom';

console.log(process.env);

setupIonicReact();

// TODO: if you need custom measuring: https://github.com/clauderic/dnd-kit/issues/830
const App: React.FC = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    // may have to comment this out or put it in a conditional if testing in devtools or maybe devices.  It can conflict with TouchSensor.
    //useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
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

  return (
    <IonApp>
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
        </IonReactRouter>
        {createPortal(
          <DragOverlay >
            overlay
          </DragOverlay>,
          document.body
        )}
      </DndContext>

    </IonApp>
  );
};

export default App;
