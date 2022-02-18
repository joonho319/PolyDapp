import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Card_main } from './pages/Card_main';
import { Layout } from './components/Layout';
import { MyCard } from './pages/MyCard';
import { SaleCard } from './pages/SaleCard';
function App() {
  const [account, setAccount]= useState<string>("");
  const getAccount = async () => {
    try{
      if(window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        console.log(accounts[0])
      } else {
        alert('Install Metamastk')
      }
    } catch(e) {
      console.log(e)
    }
  }
  useEffect(()=> {
    getAccount();
  },[]);

  useEffect(()=> {
    console.log(account);
  },[account]);
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Card_main account={account} />} />
          <Route path="/myCard" element={<MyCard account={account} />} />
          <Route path="/saleCard" element={<SaleCard account={account} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
