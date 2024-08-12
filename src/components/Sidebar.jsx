import React, { useState } from 'react';
import { Box, Tabs, Tab, Divider, IconButton, Grid, Typography } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { messageTypes, specialItems } from '../constant';
import { MessageType } from './MessageType';
import { TabLabel } from './TabLabel';

export function Sidebar() {
  const [tab, setTab] = useState('messages');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      sx={{
        padding: 1,
        width: 250,
        backgroundColor: '#ffffff',
        height: '100vh',
        position: 'fixed',
        left: isSidebarOpen ? 0 : -250,
        top: 0,
        borderRight: '1px solid #ddd',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'left 0.3s ease-in-out',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'absolute',
            right: '-30px',
            top: 2,
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            zIndex: 1100,
          }}
        >
          {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: 'bold',
            color: '#1976d2',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          ::FLOW::
        </Typography>
        <Divider />
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          aria-label="Sidebar Tabs"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '1px solid #ddd',
            overflowX: 'auto',
            overflowY: 'hidden',
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
            },
            '& .MuiTab-root': {
              minWidth: 50,
              padding: 0.5,
              fontSize: '0.75rem',
            },
          }}
        >
          <Tab
            label={<TabLabel icon={<SmsIcon />} label="Mensagens" />}
            value="messages"
            sx={{
              textTransform: 'none',
              fontWeight: tab === 'messages' ? 'bold' : 'normal',
              '&.Mui-selected': {
                color: '#1976d2',
              },
            }}
          />
          <Tab
            label={<TabLabel icon={<AppsIcon />} label="Recursos" />}
            value="special"
            sx={{
              textTransform: 'none',
              fontWeight: tab === 'special' ? 'bold' : 'normal',
              '&.Mui-selected': {
                color: '#1976d2',
              },
            }}
          />
          <Tab
            label={<TabLabel icon={<SettingsIcon />} label="Configurações" />}
            value="settings"
            sx={{
              textTransform: 'none',
              fontWeight: tab === 'settings' ? 'bold' : 'normal',
              '&.Mui-selected': {
                color: '#1976d2',
              },
            }}
          />
        </Tabs>
        <Divider />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        {tab === 'messages' && messageTypes.map(({ type, label, Icon }) => (
          <MessageType key={type} type={type} label={label} Icon={Icon} />
        ))}
        {tab === 'special' && specialItems.map(({ type, label, Icon }) => (
          <MessageType key={type} type={type} label={label} Icon={Icon} />
        ))}
        {tab === 'settings' && <>EM BREVE</>}
      </Box>
    </Box>
  );
};
