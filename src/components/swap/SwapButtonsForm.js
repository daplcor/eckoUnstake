import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../components/shared/CustomButton';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../modals/kdaModals/ConnectWalletModal';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import Label from '../shared/Label';
import {
  SWAP_BUTTON_CONNECT_WALLET,
  SWAP_BUTTON_ENTER_AMOUNT,
  SWAP_BUTTON_FETCHING_PAIR,
  SWAP_BUTTON_NOT_LIQUIDITY,
  SWAP_BUTTON_PAIR_NOT_ESIST,
  SWAP_BUTTON_POOL_IS_EMPTY,
  SWAP_BUTTON_SELECT_TOKENS,
  SWAP_BUTTON_SWAP,
} from '../../constants/swap';
import { useAccountContext, useGameEditionContext, useModalContext, usePactContext, useSwapContext, useWalletContext } from '../../contexts';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: ${({ gameEditionView }) => (gameEditionView ? '0' : '1')};
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: ${({ gameEditionView }) => !gameEditionView && '1'};
`;

const SwapButtonsForm = ({
  loading,
  fetchingPair,
  setLoading,
  fromValues,
  toValues,
  fromNote,
  noLiquidity,
  ratio,
  setShowTxModal,
  showTxModal,
  onSelectToken,
}) => {
  const modalContext = useModalContext();
  const { account } = useAccountContext();
  const wallet = useWalletContext();
  const { swapWallet } = useSwapContext();
  const pact = usePactContext();
  const { gameEditionView, setButtons, closeModal } = useGameEditionContext();



  useEffect(() => {
    if (gameEditionView && !loading && account?.account) {
      setButtons({
        A: () => {
          if (showTxModal) {
            setLoading(true);
            pact.txSend();
            setShowTxModal(false);
            closeModal();
            setLoading(false);
          } else {
            handleClick();
          }
        },
      });
    } else {
      setButtons({ A: null });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTxModal, account.account, gameEditionView, fromValues, toValues, loading]);

  const handleClick = async () => {
    setLoading(true);

    const res = await swapWallet(
      {
        amount: fromValues.amount,
        address: fromValues.address,
        coin: fromValues.coin,
      },
      {
        amount: toValues.amount,
        address: toValues.address,
        coin: toValues.coin,
      },
      fromNote === '(estimate)' ? false : true
    );

    if (!res) {
      wallet.setIsWaitingForWalletAuth(true);
    } else {
      wallet.setWalletError(null);
      setShowTxModal(true);
    }
    setLoading(false);
  };

  const getButtonLabel = () => {
    return "Swaps Disabled";
  };
  
  return (
    <ButtonContainer gameEditionView={gameEditionView}>
      {gameEditionView ? (
        <LabelContainer>
          <Label geColor="yellow">{getButtonLabel()}</Label>
        </LabelContainer>
      ) : (
        <CustomButton
          fluid
          type="secondary"
          disabled={true}
          onClick={() => {}}
        >
          {getButtonLabel()}
        </CustomButton>
      )}
    </ButtonContainer>
  );
};

export default SwapButtonsForm;
