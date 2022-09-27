import { HardhatNetworkConfig, NetworkConfig, HardhatNetworkAccountConfig } from 'hardhat/types';

export const Sleep = (ms: number) => {
    return new Promise(resole => setTimeout(resole, ms));
}

export const Now = (): number => {
    return Math.floor(Date.now() / 1000);
}

export const NetworkAccounts = (config: NetworkConfig): string[] => {
    const accounts = ((config as HardhatNetworkConfig).accounts as HardhatNetworkAccountConfig[]);
    return accounts as any as string[];
}