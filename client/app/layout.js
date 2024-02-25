"use client"
import '../styles/globals.css'
import { Quicksand } from 'next/font/google'
import { Provider } from 'react-redux';
import { ThemeProvider } from "@mui/material/styles";
import { store } from './../redux/store';
import { createTheme } from "@mui/material/styles";
import { SnackbarProvider } from 'notistack';

const CustomFontTheme = createTheme({
  typography: {
    fontFamily: "Quicksand, sans-serif"
  }
});

const quicksand = Quicksand({ subsets: ['latin'], weight: ["300", "400", "500", "600", "700"] })

export const metadata = {
  title: 'Students Guide',
  description: 'A guide for students to learn about their Interests',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${quicksand.className} overflow-y-hidden`}>
        <Provider store={store}>
          <ThemeProvider theme={CustomFontTheme}>
            <SnackbarProvider maxSnack={1}   autoHideDuration={2000} anchorOrigin={ { horizontal: "right", vertical: "bottom" }}>
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
