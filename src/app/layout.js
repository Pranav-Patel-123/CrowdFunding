import '@/app/globals.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ClientProviders from '../../components/ClientProviders';

export const metadata = {
  title: 'ETH FUND',
  description: 'Decentralized crowdfunding platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#13131a]">
        <ClientProviders>
          <div className="relative sm:-8 p-4 min-h-screen flex flex-row">
            <div className="sm:flex hidden mr-10 relative">
              <Sidebar />
            </div>
            <div className="flex-1 max-sm:w-full max-w-[1208px] mx-auto sm:pr-5">
              <Navbar />
              {children}
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
