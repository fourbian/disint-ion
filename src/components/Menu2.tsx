
import { useLocation } from 'react-router-dom';
import './Menu.css';
import config from '../config.json'
import { useState } from 'react';
import { DevUsers } from './dev/DevUsers';
import { FollowingUsers } from './users/FollowingUsers';
import { PublishedUsers } from './users/PublishedUsers';
import { CommentNavigator } from './comments/CommentNavigator';
import { CommentQuery } from '../models/CommentQuery';
import React from 'react';
import { Accordion, AccordionItem, Box, Flex, Text } from '@chakra-ui/react';


const Menu2: React.FC = () => {
  const location = useLocation();
  const [loginName, setLoginName] = useState("");
  const [loginAddress, setLoginAddress] = useState("");
  //let portal = CeramicPortal.getInstance(config.ceramicEndpoints);
  let query = new CommentQuery();
  let commentNavigator = React.createRef<CommentNavigator>();

  let connectWallet = async () => {
    //await portal.authenticate();
    //await portal.updateProfile("test name", 'https://avatars.githubusercontent.com/u/1857282?s=64&v=4');
    //let data = (await portal.readProfile()) as any;

    //setLoginName(data.name);
    //setLoginAddress(portal.firstLoginAddress());

  }

  return <Box>
      <Accordion allowMultiple>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Dev - Users</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            <DevUsers></DevUsers>
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Quick Search</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            <CommentNavigator id={'right_navigator'} component="CommentBrief" query={query} ref={commentNavigator}></CommentNavigator>
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Related Items</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            Saved Items
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Quality</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            Profile and Settings
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Following Users</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            <FollowingUsers></FollowingUsers>
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Published Users</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            <PublishedUsers></PublishedUsers>
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Published Comments</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            Profile and Settings
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Profile</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            Profile
          </div>
        </AccordionItem>
        <AccordionItem>
          <Flex slot="header" color="light">
            <Text>Settings</Text>
          </Flex>
          <div className="ion-padding" slot="content">
            Settings
          </div>
        </AccordionItem>

      </Accordion>

    </Box>
};

      export default Menu2;
