import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from './UserProfileComponent';
import { Subscription } from 'rxjs';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";

class FollowingUsersProps {
}

class FollowingUsersState {
  public users: UserProfile[] = []
}

export class FollowingUsers extends React.Component<FollowingUsersProps, FollowingUsersState> {
  unFollowingSubscription: Subscription;
  followingSubscription: Subscription;

  async componentDidMount() {
    await this.updateUserState();
    this.followingSubscription = userService.onFollowing(this.onFollowUserUpdate.bind(this));
    this.unFollowingSubscription = userService.onUnFollowing(this.onFollowUserUpdate.bind(this));
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.unFollowingSubscription.unsubscribe();
    this.followingSubscription.unsubscribe();
  }

  async updateUserState() {
    let users = await userService.followingUsers();
    this.setState({ users });
  }

  onFollowUserUpdate(user: UserProfile) {
    if (user?.userId) {
      this.updateUserState();
    }
  }

  unFollowUser(user: UserProfile) {
    userService.unFollowUser(user);
  }

  render() {
    return <Box>
      {
        this.state?.users.map(u =>
          <Flex key={u.userId}>
            <UserProfileComponent user={u}></UserProfileComponent>
            <Menu>
              <MenuButton as={Button} rightIcon={<Icon as={MdArrowDropDown} />}>
                Menu
              </MenuButton>
              <MenuList>
                <MenuItem onClick={(e) => { this.unFollowUser(u) }}>Unfollow</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )
      }
    </Box>
  }
} 
