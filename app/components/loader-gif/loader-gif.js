// @flow

import React from 'react'
import { ActivityIndicator } from 'react-native'
import { color } from '../../common/styles'
import { Container } from '../layout'

export const LoaderGif = (
  <Container center>
    <ActivityIndicator size="large" color={color.bg.eighth.color} />
  </Container>
)
