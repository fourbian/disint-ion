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
import { LazyAvatar } from '../components/users/LazyAvatar';
import { UserProfileComponent } from '../components/users/UserProfileComponent';
import { CommentStandard } from '../components/comments/CommentStandard';
import { PopoverButton } from '../components/shared/PopoverButton';
import { popoverController } from '@ionic/core';
import { CommentBrief } from '../components/comments/CommentBrief';

const HomeLayout: React.FC = () => {

  let commentNavigator = React.createRef<CommentNavigator>();
  const params = useParams<{ commentId: string; }>();
  const parentCommentId = params.commentId || "";
  const baseQuery = () => new CommentQuery(userService).mine().following().parentOrTopLevel(parentCommentId);
  let [query, setQuery] = useState(baseQuery());
  let [profile, setProfile] = useState(new UserProfile());
  let [commentView, setCommentView] = useState("CommentBrief");

  let markdownControllerSubscription: Subscription | null = null;
  let unFollowingSubscription: Subscription;
  let followingSubscription: Subscription;

  let [markdownController, setMarkdownController] = useState(new MarkdownController());

  let onFollowUserUpdate = (user: UserProfile) => {
    if (user?.userId) {
      setQuery(baseQuery());
    }
  }

  useEffect(() => {
    userService.readCurrentUserProfile().then(p => {
      if (p && !p.isEqual(profile)) {
        setProfile(p)
      }
    });
    followingSubscription = userService.onFollowing(onFollowUserUpdate.bind(this));
    unFollowingSubscription = userService.onUnFollowing(onFollowUserUpdate.bind(this));

    return () => { // onDestroy
      markdownControllerSubscription?.unsubscribe();
      unFollowingSubscription?.unsubscribe();
      followingSubscription?.unsubscribe();
    }
  })

  let updateMarkdownController = (markdownController: MarkdownController) => {
    setMarkdownController(markdownController);
    if (markdownControllerSubscription) markdownControllerSubscription.unsubscribe();
    markdownControllerSubscription = markdownController.$input()
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

  let onSetCommentView = (viewName: string) => {
    setCommentView(viewName);
    popoverController.dismiss();
    // TODO: save view
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
        {<MarkdownEditor onMarkdownControllerChange={_ => updateMarkdownController(_)} markdown={markdownController.getMarkdown()} />}
        <IonButton onClick={create}>Save</IonButton>

        <FollowingUsers></FollowingUsers>
        {parentCommentId &&
          <CommentBrief commentId={parentCommentId}></CommentBrief>
        }
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <PopoverButton label='Select view' >
            <IonItem button onClick={(e) => onSetCommentView("CommentBrief")} detail={false}>Brief</IonItem>
            <IonItem button onClick={(e) => onSetCommentView("CommentStandard")} detail={false}>Standard</IonItem>
          </PopoverButton>

        </div>
        <CommentNavigator component={commentView} query={query} ref={commentNavigator}></CommentNavigator>
      </IonContent>
    </IonPage >
  );
};

export default HomeLayout;
