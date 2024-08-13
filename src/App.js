import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer, } from 'react-toastify';
import { FlowEditor } from '@theflow/components';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FlowEditor />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </DndProvider>
  );
}

export default App;
