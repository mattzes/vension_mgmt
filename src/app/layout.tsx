import NavBar from '@/components/NavBar';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { AlertContextProvider } from '@/context/AlertContext';
import { AuthContextProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vension MGMT',
  description: 'Verwalte und dokumentiere deinen Vorrat',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>
          <AuthContextProvider>
            <AlertContextProvider>
              <NavBar />
              {children}
            </AlertContextProvider>
          </AuthContextProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
