import { useTheme } from "../ThemeProvider";
import { Button } from "./ui/Button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Button variant={"ghost"} className="p-2" onClick={handleToggleTheme}>
      {theme === "light" ? (
        <>
          Dark mode
          <Moon className="size-4" />
        </>
      ) : (
        <>
          Light mode
          <Sun className="size-4" />
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
