import TextFormatIcon from '@mui/icons-material/TextFormat';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HttpIcon from '@mui/icons-material/Http';
import CallEndIcon from '@mui/icons-material/CallEnd';

const itemConfig = {
  TEXT_MESSAGE: { label: 'Texto', Icon: TextFormatIcon, category: 'message' },
  QUESTION_MESSAGE: { label: 'Perguntar', Icon: QuestionAnswerIcon, category: 'message' },
  AUDIO_MESSAGE: { label: 'Áudio', Icon: AudioFileIcon, category: 'message' },
  IMAGE_MESSAGE: { label: 'Imagem', Icon: ImageIcon, category: 'message' },
  DOCUMENT_MESSAGE: { label: 'Documento', Icon: DescriptionIcon, category: 'message' },
  MENU_MESSAGE: { label: 'Menu', Icon: MenuIcon, category: 'message' },
  AI_MESSAGE: { label: 'AI', Icon: AutoFixHighIcon, category: 'special' },
  API_REQUEST: { label: 'Request API', Icon: HttpIcon, category: 'special' },
  END: { label: 'Encerrar', Icon: CallEndIcon, category: 'special' },
};

export const iconMap = Object.fromEntries(
  Object.entries(itemConfig).map(([key, { Icon }]) => [key.toLowerCase(), <Icon />])
);

export const messageTypes = Object.entries(itemConfig).filter(([, config]) => config.category === 'message').map(([type, { label, Icon }]) => (
  { type: type.toLowerCase(), label, Icon }
));

export const specialItems = Object.entries(itemConfig).filter(([, config]) => config.category === 'special').map(([type, { label, Icon }]) => (
  { type: type.toLowerCase(), label, Icon }
));


export const ItemTypes = Object.keys(itemConfig).reduce((acc, key) => {
  acc[key] = key.toLowerCase();
  return acc;
}, {});
