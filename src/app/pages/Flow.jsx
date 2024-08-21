import React, { useRef, useState, useCallback, useEffect } from 'react';
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
import { ReactFlowProvider } from 'react-flow-renderer';
import SingleImageUpload from '@theflow/components/SingleImageUpload';

Cookies.set(environment.COOKIES.SESSION, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE3MjQyMDI1OTIsImV4cCI6MTcyNDgwNzM5Mn0.idgwOGTnxhJrxlyqmhOQWsStZUisVMcqFk8wvDpSc1Q");


export function Flow() {
  const { code } = useParams();
  const [savedNodes, setSavedNodes] = useState([]);
  const [savedEdges, setSavedEdges] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataNodes, setDataNodes] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textMessage, setTextMessage] = useState(null);
  const [imageMessage, setImageMessage] = useState(null);

  const [searching, setSearching] = useState(true);
  const [saving, setSaving] = useState(false);

  const emojiAnchorRef = useRef(null);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const onEmojiClick = useCallback((event) => {
    setTextMessage((prevText) => prevText + event.emoji);
  }, []);

  const save = useCallback(async (data) => {
    console.log({ data })
    if (data?.type === "add") {
      try {
        setSavedNodes((nds) => [
          ...nds,
          {
            id: data.id,
            position_x: data.position.x,
            position_y: data.position.y,
            text_content: null,
            type: data.item.type,
          },
        ]);
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
        setSavedNodes((nds) =>
          nds.map((node) =>
            node.id === data.node.id
              ? {
                ...node,
                position_x: data.node.position.x,
                position_y: data.node.position.y,
              }
              : node
          )
        );
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
        if (response?.status === 200) {
          setSavedNodes((nds) => nds.filter((node) => node.id !== data.node.id));
          setSavedEdges((eds) => eds.filter((edge) => edge.source !== data.node.id && edge.target !== data.node.id));
        } else {
          toast.error(response.message || "Erro ao remover o nó");
        }
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }

    if (data?.type === "connect") {
      try {
        setSavedEdges((nds) => [
          ...nds,
          {
            source: data.params.source,
            target: data.params.target,
          },
        ]);
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
        setSavedEdges((edges) =>
          edges.filter(
            (edge) => edge.source !== data.source || edge.target !== data.target
          )
        );
        const response = await FlowService.deleteEdges(code, data?.source, data?.target);
        return response;
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        return false;
      }
    }

    if (data?.type === "addConnection") {
      const _node = savedNodes.find((e) => e.id === data.sourceId);
      const _edges = savedEdges.filter((e => e.source === data.sourceId));
      console.log({ _edges })

      const { position_x, position_y, id } = _node;
      save({
        id: data.id,
        text_content: null,
        type: 'add',
        item: {
          type: 'text_message',
        },
        position: {
          x: position_x + 300,
          y: ((position_y) + (103 * _edges.length)),
        },
      });
      save({
        type: 'connect',
        params: {
          source: id,
          target: data.id,
        },
      });
    }

  }, [code, savedEdges, savedNodes]);


  const handleEdit = useCallback((event) => {
    setTextMessage(null);
    setDataNodes(null);
    setOpenModal(true);
    const node = savedNodes.find((e) => e.id === event.id);
    if (node) {
      console.log({ node })
      setTextMessage(node?.text_content);
      setDataNodes(node);
    }
  }, [savedNodes]);

  const onChangetextMessage = useCallback((event) => {
    setTextMessage(event.target.value);
  }, []);





  const saveText = useCallback(async () => {
    try {
      setSaving(true);
      const { id } = dataNodes;
      const { status, message } = await FlowService.updateContentNodes(code, id, {
        text_content: textMessage,
      });
      if (status === 200) {
        toast.success(message);
        const updatedNodes = savedNodes.map((node) =>
          node.id === id ? { ...node, text_content: textMessage } : node
        );
        setSavedNodes(updatedNodes);
      }
      setSaving(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  }, [code, dataNodes, savedNodes, textMessage]);

  const uploadFileNodes = async (file) => {
    const { id } = dataNodes;
    const formData = new FormData();
    formData.append('file', file);
    const response = await FlowService.uploadFileNodes(code, id, formData);
    console.log(response)

  }


  useEffect(() => {
    if (code) {
      setSearching(true);
      FlowService.fetchGetFlow(code).then(({ status, message, nodes, edges }) => {
        setSearching(false);
        if (status === 200) {
          setSavedEdges(edges);
          setSavedNodes(nodes);
          return;
        }
        toast.error(message);
      }).catch((e) => {
        toast.error(e.message);
      })
    }
  }, [code]);

  return (
    <Grid style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      {searching && <>Buscando...</>}
      {!searching && (
        <ReactFlowProvider>
          <MemoizedFlowEditor
            code={code}
            nodes={savedNodes}
            edges={savedEdges}
            save={save}
            onEdit={handleEdit}
          />
        </ReactFlowProvider>
      )}

      <Modal title="Editar" open={openModal} onClose={() => { setOpenModal(false); }}>
        {dataNodes && (
          <Grid container padding={2} spacing={2}>
            {dataNodes?.type === "image_message" &&
              <Grid item md={12} mb={2}>
                <SingleImageUpload
                  onFile={uploadFileNodes}
                />
              </Grid>
            }
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
                      <IconButton ref={emojiAnchorRef} onClick={toggleEmojiPicker}>
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
              <Button color="success" variant="outlined" onClick={saveText} disabled={saving}>
                {saving ? "salvando..." : "Salvar"}
              </Button>
            </Grid>
          </Grid>
        )}
      </Modal>
    </Grid>
  );
}

const MemoizedFlowEditor = React.memo(FlowEditor);
