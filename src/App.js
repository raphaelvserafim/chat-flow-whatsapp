import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlowEditor } from './components/FlowEditor';


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FlowEditor />
    </DndProvider>
  );
}

export default App;
