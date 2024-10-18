import React, { useState, useEffect } from 'react';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider } from 'styled-components';

const App = () => {
    const [theme, setTheme] = useState(lightTheme);

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
        });

        setTheme(Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme);

        return () => subscription.remove();
    }, []);

    return (
        <AppearanceProvider>
            <ThemeProvider theme={theme}>
            </ThemeProvider>
        </AppearanceProvider>
    );
};

export default App;
