import { createContext, useContext, useState } from 'react';

const RoundContext = createContext();

export function useRound() {
    return useContext(RoundContext);
}

export function RoundProvider({ children }) {
    const [roundValue, setRound] = useState(0)

    const addRound = () => {
        setRound(roundValue + 1)
        console.log("addRound", roundValue)
    }

    const setRoundValue = (value) => {
        setRound(parseInt(value))
    }

    return (
        <RoundContext.Provider value={{ roundValue, addRound, setRoundValue }}>
            {children}
        </RoundContext.Provider>
    )
}
