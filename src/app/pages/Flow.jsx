import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, IconButton, InputAdornment, Popover, TextField } from '@mui/material';

import Cookies from "js-cookie";

import environment from '@theflow/configs/environment';
import { FlowEditor, Sidebar } from '@theflow/components';
import { FlowService } from '@theflow/services/flow';
import { toast } from 'react-toastify';
import { Modal } from '@theflow/components/Modal';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

Cookies.set(environment.COOKIES.SESSION, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE3MjM1OTY3NjAsImV4cCI6MTcyNDIwMTU2MH0.jhdTdxHmwLalhRYBVC75HtZFJ1nLMG6Kr7TafTRECHw");


export function Flow() {
  const { code } = useParams();
  const [savedNodes, setSavedNodes] = useState([]);
  const [savedEdges, setSavedEdges] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataNodes, setDataNodes] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textMessage, setTextMessage] = useState(null);
  const emojiAnchorRef = useRef(null);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (event) => {
    setTextMessage((prevText) => prevText + event.emoji);
  };


  const save = async (data) => {

    if (data?.type === "add") {
      try {
        const response = await FlowService.saveNodes(code, {
          id: data.id,
          type: data.item.type,
          position: {
            x: data.position.x,
            y: data.position.y,
          },
        });
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }

    if (data?.type === "position") {
      try {
        const response = await FlowService.updateNodes(code, data.node.id, {
          position: {
            x: data.node.position.x,
            y: data.node.position.y,
          },
        });
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }

    if (data?.type === "remove") {
      try {
        const response = await FlowService.deleteNodes(code, data.node.id);
        console.log(response)
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }

    if (data?.type === "connect") {
      try {
        const response = await FlowService.connectEdges(code, data.params);
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }

    if (data?.type === "deleteEdge") {
      try {
        const response = await FlowService.deleteEdges(code, data?.source, data?.target);
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }
  };


  const handleEdit = (id) => {
    setOpenModal(true);
    const node = savedNodes.find((e) => e.id === id);
    if (node) {
      setTextMessage(node?.text_content);
      setDataNodes(node);
    }
  }

  const onChangetextMessage = (event) => {
    setTextMessage(event.target.value);
  }

  const saveText = async () => {
    try {
      const { id } = dataNodes;
      const { status, message } = await FlowService.updateContentNodes(code, id, {
        text_content: textMessage
      });
      if (status === 200) {
        toast.success(message);
        const updatedNodes = savedNodes.map((node) =>
          node.id === id ? { ...node, text_content: textMessage } : node
        );
        setSavedNodes(updatedNodes);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  }

  React.useEffect(() => {
    if (code) {
      FlowService.fetchGetFlow(code).then(({ status, nodes, edges }) => {
        if (status === 200) {
          if (nodes?.length > 0) {

            setSavedNodes(nodes);
          }
          if (edges?.length > 0) {
            setSavedEdges(edges);
          }
        }
      });
    }
  }, [code]);

  return (
    <Grid style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <FlowEditor
        code={code}
        nodes={savedNodes}
        edges={savedEdges}
        save={save}
        onEdit={handleEdit}
      />

      <Modal title="Editar" open={openModal} onClose={() => setOpenModal(false)}>
        {dataNodes && dataNodes?.type === "text_message" && (
          <Grid container padding={2} spacing={2}>
            <Grid item md={12} mb={2}>
              <TextField
                fullWidth
                multiline
                autoComplete="off"
                value={textMessage}
                label="Texto"
                variant="outlined"
                onChange={onChangetextMessage}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        ref={emojiAnchorRef}
                        onClick={toggleEmojiPicker}
                      >
                        <EmojiEmotionsIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Popover
              open={showEmojiPicker}
              anchorEl={emojiAnchorRef.current}
              onClose={() => setShowEmojiPicker(false)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </Popover>
            <Grid item md={12} mb={2}>
              <Button color="success" variant="outlined" onClick={saveText}>Salvar</Button>
            </Grid>
          </Grid>
        )}
      </Modal>
    </Grid>
  )

}