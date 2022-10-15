import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { createRef } from 'react';
import { useParams } from 'react-router';
import { MarkdownEditor } from '../components/markdown/MarkdownEditor';
import { CommentNavigator } from '../components/comments/CommentNavigator';
import './HomeLayout.css';
import { MarkdownController } from '../components/markdown/MarkdownController';
import { debounce, debounceTime, Observable, Subscription, tap } from 'rxjs';
import { commentService } from '../services/comments/CommentService';
import { userService } from '../services/users/UserService';
import { Mimetypes } from '../services/comments/ICommentService';
import { CommentQuery } from '../models/CommentQuery';
import { UserProfile } from '../models/UserProfile';
import { FollowingUsers } from '../components/users/FollowingUsers';
import { Avatar } from '../components/users/Avatar';
import { UserProfileComponent } from '../components/users/UserProfileComponent';

const HomeLayout: React.FC = () => {

  let commentNavigator = React.createRef<CommentNavigator>();

  const params = useParams<{ commentId: string; }>();
  const parentCommentId = params.commentId || "";
  const query = new CommentQuery({ parentId: parentCommentId }, userService).mine();
  let [profile, setProfile] = useState(new UserProfile());

  let subscription: Subscription | null = null;

  let [markdownController, setMarkdownController] = useState(new MarkdownController());

  useEffect(() => {
    userService.readProfile().then(p => setProfile(p));
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
      .subscribe((markdown: string) => {
        console.log("updated markdown:", markdown)
      });
  }

  let create = async () => {
    //let streamId = await portal.create(markdown, 'text/markdown', _parentStreamId);
    let comment = await commentService.create<string>(markdownController.getMarkdown(), Mimetypes.MARKDOWN, parentCommentId);
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
          <IonButtons slot="end">
            <IonMenuButton menu="end" />
          </IonButtons>
          <IonTitle>{parentCommentId}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent >
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{parentCommentId}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem lines="none">
          <UserProfileComponent user={profile}></UserProfileComponent>
        </IonItem>
        <MarkdownEditor onMarkdownControllerChange={_ => updateMarkdownController(_)} markdown={markdownController.getMarkdown()} />
        <IonButton onClick={create}>Save</IonButton>

        <FollowingUsers></FollowingUsers>
        <CommentNavigator query={query} ref={commentNavigator}></CommentNavigator>
      </IonContent>
    </IonPage>
  );
};

export default HomeLayout;
