import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { createRef } from 'react';
import { useParams } from 'react-router';
import { MarkdownEditor } from '../components/markdown/MarkdownEditor';
import { CommentNavigator } from '../components/comments/CommentNavigator';
import './HomeLayout.css';
import { CeramicPortal, CeramicProfile } from '../lib/ceramic/ceramic-portal';
import config from '../config.json'
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { CommentStandard } from '../components/comments/CommentStandard';
import { DisintComment } from '../models/DisintComment';
import { MarkdownController } from '../components/markdown/MarkdownController';
import { debounce, debounceTime, Observable, Subscription, tap } from 'rxjs';
import { commentService } from '../services/comments/CommentService';
import { Mimetypes } from '../services/comments/ICommentService';

const HomeLayout: React.FC = () => {

  let commentNavigator = React.createRef<CommentNavigator>();

  const { streamId } = useParams<{ streamId: string; }>();
  let _parentStreamId = streamId || config.rootDocumentStreamId;
  let portal = CeramicPortal.getInstance(config.ceramicEndpoints);
  let subscription: Subscription | null = null;

  let [markdownController, setMarkdownController] = useState(new MarkdownController());
  
  useEffect(() => {
    return () => { // onDestroy
      subscription?.unsubscribe();
    }
  })
  
  let updateMarkdownController = (markdownController: MarkdownController) => {
    setMarkdownController(markdownController);
    if (subscription) subscription.unsubscribe();
    subscription = markdownController.$input()
      .pipe(
        debounceTime(10), // covers up a bug where this is being called twice in a row some how
        // tap(markdown => {
        //   console.log("**", markdown)
        // })
      )
      .subscribe( (markdown: string) => {
        console.log("updated markdown:", markdown)
      });
  }

  let create = async () => {
    //let streamId = await portal.create(markdown, 'text/markdown', _parentStreamId);
    let comment = await commentService.add<string>(markdownController.getMarkdown(), Mimetypes.MARKDOWN);
    console.log(comment);
    markdownController.setMarkdown('');

    // a few ways to do this:
    // 1) pass in the comments.  but, we want commentNavigator to take care of its own comments
    // 2) force some opts to update to re-render the navigator
    // 3) get a ref to commentNavigator and call it manually.
    // 4) convert this to a class component from a function component, and then call this.forceUpdate()
    commentNavigator.current?.loadComments();

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{_parentStreamId}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent >
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{_parentStreamId}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <MarkdownEditor onMarkdownControllerChange={_ => updateMarkdownController(_)} markdown={markdownController.getMarkdown()} />
        <IonButton onClick={create}>Save</IonButton>

        <CommentNavigator parentStreamId={_parentStreamId} ref={commentNavigator}></CommentNavigator>
      </IonContent>
    </IonPage>
  );
};

export default HomeLayout;
