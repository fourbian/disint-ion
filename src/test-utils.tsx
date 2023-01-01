import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider, theme } from '@chakra-ui/react';

const AllProviders = ({ children }: any) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

const customRender = (ui: any, options: any) =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
