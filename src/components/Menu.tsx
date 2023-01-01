

import { useLocation } from 'react-router-dom';
import './Menu.css';
import config from '../config.json'
import { useState } from 'react';
import { CommentNavigator } from './comments/CommentNavigator';
import { CommentQuery } from '../models/CommentQuery';
import React from 'react';
import { userService } from '../services/users/UserService';
import { Accordion, AccordionItem, Box, Flex, Heading, Text } from '@chakra-ui/react';


const Menu: React.FC = () => {
  const location = useLocation();
  const [loginName, setLoginName] = useState("");
  const [loginAddress, setLoginAddress] = useState("");
  //let portal = CeramicPortal.getInstance(config.ceramicEndpoints);
  let query = new CommentQuery(userService).parentOrTopLevel("");
  let commentNavigator = React.createRef<CommentNavigator>();


  let connectWallet = async () => {
    //await portal.authenticate();
    //await portal.updateProfile("test name", 'https://avatars.githubusercontent.com/u/1857282?s=64&v=4');
    //let data = (await portal.readProfile()) as any;

    //setLoginName(data.name);
    //setLoginAddress(portal.firstLoginAddress());

  }

  // TODO: resizable: https://codepen.io/liamdebeasi/pen/KKdodjd
  /*menu type of overlay breaks react beautiful dnd... of course.  If the side bar is over the main content, dnd lib doesn't know which one to drag over */
  return (
    <>
      <Box>

        <Accordion allowMultiple>
          <AccordionItem>
            <Flex slot="header" color="light">
              <Text>Table of Contents</Text>
            </Flex>
            <div className="ion-padding" slot="content">
              <CommentNavigator id={'left_navigator'} component="CommentBrief" query={query} ref={commentNavigator}></CommentNavigator>

            </div>
          </AccordionItem>
          <AccordionItem >
            <Flex slot="header" color="light">
              <Text>Saved Items</Text>
            </Flex>
            <div className="ion-padding" slot="content">
              Saved Items
            </div>
          </AccordionItem>
        </Accordion>
        {/*<Box id="labels-list">
          <BoxHeader>Labels</BoxHeader>
          {labels.map((label, index) => (
            <Flex lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <Text>{label}</Text>
            </Flex>
          ))}
          </Box>*/}
      </Box>
    </>
  );
};

export default Menu;
