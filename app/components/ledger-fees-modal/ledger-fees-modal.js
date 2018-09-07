// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-native-modal'
import { BigNumber } from 'bignumber.js'
import type { Store } from '../../store/type-store'
import {
  getLedgerFees,
  resetLedgerFees,
} from '../../store/ledger/type-ledger-store'
import type {
  GetLedgerFeesFn,
  LedgerFees,
  ResetLedgerFeesFn,
} from '../../store/ledger/type-ledger-store'
import { formatNumbers } from '../text'
import { STORE_STATUS } from '../../common/type-common'
import type { StoreStatus } from '../../common/type-common'
import {
  CustomView,
  Icon,
  CustomText,
  CustomButton,
  Container,
} from '../../components'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  OFFSET_7X,
  color,
  HAIRLINE_WIDTH,
  whiteSmoke,
} from '../../common/styles/constant'
import CustomActivityIndicator from '../../components/custom-activity-indicator/custom-activity-indicator'

export type LedgerFeesModalProps = {
  transferAmount?: string,
  onYes: () => void,
  onNo: () => void,
  getLedgerFees: GetLedgerFeesFn,
  resetLedgerFees: ResetLedgerFeesFn,
  ledgerFees: LedgerFees,
  isVisible: boolean,
  walletBalance: string,
}

const testID = 'ledger-fees'

export class LedgerFeesModalComponent extends PureComponent<
  LedgerFeesModalProps,
  void
> {
  onRetry = () => {
    this.props.getLedgerFees()
  }

  componentDidMount() {
    this.props.getLedgerFees()
  }

  componentDidUpdate(prevProps: LedgerFeesModalProps) {
    if (
      this.props.ledgerFees.status !== prevProps.ledgerFees.status &&
      this.props.ledgerFees.status === STORE_STATUS.SUCCESS &&
      this.props.ledgerFees.data.transfer === '0' &&
      this.props.isVisible === true
    ) {
      // if we got the fees successfully and it is zero, then auto close pop up
      // with Yes as action after user has read success text after 2 seconds
      setTimeout(this.props.onYes, 2000)
    }

    if (this.props.isVisible !== prevProps.isVisible) {
      if (this.props.isVisible === false) {
        this.props.resetLedgerFees()
      }

      if (this.props.isVisible === true) {
        this.props.getLedgerFees()
      }
    }
  }

  componentWillUnmount() {
    this.props.resetLedgerFees()
  }

  render() {
    const {
      transferAmount = null,
      isVisible,
      ledgerFees,
      onNo,
      onYes,
      walletBalance,
    } = this.props
    const { data, error, status } = ledgerFees
    const feesModalStatus = getLedgerFeesModalStatus(
      data.transfer,
      status,
      walletBalance,
      transferAmount
    )
    const ledgerFeesText = getLedgerFeesText(
      data.transfer,
      feesModalStatus,
      walletBalance,
      transferAmount
    )
    const isSuccess = status === STORE_STATUS.SUCCESS

    return (
      <Modal
        backdropOpacity={0.7}
        backdropColor={whiteSmoke}
        isVisible={isVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationOutTiming={100}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        onBackButtonPress={onNo}
        onBackdropPress={onNo}
      >
        <CustomView fifth shadow style={[styles.container]}>
          <CustomView spaceBetween style={[styles.innerContainer]}>
            <LedgerFeesModalIcon status={status} />
            {isSuccess && (
              <CustomText
                h3
                center
                tertiary
                bg="tertiary"
                transparentBg
                style={[styles.message]}
                bold
                testID={`${testID}-modal-title`}
              >
                {formatNumbers(data.transfer)}
              </CustomText>
            )}
            {isSuccess && (
              <CustomText
                h4
                center
                tertiary
                bg="tertiary"
                transparentBg
                style={[styles.message]}
                bold
                testID={`${testID}-modal-title`}
              >
                {'Transaction Fee'}
              </CustomText>
            )}
            <CustomText
              h5
              center
              tertiary
              bg="tertiary"
              transparentBg
              style={[styles.message]}
              testID={`${testID}-modal-content`}
            >
              {ledgerFeesText}
            </CustomText>
          </CustomView>
          <ActionButtons
            status={feesModalStatus}
            onYes={onYes}
            onNo={onNo}
            onRetry={this.onRetry}
            fees={data.transfer}
          />
        </CustomView>
      </Modal>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  ledgerFees: state.ledger.fees,
  walletBalance: state.wallet.walletBalance.data,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getLedgerFees, resetLedgerFees }, dispatch)

export const LedgerFeesModal = connect(mapStateToProps, mapDispatchToProps)(
  LedgerFeesModalComponent
)

const zeroAmount = new BigNumber('0')
const TEXT_LEDGER_FEES_FETCH_ERROR =
  'There was a problem checking transaction fees. Retry?'

const TEXT_LEDGER_FEES_FETCHING = 'Getting fees...'

const TEXT_NO_LEDGER_FEES =
  'No fees for this transaction. Transferring tokens...'

const TEXT_LEDGER_FEES = (fees: string) =>
  `This transaction will cost you ${formatNumbers(
    fees
  )} Sovrin Tokens. Do you wish to continue?`

const TEXT_AMOUNT_AFTER_FEES_DEDUCTION = (
  fees: string,
  transfer: ?string
): string => {
  const feesAmount = new BigNumber(fees)
  const transferAmount = new BigNumber(transfer || '0')
  const amountAfterFeesDeduction = transferAmount
    .minus(feesAmount)
    .toFixed()
    .toString()

  return `The recipient will receive ${amountAfterFeesDeduction} after the transaction fee. Proceed?`
}

const TEXT_TRANSFER_LESS_THAN_EQUAL_TO_ZERO =
  'You do not have enough tokens to pay the transaction fee.'

const LedgerFeesModalStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  ZERO_FEES: 'ZERO_FEES',
  TRANSFER_EQUAL_TO_BALANCE: 'TRANSFER_EQUAL_TO_BALANCE',
  TRANSFER_POSSIBLE_WITH_FEES: 'TRANSFER_POSSIBLE_WITH_FEES',
  TRANSFER_NOT_POSSIBLE_WITH_FEES: 'TRANSFER_NOT_POSSIBLE_WITH_FEES',
}

type LedgerFeesModalStatusEnum = $Keys<typeof LedgerFeesModalStatus>

const getLedgerFeesModalStatus = (
  fees: string,
  status: $PropertyType<StoreStatus, 'status'>,
  walletBalance: string,
  transfer: ?string
): LedgerFeesModalStatusEnum => {
  switch (status) {
    case STORE_STATUS.IDLE:
    case STORE_STATUS.IN_PROGRESS:
      return LedgerFeesModalStatus.IN_PROGRESS

    case STORE_STATUS.SUCCESS: {
      // we can get the success, but it might happen that fees is zero
      const feesAmount = new BigNumber(fees)
      if (feesAmount.isGreaterThan(zeroAmount)) {
        if (!transfer) {
          // if consumer of this component has not passed any transfer amount
          // then we don't need to perform any calculation for that amount
          // also, we will show regular transaction message
          return LedgerFeesModalStatus.TRANSFER_POSSIBLE_WITH_FEES
        }

        const walletBalanceAmount = new BigNumber(walletBalance)
        const transferAmount = new BigNumber(transfer || '0')

        if (walletBalanceAmount.isEqualTo(transferAmount)) {
          // if amount that we want to transfer is equal to wallet balance
          // and there is a fees that we have to pay
          // there can be two scenarios
          // 1. transferFees is greater than transferAmount
          // 2. transferFees is equal to transferAmount
          // 3. transferFees is less than transferAmount

          // for scenario 1, we can't transfer amount
          2 // because fees is more than what we have in wallet, also user is trying
          // to transfer same amount, but this transaction cannot be done
          if (transferAmount.minus(feesAmount).isLessThanOrEqualTo(0)) {
            return LedgerFeesModalStatus.TRANSFER_NOT_POSSIBLE_WITH_FEES
          }

          // for scenario 3, we can go with below approach and show amount
          // that will be transferred after deducting fees
          return LedgerFeesModalStatus.TRANSFER_EQUAL_TO_BALANCE
        }

        if (walletBalanceAmount.isLessThan(transferAmount.plus(feesAmount))) {
          // if wallet does not enough balance to pay for transfer amount and fees
          // then we need to tell user that this transaction cannot be done
          return LedgerFeesModalStatus.TRANSFER_NOT_POSSIBLE_WITH_FEES
        }

        return LedgerFeesModalStatus.TRANSFER_POSSIBLE_WITH_FEES
      }

      return LedgerFeesModalStatus.ZERO_FEES
    }

    case STORE_STATUS.ERROR:
    default:
      return LedgerFeesModalStatus.ERROR
  }
}

const getLedgerFeesText = (
  fees: string,
  status: LedgerFeesModalStatusEnum,
  walletBalance: string,
  transfer: ?string
) => {
  switch (status) {
    case LedgerFeesModalStatus.IN_PROGRESS:
      return TEXT_LEDGER_FEES_FETCHING

    case LedgerFeesModalStatus.ZERO_FEES:
      return TEXT_NO_LEDGER_FEES

    case LedgerFeesModalStatus.TRANSFER_EQUAL_TO_BALANCE:
      return TEXT_AMOUNT_AFTER_FEES_DEDUCTION(fees, transfer)

    case LedgerFeesModalStatus.TRANSFER_POSSIBLE_WITH_FEES:
      return TEXT_LEDGER_FEES(fees)

    case LedgerFeesModalStatus.TRANSFER_NOT_POSSIBLE_WITH_FEES:
      return TEXT_TRANSFER_LESS_THAN_EQUAL_TO_ZERO

    case LedgerFeesModalStatus.ERROR:
    default:
      return TEXT_LEDGER_FEES_FETCH_ERROR
  }
}

const alertIcon = require('../../images/alertInfo.png')
const sovrinIconOrange = require('../../images/iconTokenOrange.png')

const SovrinIcon = ({ icon }: *) => (
  <Icon
    iconStyle={[styles.icon]}
    src={icon}
    medium
    center
    resizeMode="contain"
    testID={`${testID}-modal-header-icon`}
  />
)

const LedgerFeesModalIcon = ({ status }: *) => {
  switch (status) {
    case STORE_STATUS.IDLE:
    case STORE_STATUS.IN_PROGRESS:
      return Loader

    case STORE_STATUS.SUCCESS:
      return <SovrinIcon icon={sovrinIconOrange} />

    case STORE_STATUS.ERROR:
    default:
      return <SovrinIcon icon={alertIcon} />
  }
}

const LedgerFeesModalActionButton = ({ onPress, title }: *) => (
  <Container>
    <CustomButton
      fifth
      onPress={onPress}
      title={title}
      testID={`${testID}-modal-${title}`}
      textStyle={styles.actionButton}
    />
  </Container>
)

const ActionButtons = ({ status, fees, onYes, onNo, onRetry }: *) => {
  switch (status) {
    case LedgerFeesModalStatus.IN_PROGRESS:
    case LedgerFeesModalStatus.ZERO_FEES:
      return null

    case LedgerFeesModalStatus.TRANSFER_NOT_POSSIBLE_WITH_FEES:
      return (
        <CustomView row>
          <LedgerFeesModalActionButton onPress={onNo} title={'Ok'} />
        </CustomView>
      )

    case LedgerFeesModalStatus.TRANSFER_EQUAL_TO_BALANCE:
    case LedgerFeesModalStatus.TRANSFER_POSSIBLE_WITH_FEES:
      return (
        <CustomView row>
          <LedgerFeesModalActionButton onPress={onNo} title={'No'} />
          <LedgerFeesModalActionButton onPress={onYes} title={'Yes'} />
        </CustomView>
      )

    case LedgerFeesModalStatus.ERROR:
    default:
      return (
        <CustomView row>
          <LedgerFeesModalActionButton onPress={onNo} title={'Cancel'} />
          <LedgerFeesModalActionButton onPress={onRetry} title={'Retry'} />
        </CustomView>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: OFFSET_3X,
  },
  innerContainer: {
    ...Platform.select({
      ios: {
        borderBottomColor: color.bg.fifth.font.tertiary,
        borderBottomWidth: HAIRLINE_WIDTH,
      },
      android: {
        borderBottomColor: color.bg.fifth.font.secondary,
        borderBottomWidth: 1,
      },
    }),
    padding: OFFSET_2X,
  },
  message: {
    marginBottom: OFFSET_1X / 2,
  },
  icon: {
    margin: 10,
  },
  loaderContainer: {
    height: 40,
  },
  actionButton: {
    fontWeight: 'bold',
  },
})

const Loader = (
  <CustomView center style={[styles.loaderContainer]}>
    <CustomActivityIndicator />
  </CustomView>
)
