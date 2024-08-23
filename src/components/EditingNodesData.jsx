import { Autocomplete, Button, FormControlLabel, Grid, IconButton, InputAdornment, Popover, Switch, TextField } from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SingleImageUpload from "./SingleImageUpload";
import { MESSAGE_TYPE } from "@theflow/constant";
import { useCallback, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import PropTypes from "prop-types";
import SingleFileUpload from "./SingleFileUpload";
import SingleAudioUpload from "./SingleAudioUpload";

export function EditingNodesData(props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [options, setOptions] = useState([]);

  const emojiAnchorRef = useRef(null);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);


  const handleChange = (event, value) => {
    if (value && !options.some(option => option.title === value)) {
      // Adiciona a nova opção se não existir nas opções
      setOptions(prevOptions => [...prevOptions, { title: value }]);
    }
  };


  const nameLabel = () => {
    if (props?.dataNodes?.type === MESSAGE_TYPE.QUESTION) {
      return "Peguntar";
    } else if (props?.dataNodes?.type === MESSAGE_TYPE.MENU) {
      return "Questão";
    } else if (props?.dataNodes?.type === MESSAGE_TYPE.TEXT) {
      return "Mensagem";
    }

    return "Texto";
  }


  return (
    <Grid container padding={2} spacing={2}>

      {props?.dataNodes?.type === MESSAGE_TYPE.IMAGE &&
        <Grid item xs={12} md={12} mb={2}>
          <SingleImageUpload
            url={props?.dataNodes?.file_content?.url}
            onFile={props?.onUploadFileNodes}
          />
        </Grid>
      }
      {(props?.dataNodes?.type === MESSAGE_TYPE.DOCUMENT) &&
        <Grid item xs={12} md={12} mb={2}>
          <SingleFileUpload
            type={props?.dataNodes?.type}
            url={props?.dataNodes?.file_content?.url}
            metaData={props?.dataNodes?.file_content?.metaData}
            onFile={props?.onUploadFileNodes}
          />
        </Grid>
      }

      {(props?.dataNodes?.type === MESSAGE_TYPE.AUDIO) &&
        <Grid item xs={12} md={12} mb={2}>
          <SingleAudioUpload
            url={props?.dataNodes?.file_content?.url}
            onFile={props?.onUploadFileNodes}
          />
        </Grid>
      }



      <>
        {(
          props?.dataNodes?.type !== MESSAGE_TYPE.AUDIO &&
          props?.dataNodes?.type !== MESSAGE_TYPE.API &&
          props?.dataNodes?.type !== MESSAGE_TYPE.AI) &&
          (
            <>
              <Grid item xs={12} md={12} mb={2}>
                <TextField
                  fullWidth
                  multiline
                  autoComplete="off"
                  value={props?.textMessage}
                  label={nameLabel()}
                  variant="outlined"
                  onChange={props?.onChangetextMessage}
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
                <EmojiPicker onEmojiClick={props?.onEmojiClick} />
              </Popover>
            </>
          )}
      </>

      {props?.dataNodes?.type === MESSAGE_TYPE.AI && (
        <Grid item xs={12} md={12} mb={2}>
          <TextField
            fullWidth
            multiline
            autoComplete="off"
            value={props?.textMessage}
            label={"Prompt"}
            variant="outlined"
            onChange={props?.onChangetextMessage}
          />
        </Grid>
      )
      }

      {(props?.dataNodes?.type === MESSAGE_TYPE.QUESTION || props?.dataNodes?.type === MESSAGE_TYPE.MENU) && (
        <>
          <Grid item xs={12} md={6} mb={2}>
            <FormControlLabel
              control={<Switch
                defaultChecked={props?.dataNodes?.save_answer}
                onChange={props?.onChangeSaveAnswer}
              />} label="Salvar resposta" />
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Autocomplete
              onChange={handleChange}
              options={options}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} label="Variavel" />}
            />
          </Grid>
        </>
      )}

      <Grid item xs={12} md={12} mb={2}>
        <Button color="success" variant="outlined" onClick={props?.saveText} disabled={props?.saving}>
          {props?.saving ? "salvando..." : "Salvar"}
        </Button>
      </Grid>
    </Grid>
  );
}

EditingNodesData.propTypes = {
  dataNodes: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(MESSAGE_TYPE)).isRequired,
    file_content: PropTypes.string,
    save_answer: PropTypes.bool,
  }),
  textMessage: PropTypes.string.isRequired,
  onChangetextMessage: PropTypes.func.isRequired,
  onChangeSaveAnswer: PropTypes.func.isRequired,
  saveAnswer: PropTypes.bool.isRequired,
  onUploadFileNodes: PropTypes.func,
  onEmojiClick: PropTypes.func,
  saveText: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};
