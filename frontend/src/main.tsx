// The React app starts here: it is drawn inside <div id="root"> in index.html.
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles.css"

const root = document.getElementById("root") as HTMLElement
createRoot(root).render(<App />)
