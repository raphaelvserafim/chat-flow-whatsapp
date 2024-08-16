import AudioFileIcon from '@mui/icons-material/AudioFile';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HttpIcon from '@mui/icons-material/Http';
import CallEndIcon from '@mui/icons-material/CallEnd';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import MessageIcon from '@mui/icons-material/Message';

const itemConfig = {
  TEXT_MESSAGE: { label: 'Texto', Icon: MessageIcon, category: 'message', show: true, },
  QUESTION_MESSAGE: { label: 'Perguntar', Icon: QuestionAnswerIcon, category: 'message', show: true, },
  AUDIO_MESSAGE: { label: 'Áudio', Icon: AudioFileIcon, category: 'message', show: true, },
  IMAGE_MESSAGE: { label: 'Imagem', Icon: ImageIcon, category: 'message', show: true, },
  DOCUMENT_MESSAGE: { label: 'Documento', Icon: DescriptionIcon, category: 'message', show: true, },
  MENU_MESSAGE: { label: 'Menu', Icon: MenuIcon, category: 'message', show: true, },
  AI_MESSAGE: { label: 'AI', Icon: AutoFixHighIcon, category: 'special', show: true, },
  API_REQUEST: { label: 'Request API', Icon: HttpIcon, category: 'special', show: true, },
  END: { label: 'Encerrar', Icon: CallEndIcon, category: 'special', show: true, },
  START: { label: 'Iniciar', Icon: FlagCircleIcon, category: 'special', show: false, },
};

export const iconMap = Object.fromEntries(
  Object.entries(itemConfig).map(([key, { Icon }]) => [key.toLowerCase(), <Icon />])
);

export const messageTypes = Object.entries(itemConfig).filter(([, config]) => config.category === 'message').map(([type, { label, Icon }]) => (
  { type: type.toLowerCase(), label, Icon }
));

export const specialItems = Object.entries(itemConfig)
  .filter(([, config]) => config.category === 'special')
  .map(([type, { label, Icon, show }]) => (
    { type: type.toLowerCase(), label, Icon, show }
  ));

export const ItemTypes = Object.keys(itemConfig).reduce((acc, key) => {
  acc[key] = key.toLowerCase();
  return acc;
}, {});
