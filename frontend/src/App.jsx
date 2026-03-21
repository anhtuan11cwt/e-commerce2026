import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="font-bold text-3xl underline">Xin chào thế giới!</h1>
        <ModeToggle />
      </div>
      <Button>Nhấn vào đây</Button>
    </div>
  );
}

export default App;
