import BottomModal from 'components/bottom-modal'
import React from 'react'

import RadarAnimation from '../loader/Radar'
import Text from '../text'

type Props = {
  showLedgerPopup: boolean
  onCloseLedgerPopup?: VoidFunction
}

export default function LedgerConfirmationPopup({ showLedgerPopup, onCloseLedgerPopup }: Props) {
  const onClose = () => {
    //Placeholder function
  }

  return (
    <BottomModal
      isOpen={showLedgerPopup}
      onClose={onCloseLedgerPopup ?? onClose}
      title={'Confirm on Ledger'}
    >
      <div className='flex flex-col items-center'>
        <div className='my-7'>
          <RadarAnimation />
        </div>
        <Text size='md' className='font-bold mb-7'>
          Approve transaction on your hardware wallet
        </Text>
      </div>
    </BottomModal>
  )
}
