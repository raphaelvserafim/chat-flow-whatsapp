import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import IconButton from '@mui/material/IconButton';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

export function Modal(props) {

  const [fullScreen, setFullScreen] = React.useState(false);

  const handleClose = () => {
    props?.onClose(true);
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle textAlign={"center"}>{props?.title}</DialogTitle>
      <IconButton style={{ position: "absolute", float: "right", right: 0 }} onClick={() => setFullScreen(!fullScreen)}>
        {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>

      <DialogContent fullWidth dividers>
        {props?.children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};