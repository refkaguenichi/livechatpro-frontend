import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
           <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}