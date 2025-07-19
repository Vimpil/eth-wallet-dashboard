import { etherscan } from './services/EtherscanService'

export const etherscanRequest = etherscan.request.bind(etherscan)
export const formatAddress = etherscan.formatAddress.bind(etherscan)
export const getExplorerTxUrl = etherscan.getExplorerTxUrl.bind(etherscan)
export const getExplorerAddressUrl = etherscan.getExplorerAddressUrl.bind(etherscan)
