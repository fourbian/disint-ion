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
import { selectionService } from './services/SelectionService'

console.log(process.env);

setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <DragDropContext
        onBeforeCapture={selectionService.onBeforeCapture.bind(selectionService)}
        onBeforeDragStart={selectionService.onBeforeDragStart.bind(selectionService)}
        onDragStart={selectionService.onDragStart.bind(selectionService)}
        onDragUpdate={selectionService.onDragUpdate.bind(selectionService)}
        onDragEnd={selectionService.onDragEnd.bind(selectionService)}
        enableDefaultSensors={false}
        sensors={[useMouseSensor, useTouchSensor]}
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
      </DragDropContext>

    </IonApp>
  );
};

export default App;
