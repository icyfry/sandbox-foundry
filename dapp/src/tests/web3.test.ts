import { expect, test } from 'vitest'
import { Web3Utils } from '../utils/web3utils';

test('init without provider', () => {
    expect(() => {
        const web3: Web3Utils = new Web3Utils(undefined);
        web3.initialize();
    }).toThrow();
})