import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './header';
import './styles/global.css';
import './styles/index.css';
import '@fontsource/poppins';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>SheetBills - Invoice Management Platform</title>
        <meta name="description" content="Manage your invoices with Google Sheets integration" />
        <meta name="generator" content="v0.dev" />
      </Helmet>
      <Header />
      <main className="font-poppins p-5">{children}</main>
    </>
  );
};

export default RootLayout;