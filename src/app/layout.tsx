import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
           <AuthProvider>
          {children}
        </AuthProvider>
          <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '0.9rem' },
          }}
        />
      </body>
    </html>
  );
}