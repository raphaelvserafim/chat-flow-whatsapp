import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { iconMap, MESSAGE_TYPE, messageTypes, specialItems } from '@theflow/constant';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomAudioPlayer from './CustomAudioPlayer';

export function DynamicNode({ id, data }) {
  const { type, onDelete, onAddConnection, onEdit } = data || {};
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddOutput = () => {
    onAddConnection(id);
  };

  const handleDelete = () => {
    try {
      onDelete(id);
      handleMenuClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isMenuMessage = type === MESSAGE_TYPE.MENU;
  const isEnd = type === MESSAGE_TYPE.END;
  const isStart = type === MESSAGE_TYPE.START;
  const isAudio = type === MESSAGE_TYPE.AUDIO;

  const open = Boolean(anchorEl);

  let label = messageTypes.find((e) => e.type === type)?.label;
  if (!label) {
    label = specialItems.find((e) => e.type === type)?.label;
  }


  return (
    <div className={`node-container`} key={id}>
      <div className="node-icon">
        {iconMap[type]}
        <span className="name">{label}</span>
      </div>

      {!Boolean(isStart) && (
        <Handle
          type="target"
          position="left"
          id="target"
          className="handle-target"
        />
      )}

      {!Boolean(isEnd) && (
        <Handle
          type="source"
          position="right"
          id="source"
          className="handle-source"
        />
      )}

      <div className="node-actions">
        <Tooltip title="Opções" arrow>
          <IconButton
            aria-controls="node-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="node-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => { onEdit(); handleMenuClose(); }}
            style={{ fontSize: 13 }}
          >
            <EditIcon style={{ fontSize: 17, marginRight: 8 }} />
            Editar
          </MenuItem>
          {!Boolean(isStart) && (
            <MenuItem
              onClick={handleDelete}
              style={{ fontSize: 13 }}
            >
              <DeleteIcon style={{ fontSize: 17, marginRight: 8 }} />
              Deletar
            </MenuItem>
          )}
        </Menu>
      </div>
      {isMenuMessage && (
        <Tooltip title="Adicionar opção" arrow>
          <div className="add-output-button" onClick={handleAddOutput}>
            <AddIcon />
          </div>
        </Tooltip>
      )}

      {
        data?.text_content && (
          <div className='text_content'>{data?.text_content}</div>
        )
      }

      {isAudio && (
        <div className='play'>
          <CustomAudioPlayer url={data?.file_content?.url} />
        </div>
      )}

    </div >
  );
};
