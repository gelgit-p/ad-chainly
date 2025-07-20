import { createConfig, WagmiProvider, http, injected } from 'wagmi';
import { ConnectKitProvider, ConnectKitButton } from 'connectkit';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask } from 'wagmi/connectors'
import styled from "styled-components";

// Cliente para react-query
const queryClient = new QueryClient();

// Crea la configuración de Wagmi directamente
const config = createConfig({
	chains: [base, baseSepolia],
	transports: {
		[base.id]: http(),
		[baseSepolia.id]: http(),
	},
	connectors: [injected(), metaMask()],

	ssr: true,
});

// Componente principal que envuelve tu aplicación
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider>{children}</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  color: #ffffff;
  background: #1a88f8;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10rem;
  box-shadow: 0 4px 24px -6px #1a88f8;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #1a88f8;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #1a88f8;
  }
`;

// Componente del botón de conexión que puedes usar en cualquier parte de tu app
export const ConnectWalletButton: React.FC = () => {
	return (
		<ConnectKitButton.Custom>
			{({ isConnected, isConnecting, show, address, ensName }) => {
				return (
					<button
						onClick={show}
						className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
					>
						{isConnected
							? `Connected: ${
									ensName || address?.substring(0, 6)
							  }...${address?.substring(38)}`
							: isConnecting
							? 'Connecting...'
							: 'connect Wallet'}
					</button>
				);
			}}
		</ConnectKitButton.Custom>
	);
};
