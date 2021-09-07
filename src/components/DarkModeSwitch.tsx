import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, Switch, IconButton } from "@chakra-ui/react";
import React from "react";

export const DarkModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label={isDark ? "light mode" : "dark mode"}
      icon={isDark ? <SunIcon /> : <MoonIcon />}
    />
  );
};

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />;
};
