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
import { menuController } from "@ionic/core";
import { CancelDrop, closestCenter, CollisionDetection, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent, DroppableContainer, getFirstCollision, Modifiers, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { CancelDropArguments } from "@dnd-kit/core/dist/components/DndContext/DndContext";

export interface DraggableItem {
    id: string;
}

export class ContainerContext {
    id: string;
    items: DraggableItem[] = [];
    onNewItems: (items: DraggableItem[]) => boolean;
}

export class SelectionService {
    innerClone: any;
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

    constructor() {
        window.addEventListener('mousemove', this.dragMoved.bind(this));
        window.addEventListener('touchmove', this.dragMoved.bind(this));
    }

    registerContainer(id: string, items: DraggableItem[], onNewItems: (items: DraggableItem[]) => boolean) {
        const container = new ContainerContext();
        container.id = id;
        container.items = items;
        container.onNewItems = onNewItems;

        this.containers.set(id, container);
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
    }

    onDragMove(event: DragMoveEvent): void {
        //console.log("onDragMove", event);

    }

    onDragOver(event: DragOverEvent): void {
        const over = event.over;
        const active = event.active;
        const overContainerId = event.over?.data?.current?.containerId;
        const activeContainerId = event.active?.data?.current?.containerId;
        const overDomId = event.over?.id?.toString();
        const activeDomId = event.active?.id?.toString();
        //const activeData = event.active.data.current

        if (overContainerId == null) {
            return;
        }

        console.log("onDragOver", activeContainerId, activeDomId, overContainerId, overDomId);

        const overContainer = this.containers.get(overContainerId);
        const activeContainer = this.containers.get(activeContainerId);

        if (!overContainer || !activeContainer) {
            return;
        }

        console.log("detected")
        if (activeContainerId !== overContainerId) {
            const overDomIds = event.over?.data?.current?.sortable?.items || [];
            const activeDomIds = event.active?.data?.current?.sortable?.items || [];
            const overIndex = overDomIds.indexOf(overDomId);
            const activeIndex = activeDomIds.indexOf(activeDomId);

            let newIndex: number;

            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            newIndex =
                overIndex >= 0 ? overIndex + modifier : overDomIds.length + 1;

            //recentlyMovedToNewContainer.current = true;

            console.log("active item id", this.activeItemId, "active dom id", this.activeDomId);
            console.log("moving from", activeContainer.id, activeIndex, " to ", overContainer.id, overIndex);
            console.log("moving from", activeContainer.id, activeDomId, " to ", overContainer.id, overDomId);

            if (activeIndex > -1) {
                const overItems = overContainer.items.slice();
                const activeItems = activeContainer.items.slice();
                    // add active item to over container
                overItems.splice(overItems.length - 1, 0, activeItems[activeIndex])
                if (overContainer.onNewItems(overItems)) {
                    (activeItems[activeIndex] as any)._dragDomId = activeDomId
                    console.log("new overContainer list", overItems);
                    overContainer.items = overItems; // callee approves update
                }

                // remove active item from active container
                activeItems.splice(activeIndex, 1);
                if (activeContainer.onNewItems(activeItems)) {
                    console.log("new activeContainer list", overItems);
                    activeContainer.items = activeItems; // callee approves update
                }

            }
        }

    }

    onDragEnd(event: DragEndEvent): void {
        console.log("onDragEnd", event);
        this.activeDomId = "";
        /*
        if (active.id in this.items && over?.id) {
            const activeIndex = this.containers.indexOf(active.id);
            const overIndex = this.containers.indexOf(over.id);
            this.containers = arrayMove(this.containers, activeIndex, overIndex);
        }

        const activeContainer = this.findContainer(active.id);

        if (!activeContainer) {
            this.activeId = "";
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            this.activeId = "";
            return;
        }

        if (overId === this.TRASH_ID) {
            this.items = {
                ...this.items,
                [activeContainer]: this.items[activeContainer].filter(
                    (id) => id !== this.activeId
                ),
            };
            this.activeId = "";
            return;
        }

        if (overId === this.PLACEHOLDER_ID) {
            const newContainerId = this.getNextContainerId();

            this.containers = [...this.containers, newContainerId];
            this.items = {
                ...this.items,
                [activeContainer]: this.items[activeContainer].filter(
                    (id) => id !== this.activeId
                ),
                [newContainerId]: [active.id],
            };
            this.activeId = "";
            return;
        }

        const overContainer = this.findContainer(overId);

        if (overContainer) {
            const activeIndex = this.items[activeContainer].indexOf(active.id);
            const overIndex = this.items[overContainer].indexOf(overId);

            if (activeIndex !== overIndex) {
                this.items = {
                    ...this.items,
                    [overContainer]: arrayMove(
                        this.items[overContainer],
                        activeIndex,
                        overIndex
                    ),
                };
            }
        }

        this.activeId = "";
        */
    }

    onDragCancel(): void {
        this.activeDomId = "";
    }

    cancelDrop: CancelDrop = (args: CancelDropArguments): boolean | Promise<boolean> => {
        console.log("cancelDrop", args);
        return false;
        //throw new Error("Not sure what to do here?  Always return false?");
    }


    /*
        onBeforeCapture(before: BeforeCapture) {
            //this.openMenu(true, 'start');
            //console.log("onBeforeCapture", before);
        }
    
        onBeforeDragStart(initial: DragStart) {
            //console.log("onBeforeDragStart", initial);
        }
    
        onDragStart(initial: DragStart, provided: ResponderProvided) {
            //console.log("onDragStart", initial, provided);
            this.isDragging = true;
        }
    
        onDragUpdate(initial: DragUpdate, provided: ResponderProvided) {
            //console.log("onDragUpdate", initial, provided);
            const droppableContainerId = initial.destination?.droppableId || "";
            this.setDroppableContainerStyling(droppableContainerId);
            const droppableItemId = initial.combine?.draggableId || "";
            this.setDroppableItemStyling(droppableItemId);
        }
    
        onDragEnd(result: DropResult, provided: ResponderProvided) {
            this.innerClone = null;
            this.isDragging = false;
            this.setDroppableContainerStyling("");
            this.setDroppableItemStyling("");
            //console.log("onDragEnd", result, provided);
        };
    */

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



    //   Custom collision detection strategy optimized for multiple containers

    //   - First, find any droppable containers intersecting with the pointer.
    //   - If there are none, find intersecting containers with the active draggable.
    //   - If there are no intersecting containers, return the last matched intersection


    // TODO: memoize bsed on activeId and items
    /*collisionDetectionStrategy: CollisionDetection = (args) => {
        if (this.activeId && this.activeId in this.items) {
            return closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                    (container: DroppableContainer) => container.id in this.items
                ),
            });
        }

        // Start by finding any intersecting droppable
        const pointerIntersections = pointerWithin(args);
        const intersections =
            pointerIntersections.length > 0
                ? // If there are droppables intersecting with the pointer, return those
                pointerIntersections
                : rectIntersection(args);
        let overId = getFirstCollision(intersections, 'id');

        if (overId != null) {
            if (overId === this.TRASH_ID) {
                // If the intersecting droppable is the trash, return early
                // Remove this if you're not using trashable functionality in your app
                return intersections;
            }

            if (overId in this.items) {
                const containerItems = this.items[overId];

                // If a container is matched and it contains items (columns 'A', 'B', 'C')
                if (containerItems.length > 0) {
                    // Return the closest droppable within that container
                    overId = closestCenter({
                        ...args,
                        droppableContainers: args.droppableContainers.filter(
                            (container) =>
                                container.id !== overId &&
                                containerItems.includes(container.id)
                        ),
                    })[0]?.id;
                }
            }

            this.lastOverId = overId;

            return [{ id: overId }];
        }

        // When a draggable item moves to a new container, the layout may shift
        // and the `overId` may become `null`. We manually set the cached `lastOverId`
        // to the id of the draggable item that was moved to the new container, otherwise
        // the previous `overId` will be returned which can cause items to incorrectly shift positions
        if (this.recentlyMovedToNewContainer) {
            this.lastOverId = this.activeId;
        }

        // If no droppable is matched, return the last match
        return this.lastOverId ? [{ id: this.lastOverId }] : [];
    }


    register(id: string, items: Items, containers: string[], callback: ContextCallback) {

        this.contexts.set(id, {
            id,
            items,
            containers,
            callback
        });

        // remove old containers
        this.containers = this.containers.filter(c => !c.toString().startsWith(id));

        // remove old items
        
        items = {
            ...this.items,
            [activeContainer]: this.items[activeContainer].filter(
                (id) => id !== this.activeId
            ),
        };
        
        // remove all items and containers that start with id

        // add new items

        // add new containers


        throw new Error('Method not implemented.');
    }

    getIndex(id: string) {
        const container = this.findContainer(id);

        if (!container) {
            return -1;
        }

        const index = this.items[container].indexOf(id);

        return index;
    };



    getUpdatedItems(activeContainer: string, overContainer: string, event: DragOverEvent): Items {
        const over = event.over;
        const overId = event.over?.id || "";
        const active = event.active;

        const activeItems = this.items[activeContainer];
        const overItems = this.items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex: number;

        if (overId in this.items) {
            newIndex = overItems.length + 1;
        } else {
            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        this.recentlyMovedToNewContainer = true;

        return {
            ...this.items,
            [activeContainer]: this.items[activeContainer].filter(
                (item) => item !== active.id
            ),
            [overContainer]: [
                ...this.items[overContainer].slice(0, newIndex),
                this.items[activeContainer][activeIndex],
                ...this.items[overContainer].slice(
                    newIndex,
                    this.items[overContainer].length
                ),
            ],
        };
    }



    findContainer(id: string) {
        if (id in this.items) {
            return id;
        }

        // TODO: OPTIMIZE: can we make any assumptions here rather than searching all properties?
        return Object.keys(this.items).find((key) => this.items[key].includes(id));
    };


    getNextContainerId() {
        // TODO: can we eliminate containerIds if we're just going to get containerIds from this.items?
        const containerIds = Object.keys(this.items);
        const lastContainerId = containerIds[containerIds.length - 1];

        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
    }
    */

}

export const selectionService = new SelectionService();