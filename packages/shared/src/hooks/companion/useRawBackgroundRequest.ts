import { useEffect, useState } from 'react';
import { Browser } from 'webextension-polyfill-ts';
import { EmptyObjectLiteral } from '../../lib/kratos';
import { useRequestProtocol } from '../useRequestProtocol';

export const useRawBackgroundRequest = (
  command: (params: EmptyObjectLiteral) => void,
): void => {
  const { isCompanion } = useRequestProtocol();
  const [browser, setBrowser] = useState<Browser>();

  useEffect(() => {
    if (!isCompanion) return;

    import('webextension-polyfill-ts').then((mod) => setBrowser(mod.browser));
  }, [isCompanion]);

  useEffect(() => {
    if (!browser) return null;

    const handler = ({ key, ...args }) => {
      if (!key) {
        return;
      }

      command({ key, ...args });
    };

    browser.runtime.onMessage.addListener(handler);

    return () => {
      browser.runtime.onMessage.removeListener(handler);
    };
  }, [command, browser]);
};
