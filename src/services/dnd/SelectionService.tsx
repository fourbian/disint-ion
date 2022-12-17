/*
               <pre>
TODO: 
* https://github.com/atlassian/react-beautiful-dnd/issues/2300 set side menus to invisible to get beautiful dnd to recognize them?
* restore ION stuff and see if dndkit works better than beautiful dnd did
* fix z-index on drag and drop (devtools mobile, maybe non-devtools)
* opening menus when close to sides in mobile mode
* opening or toggling accordians while dragging
* Dropping, copying, moving
* Dragging multiple
* Keyboard navigation and selecting multiple
       </pre>*/

import './SelectionService.css'
import { isMobile } from 'react-device-detect';
import { alertController, menuController } from "@ionic/core";
import { CancelDrop, closestCenter, CollisionDetection, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent, DroppableContainer, getFirstCollision, Modifiers, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { CancelDropArguments } from "@dnd-kit/core/dist/components/DndContext/DndContext";
import { serviceBus } from '../bus/ServiceBus';
import { BeginDndEvent } from '../bus/BeginDndEvent';

export interface DraggableItem {
    id: string;
}

export class ContainerContext {
    domId: string;
    items: DraggableItem[] = [];
    containerItemId: string;
    //containerItem: DraggableItem;
    doesAllowOrdering: boolean;
    onDrop: (sourceItem: DraggableItem, targetItem: DraggableItem, index?: number, isCopyOperation?: boolean) => boolean;
    onRemove: (item: DraggableItem) => boolean;
    doesUserOwn: (item: DraggableItem) => boolean;
}

export class SelectionService {
    lastDroppableContainerId: string = "";
    lastDroppableItemId: string = "";
    separator = "_-_";
    isDragging: boolean;
    activeContainerId: string;
    activeItemId: string;
    activeDomId: string;
    leftMenuOpen: boolean;
    rightMenuOpen: boolean;
    TRASH_ID = 'void';
    PLACEHOLDER_ID = 'placeholder';
    lastOverId: string;
    recentlyMovedToNewContainer = false;
    modifiers?: Modifiers;
    containers = new Map<string, ContainerContext>();
    dndOverItemClass = "dnd-over-item";
    dndOverContainerClass = "dnd-over-container";

    constructor() {
        window.addEventListener('mousemove', this.dragMoved.bind(this));
        window.addEventListener('touchmove', this.dragMoved.bind(this));
    }

    registerContainer(containerContext: ContainerContext) {
        this.containers.set(containerContext.domId, containerContext);
    }

    unregisterContainer(id: string) {
        this.containers.delete(id);
    }

    getActiveId() {
        console.log("activeId:", this.activeDomId);
        return this.activeDomId;
    }

    clearClass(id: string, className: string) {
        if (!id) return;
        const node = document.querySelector(`#${id}`);
        if (node) {
            node.classList.remove(className);
        }
    }

    setClass(id: string, className: string) {
        if (!id) return;
        const node = document.querySelector(`#${id}`);
        if (node) {
            node.classList.add(className);
        }
    }

    setDroppableContainerStyling(id: string) {
        if (this.lastDroppableContainerId == id) return;
        this.clearClass(this.lastDroppableContainerId, "dnd-drop-target-container");
        this.lastDroppableContainerId = id;
        this.setClass(id, "dnd-drop-target-container");
    }

    setDroppableItemStyling(id: string) {
        if (this.lastDroppableItemId == id) return;
        this.clearClass(this.lastDroppableItemId, "dnd-drop-target-item");
        this.lastDroppableItemId = id;
        this.setClass(id, "dnd-drop-target-item");
    }

    onDragStart(event: DragStartEvent): void {
        let active = event.active
        this.activeDomId = active.id.toString();
        this.activeItemId = active.data?.current?.itemId;
        this.activeContainerId = active.data.current?.containerId;
        console.log("onDragStart", event, this.activeDomId);

        // show trash in case user wants to cancel dnd
        serviceBus.emit(new BeginDndEvent("", true));
    }

    onDragMove(event: DragMoveEvent): void {

    }

    onDragOver(event: DragOverEvent): void {
    }

    collisionDetectionStrategy: CollisionDetection = (args) => {

        let ids = closestCenter({
            ...args
        });

        const over = ids[0]?.data?.droppableContainer?.data?.current;
        const hasIndex = over.index == 0 || !!over.index;
        const overContainerId = over.containerId;
        const overContainer = this.containers.get(overContainerId);
        const useOver = overContainer?.doesAllowOrdering || !hasIndex;
        const overId = useOver ? ids[0]?.id : overContainerId;
        const className = useOver ? this.dndOverItemClass : this.dndOverContainerClass;
        //console.log(overId, className);
        if (overId) {
            if (this.lastOverId) {
                const el = document.querySelector(`#${this.lastOverId}`);
                el?.classList.remove(this.dndOverItemClass);
                el?.classList.remove(this.dndOverContainerClass);
            }
            const el = document.querySelector(`#${overId}`);
            el?.classList.add(className);
            this.lastOverId = overId.toString();
        }

        //console.log(overId[0]);

        // this.i+=1;
        //console.log(ids);
        // console.log(this.i);
        return ids;

    }

    // TODO: Combine with collision detection strategy?
    public dragMoved(event: any) {
        if (!this.isDragging) return;

        let { x, y } = this.getCoordinates(event);

        let el = document.elementFromPoint(x, y);

        //console.log(event.pointerPosition.x, event.pointerPosition.y, window.screen.width);

        // react beautiful dnd takes care of this for us.  if that goes away, uncomment the line below.
        //this.scrollParent(el, x, y);

        console.log(x, y);
        if (el?.nodeName == "ION-MENU") {
            if (isMobile) {
                this.openMenu(false, 'start');
                this.openMenu(false, 'end');
            }
        } else if (x < 30) {
            this.openMenu(true, 'start');
        } else if (x > (window.screen.width - 30)) {
            this.openMenu(true, 'end');
        }
    }


    async onDragEnd(event: DragEndEvent) {
        // show trash in case user wants to cancel dnd
        console.log("onDragEnd", event);

        this.onDragCancel(event);

        const data = event.over?.data?.current;
        if (!data) {
            console.error("Drag and drop event.over.data.current is empty:", event);
            return;
        }

        if (this.lastOverId != 'trash') {
            const targetContainerId = data.containerId;
            const sourceContainerId = this.activeContainerId;
            const itemId = data.itemId;
            const index = data.index;
            const hasIndex = index == 0 || index;
            const targetContainer = this.containers.get(targetContainerId);
            const sourceContainer = this.containers.get(this.activeContainerId);
            const targetItem: DraggableItem | null | undefined = itemId ? targetContainer?.items.filter(i => i.id == itemId)[0] : null;
            const sourceItem = sourceContainer?.items.filter(i => i.id == this.activeItemId)[0];
            const doesUserOwnSourceItem = sourceContainer?.doesUserOwn(sourceItem as DraggableItem);
            const doesUserOwnTargetItem = targetContainer?.doesUserOwn(targetItem as DraggableItem);
            const sourceContainerItemId = sourceContainer?.containerItemId;
            const targetContainerItemId = targetContainer?.containerItemId;
            const isTopLevelToTopLevelAction = !sourceContainerItemId && !targetContainerItemId && hasIndex;

            const sameContainer = targetContainerId == sourceContainerId;
            //const sameContainerItem = sourceContainerItemId == targetContainerItemId;
            const sameSourceAndTarget =
                (!hasIndex && sourceItem?.id && sourceItem?.id == targetContainerItemId)
                ||
                (targetItem?.id && sourceItem?.id && sourceItem?.id == targetItem?.id);
            const isReorder = !!hasIndex;
            const isNewTarget = !sameSourceAndTarget;
            const canProceed = isNewTarget || isReorder;

            if (canProceed) {
                const buttons = [];

                // MOVE: user must be able to remove the link from the source item and add a link to the target item
                if (doesUserOwnSourceItem && doesUserOwnTargetItem && !isTopLevelToTopLevelAction) {
                    buttons.push({
                        text: 'Move',
                        role: 'move',
                        handler: () => {
                            targetContainer?.onDrop(sourceItem as DraggableItem, targetItem as DraggableItem, index, /*isCopy=*/false);
                            sourceContainer?.onRemove(sourceItem as DraggableItem);
                        },
                    });
                }

                // COPY: user does not need to own source or dest
                buttons.push({
                    text: 'Copy',
                    role: 'copy',
                    handler: () => {
                        targetContainer?.onDrop(sourceItem as DraggableItem, targetItem as DraggableItem, index, /*isCopy=*/true);
                    },
                });

                // LINK: user must own source or dest
                if ((doesUserOwnSourceItem || doesUserOwnTargetItem) && !sameSourceAndTarget && !isTopLevelToTopLevelAction) {
                    buttons.push({
                        text: 'Link',
                        role: 'link',
                        handler: () => {
                            targetContainer?.onDrop(sourceItem as DraggableItem, targetItem as DraggableItem, index, /*isCopy=*/false);
                        },
                    });
                }

                const isSameContainerReorder = sameContainer && isReorder;
                if (isSameContainerReorder) {
                    targetContainer?.onDrop(sourceItem as DraggableItem, targetItem as DraggableItem, index, /*isCopy=*/false);
                } else {
                    // ORDER: Must own source or dest to order.  How to do top level ordering?  non-top level ordering?
                    const alert = await alertController.create({
                        header: 'Select an action',
                        buttons
                    });

                    alert.present();
                }

            } else {
                console.warn("Ignoring dnd because items are dropped onto itself or within the same container where ordering is not specified")
            }

        }

    }

    onDragCancel(event: any): void {
        console.log("cancelDrop", event);
        serviceBus.emit(new BeginDndEvent("", false));
        if (this.lastOverId) {
            // clear active dnd styling
            const el = document.querySelector(`#${this.lastOverId}`);
            el?.classList.remove(this.dndOverContainerClass);
            el?.classList.remove(this.dndOverItemClass);
        }

        if (this.lastOverId != 'trash') {
            // if dropping on a valid item, then hide the drag overlay because it's default is to
            // animate back to where it came from.  the only other way to prevent this animation
            // is to complicate id logic (updating domIds), which is not necessary right now.
            // https://github.com/clauderic/dnd-kit/issues/456#issuecomment-922975042
            const overlayEl = document.querySelector(`.dnd-overlay`);
            overlayEl?.classList.add("dnd-hidden");


        }

    }

    getCoordinates(e: any): { x: any, y: any } {
        let x, y;
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
            x = e.clientX;
            y = e.clientY;
        }
        return { x, y };
    }


    scrollParent(element: any, x: any, y: any) {
        let container = this.getScrollParent(element);
        if (container) {
            const targetRect = container.getBoundingClientRect();
            const oneFifth = targetRect.height / 5;

            if (y - targetRect.top < oneFifth) {
                container.scrollTop -= 10;
                //console.log('scroll up');
            } else if (y - targetRect.top > 4 * oneFifth) {
                container.scrollTop += 10;
                //console.log('scroll down');
            }

        }
    }

    getScrollParent(element: any) {
        let ionContent = element?.closest('ion-content');
        let mainEl = ionContent?.shadowRoot?.querySelector('.inner-scroll');
        //console.log(mainEl);
        return mainEl;
    }

    /* these functions are crutches because menuController doesn't seem to work in react? */
    menuController_isOpen(side: string) {
        let ionMenuEl = document.querySelector(`ion-menu[side='${side}']`) as any;
        return ionMenuEl.style.display && ionMenuEl.style.display != 'none';
    }

    menuController_open(side: string) {
        if (!this.menuController_isOpen(side)) {
            let b = document.querySelector(`ion-menu-button[menu='${side}']`);
            (b as any)?.click();
        }
    }

    menuController_close(side: string) {
        if (this.menuController_isOpen(side)) {
            let b = document.querySelector(`ion-menu-button[menu='${side}']`);
            (b as any)?.click();
        }
    }

    openMenu(open: boolean, side: string) {
        console.log("open left menu", open);
        if (open) {
            this.menuController_open(side);
        } else {
            this.menuController_close(side);
        }
    }

    async openLeftMenu(open: boolean) {
        console.log("open left menu", open);
        if (open) {
            this.menuController_open('start');
        } else {
            this.menuController_close('start');
        }
        setTimeout(async () => this.leftMenuOpen = this.menuController_isOpen('start'), 1000);
    }

    async toggleLeftMenu() {
        menuController.toggle('start');
        setTimeout(async () => this.leftMenuOpen = await menuController.isOpen('start'), 1000);
    }

    async openRightMenu(open: boolean) {
        let isDesktop = !isMobile;
        let mobileAction = open ? () => menuController.open('end') : () => menuController.close('end');
        let action = isDesktop ? () => menuController.enable(open, 'end') : mobileAction;
        let enabled = await menuController.isEnabled('end');

        if (!isDesktop && !enabled) {
            menuController.enable(true, 'end'); // user switched from desktop to mobile
        }

        this.rightMenuOpen = open;

        action();
    }

    async toggleRightMenu() {
        let isDesktop = !isMobile;

        let enabled = await menuController.isEnabled('end');
        let open = isDesktop ? enabled : await menuController.isOpen('end');

        this.openRightMenu(!open);

        //console.log('enabled', await this.menuController.isEnabled('end'));
        //console.log('open', await this.menuController.isOpen('end'));
    }


}

export const selectionService = new SelectionService();