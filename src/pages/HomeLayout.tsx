import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useReducer, useState } from 'react';
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
import { menuController, popoverController } from '@ionic/core';
import { CommentBrief } from '../components/comments/CommentBrief';
import { CommentEditor } from '../components/comments/CommentEditor';
import { arrowForwardCircle, saveOutline, sendOutline } from 'ionicons/icons';
import { FloatingActionButtons } from '../components/shared/FloatingActionButtons';
import { serviceBus } from '../services/bus/ServiceBus';
import { BeginNewCommentEvent } from '../services/bus/BeginNewCommentEvent';
import { IServiceBusEvent } from '../services/bus/IServiceBusEvent';
import { RequestAddCommentEvent } from '../services/bus/RequestAddCommentEvent';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../components/test/SortableItem';
import { selectionService } from '../services/dnd/SelectionService';

const HomeLayout: React.FC = () => {
  const [items, setItems] = useState([1, 2, 3]);

  let commentNavigator = React.createRef<CommentNavigator>();
  const params = useParams<{ commentId: string; }>();
  const parentCommentId = params.commentId || "";
  const baseQuery = () => new CommentQuery(userService).mine().following().parentOrTopLevel(parentCommentId);
  let [query, setQuery] = useState(baseQuery());
  let [profile, setProfile] = useState<UserProfile | null>(null);
  let [commentView, setCommentView] = useState("CommentBrief");
  let [showSave, setShowSave] = useState(false);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  //userService.readCurrentUserProfile().then(u => profile == null && setProfile(u));
  //console.log(parentCommentId);

  let markdownControllerSubscription: Subscription | null = null;
  let unFollowingSubscription: Subscription;
  let followingSubscription: Subscription;
  let serviceBusSubscription: Subscription;

  let [markdownController, setMarkdownController] = useState(new MarkdownController());

  let onFollowUserUpdate = (user: UserProfile) => {
    if (user?.userId) {
      setQuery(baseQuery());
    }
  }

  let create = async () => {
    //let streamId = await portal.create(markdown, 'text/markdown', _parentStreamId);
    let comment = await commentService.create<string>(markdownController.getMarkdown(), Mimetypes.MARKDOWN, parentCommentId);
    //console.log(comment);
    markdownController.setMarkdown('');

    // a few ways to do this:
    // 1) pass in the comments.  but, we want commentNavigator to take care of its own comments
    // 2) force some opts to update to re-render the navigator
    // 3) get a ref to commentNavigator and call it manually.
    // 4) convert this to a class component from a function component, and then call this.forceUpdate()
    commentNavigator.current?.loadComments();

  }

  let onAddNewComment = (serviceBusEvent: IServiceBusEvent) => {
    if (serviceBusEvent instanceof RequestAddCommentEvent) {
      let e = serviceBusEvent as RequestAddCommentEvent;
      if (e.id == parentCommentId) {
        create();
      }
    }
  }

  useEffect(() => {
    //console.log("useEffect.parentId", query.parentId, parentCommentId);
    // BUG: ?  This conditional is not needed for the first few navigations, but then it appears
    // that useState(baseQuery()) above is not using the baseQuery(), but re-using a previous
    // state from another parent.  So, we have to check here and force it if it is different.
    // Will this affect things when more complicated CommentQueries come along?
    if (query.parentId != parentCommentId) {
      setQuery(baseQuery());
    }
    userService.readCurrentUserProfile().then(p => {
      if (p && !p.isEqual(profile as any)) {
        setProfile(p);
      }
    });
    followingSubscription = userService.onFollowing(onFollowUserUpdate.bind(this));
    unFollowingSubscription = userService.onUnFollowing(onFollowUserUpdate.bind(this));
    serviceBusSubscription = serviceBus.subscribe(onAddNewComment.bind(this));

    return () => { // onDestroy
      markdownControllerSubscription?.unsubscribe();
      unFollowingSubscription?.unsubscribe();
      followingSubscription?.unsubscribe();
      serviceBusSubscription?.unsubscribe();
    }
  })


  let updateMarkdownController = (markdownController: MarkdownController) => {
    setMarkdownController(markdownController);
    if (markdownControllerSubscription) markdownControllerSubscription.unsubscribe();
    markdownControllerSubscription = markdownController.$input()
      .pipe(
        //debounceTime(10), // covers up a bug where this is being called twice in a row some how
        // tap(markdown => {
        //   console.log("**", markdown)
        // })
      )
      .subscribe((markdown: string) => {
        let active = !!markdown;
        serviceBus.emit(new BeginNewCommentEvent(parentCommentId, active));
        //console.log("updated markdown:", markdown)
      });
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
            <IonMenuButton menu="start" />
          </IonButtons>
          <IonButtons slot="end">
            <IonMenuButton menu="end" />
          </IonButtons>
          <IonTitle>{parentCommentId}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* IonContent breaks auto scrolling when dragging and dropping */}
      <div style={{ overflowY: 'auto', overflowX: 'auto' }}>
        <div style={{ marginTop: "10px" }}></div>


        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{parentCommentId}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {parentCommentId &&

          <div>
            <IonItem lines="none">
              <LazyAvatar userId={profile?.userId as any}>

              </LazyAvatar>
              <IonLabel>
                Todo create lazy UserProfile component
              </IonLabel>
            </IonItem>
            <div style={{ padding: '20px' }}>
              <CommentEditor commentId={parentCommentId}></CommentEditor>
            </div>
          </div>
        }
        {parentCommentId && <IonList>
          <IonItem >
            <IonLabel>
              <h1>Comments</h1>
            </IonLabel>
          </IonItem>
        </IonList>
        }

        {/* I would love to put MarkdownEditor in an IonLabel.  It works perfectly - except the dropdown menu gets clipped */}
        <div className="ion-item-fallback" >
          <IonItem lines="none">
            <LazyAvatar userId={profile?.userId as any}>

            </LazyAvatar>

          </IonItem>
          <div style={{ paddingTop: '10px' }}>
            <MarkdownEditor onMarkdownControllerChange={_ => updateMarkdownController(_)} markdown={markdownController.getMarkdown()} />

          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <PopoverButton label='Select view' >
            <IonItem button onClick={(e) => onSetCommentView("CommentBrief")} detail={false}>Brief</IonItem>
            <IonItem button onClick={(e) => onSetCommentView("CommentStandard")} detail={false}>Standard</IonItem>
          </PopoverButton>

        </div>

        {/* Comment navigators that only exist on the main page could be duplicated because when ionic navigates it layers on this component so that there are multiple instances of it.  So, we need to distinguish the id by using the parentId.  This shouldn't be necessary in most other places that use CommentNavigator*/}
        <CommentNavigator id={'main' + selectionService.separator + parentCommentId} component={commentView} query={query} ref={commentNavigator}></CommentNavigator>

        <FloatingActionButtons addId={parentCommentId} saveId={parentCommentId}></FloatingActionButtons>
      </div>
    </IonPage >
  );
};

export default HomeLayout;
