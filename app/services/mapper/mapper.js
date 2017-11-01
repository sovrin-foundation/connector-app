// @flow
import { bubbleSize } from '../../common/styles'
import type { Connection, ClaimOfferPayloadMapper } from './type-mapper'
import type { ClaimOfferPayload } from '../../claim-offer/type-claim-offer'

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  name,
  ...otherArgs
}: Connection) => ({
  logoUrl,
  size,
  name: name ? name.split(' ')[0] : 'evernym',
  ...otherArgs,
})

export const claimOfferPayloadMapper = (
  payload: ClaimOfferPayloadMapper,
  statusMsg: string
): ClaimOfferPayload => ({
  claimOffer: JSON.parse(payload.claimOffer),
  issuer: JSON.parse(payload.issuer),
  statusMsg,
})
