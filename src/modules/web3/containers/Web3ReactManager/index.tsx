import { useEffect } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { notification } from 'antd';

import { network } from '@utils/connectors';
import { getErrorMessage } from '@utils/web3';
import { useInactiveListener, useEagerConnect } from '../../../common/hooks';

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active, error, activate } = useWeb3React();

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !error && !active) {
      activate(network);
    }
  }, [triedEager, activate, error, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  useEffect(() => {
    if (error && !(error instanceof UnsupportedChainIdError)) {
      notification.error({
        message: 'WEB3 Error',
        className: 'notificationError',
        description: getErrorMessage(error),
      });
    }
  }, [error]);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }
  return children;
}
