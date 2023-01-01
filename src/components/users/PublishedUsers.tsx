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

class PublishedUserProps {
}

class PublishedUserState {
  public users: UserProfile[] = []
}

export class PublishedUsers extends React.Component<PublishedUserProps, PublishedUserState> {
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
    let users = await userService.publishedUsers();
    this.setState({ users });
  }

  async toggleFollowUser(user: UserProfile) {
    if (userService.isFollowing(user)) {
      await userService.unFollowUser(user);
    } else {
      await userService.followUser(user);
    }

    await this.updateUserState();
  }

  onFollowUserUpdate(user: UserProfile) {
    if (user?.userId) {
      this.updateUserState();
    }
  }

  render() {
    return <Box>
      {(this.state?.users || []).map(u =>
        <Flex key={u.userId}>
          <UserProfileComponent user={u}></UserProfileComponent>
          <Menu>
            <MenuButton as={Button} rightIcon={<Icon as={MdArrowDropDown} />}>
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem onClick={(e) => { this.toggleFollowUser(u); }}>{userService.isFollowing(u) ? 'Unfollow' : 'Follow'}</MenuItem>
            </MenuList>
          </Menu>


        </Flex>
      )}
    </Box>
  }
} 
