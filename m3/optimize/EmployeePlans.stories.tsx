/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';

import { EmployeesView } from './EmployeesView';

import { lessons } from 'stories';
export default {
  title: lessons.m3.add('HOMEWORK').toString(),
} as Meta;

export const _EmployeePlans = () => {
  return <EmployeesView />;
}
