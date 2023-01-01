import Joi from 'joi';
import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';
import { FormState } from '../../models/FormState';
import { Avatar, Box, Flex, Input, Stack, Text } from '@chakra-ui/react';

export class DevUserFormProps {
  public onStateChange: (devUserFormState: FormState<UserProfile>) => void;
  public value: UserProfile = new UserProfile();
  public schema: Joi.ObjectSchema<UserProfile>;
}

export class DevUserForm extends React.Component<DevUserFormProps, FormState<UserProfile>> {

  componentDidMount() {
    this.setStateHelper(FormState.from<UserProfile>(this.props.value, this.props.schema));
  }

  setStateHelper(state: FormState<UserProfile>) {
    let newFormState = new FormState<UserProfile>(state).validate(this.props.schema);
    this.setState(newFormState);
    this.props.onStateChange(newFormState);
  }

  onInput(e: React.FormEvent<HTMLInputElement>) {
    const el = e.target as HTMLInputElement;
    const newUserProfile = new UserProfile(this.state?.form);
    (newUserProfile as any)[el.name] = el.value;
    if (el.name == "username") {
      newUserProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(el.value)}`
    }
    this.setStateHelper(FormState.from<UserProfile>(newUserProfile, this.props.schema));
  }

  render() {

    let errorItem = null;
    let hasErrors = !!this.state?.errors?.size;
    let errors = this.state?.errors || new Map<string, string>();
    if (hasErrors) {
      errorItem = <Flex className={this.state?.errors?.size ? "ion-invalid" : ""}>
        <Text>{this.state?.validation?.message}</Text>
        <span slot="error">{this.state?.validation?.message}</span>
      </Flex>;
    }

    return (
      <Stack spacing={3}>
        {errorItem}

        <Input isInvalid={!!errors.get('userId')} type="text" placeholder="Id" name="userId" value={this.state?.form?.userId} onInput={e => this.onInput(e)} />
        <span slot="error">{errors.get('userId')}</span>


        <Input isInvalid={!!errors.get('username')} type="text" placeholder="Username" name="username" value={this.state?.form?.username} onInput={e => this.onInput(e)} />
        <span slot="error">{errors.get('username')}</span>

        <Input isInvalid={!!errors.get('avatar')} type="text" placeholder="Avatar" name="avatar" value={this.state?.form?.avatar} onInput={e => this.onInput(e)} />
        <span slot="error">{errors.get('avatar')}</span>

        <Avatar src={this.state?.form?.avatar}>
        </Avatar>
      </Stack>
    )
  }
} 
