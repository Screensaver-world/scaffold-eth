import { Provider } from '@ethersproject/providers';
import { useCallback, useEffect, useRef } from 'react';

import { TEthHooksProvider } from '~~/models/providerTypes';

const DEBUG = false;
/**
 * helper hook to call a function regularly at time intervals when the block changes
 * @param provider ethers/web3 provider
 * @param callbackFn any function
 * @param args function parameters
 */
export const useOnBlock = (
  provider: TEthHooksProvider | Provider | undefined,
  callbackFn: (..._args: []) => void,
  ...args: []
): void => {
  // save the input function provided
  const savedCallback = useRef<(..._args: []) => void>();
  useEffect(() => {
    savedCallback.current = callbackFn;
  }, [callbackFn]);

  // Turn on the listener if we have a function & a provider
  const listener = useCallback((blockNumber: number): void => {
    if (provider) {
      if (DEBUG) console.log(blockNumber, callbackFn, args, provider.listeners());

      if (savedCallback.current) {
        if (args && args.length > 0) {
          savedCallback.current(...args);
        } else {
          savedCallback.current();
        }
      }
    }
  }, []);

  useEffect(() => {
    if (provider) {
      provider.on('block', listener);
      return (): void => {
        provider.off('block', listener);
      };
    } else {
      return (): void => {};
    }
  }, [provider]);
};
