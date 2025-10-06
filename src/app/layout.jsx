import './globals.css';
import SimpleLayout from './SimpleLayout';

export const metadata = {
  title: "HuskyBids",
  description: "Bet on University of Washington sports games using biscuits!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SimpleLayout>
          {children}
        </SimpleLayout>
      </body>
    </html>
  );
}