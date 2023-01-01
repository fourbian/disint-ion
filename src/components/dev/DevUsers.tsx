

import Joi from "joi";
import React, { useEffect, useState } from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { DevUserForm } from './DevUserForm';
import { UserProfile, userProfileSchema } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';
import { join } from 'path';
import { LocalStorageUserService } from '../../services/users/LocalStorageUserService';
import { FormState } from '../../models/FormState';
import { Box, Button, Icon, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";

export class DevUsersState {
  modalUserProfile: UserProfile = new UserProfile();
  users: UserProfile[] = [];
  modalTitle: string = "";
  modalHasErrors: boolean = false;
}

export class DevUsersProps {
}

export const DevUsers: React.FC<DevUsersProps> = (props) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [state, setState] = useState<DevUsersState>(new DevUsersState());

  function setStateHelper(obj: any) {
    setState(Object.assign({}, state, obj));
  }

  function updateUserState() {
    userService.publishedUsers().then(users => {
      state.users = users;
      setState(state);
    });
  }

  useEffect(() => {
    updateUserState();
  }, []);
  updateUserState();

  async function onModalCancelUser(): Promise<boolean> {
    return true;
  }

  async function onModalConfirmUser(): Promise<boolean> {
    if (state.modalHasErrors) {
      alert("please fix errors");
      return false;
    } else {
      let currentUserProfile = (userService as LocalStorageUserService).getLoggedInUser();
      await (userService as LocalStorageUserService).setUserProfileDevOnly(state.modalUserProfile); // memory only
      await userService.updateProfile(state.modalUserProfile); // commit to storage
      // reset to logged in user
      await (userService as LocalStorageUserService).setUserProfileDevOnly(currentUserProfile);
      updateUserState();
      return true;
    }
  }

  function onEditUserModal(userProfile: UserProfile) {
    setStateHelper({
      modalUserProfile: userProfile,
      modalTitle: "Edit " + userProfile.username
    });
    onOpen();

  }

  function onNewUserModal() {
    setStateHelper({
      modalUserProfile: new UserProfile(),
      modalTitle: "New user"
    });
    onOpen();
  }

  function onModalUserFormStateChange(devUserFormState: FormState<UserProfile>) {
    setStateHelper({
      modalUserProfile: devUserFormState.form,
      modalHasErrors: !!devUserFormState.errors?.size
    });
  }

  function login(user: UserProfile) {
    let localUserService = userService as LocalStorageUserService;
    localUserService.setUserProfileDevOnly(user);
    window.location.reload();
  }

  return <div>
    <Button onClick={() => onNewUserModal()}>
      New
    </Button>

    <Box>
      {(state?.users || []).map(u => {
        return (
          // detail='false' to remove the right arrow for iOS devices
          <Box key={u.userId}>
            <UserProfileComponent user={u} onClick={(e) => onEditUserModal(u)}></UserProfileComponent>
            <Menu>
              <MenuButton as={Button} rightIcon={<Icon as={MdArrowDropDown} />}>
                Menu
              </MenuButton>
              <MenuList>
                <MenuItem onClick={(e) => { login(u) }}>Login</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )
      })}
    </Box>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{state?.modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DevUserForm schema={userProfileSchema} onStateChange={state => onModalUserFormStateChange(state)} value={state?.modalUserProfile}></DevUserForm>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onModalConfirmUser()}>
            Confirm
          </Button>
          <Button variant='ghost' onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  </div>
} 
