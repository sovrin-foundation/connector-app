import React from 'react'
import { View } from 'react-native'
import { Container } from '../components/layout'

const Divider = ({ left, right }) => (
  <Container row pad tertiary>
    {left && <Container left>{left}</Container>}
    {right && <Container right>{right}</Container>}
  </Container>
)

export default Divider
