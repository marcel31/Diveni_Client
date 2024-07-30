import { createContext, useContext, useState } from "react";

const QuestionContext = createContext();

export function useQuestion() {
    return useContext(QuestionContext);
}

export function QuestionProvider({ children }) {
    const [roomCodeValue, setRoomCode] = useState("");
    const [questionValue, setQuestion] = useState({});
    const [mounted, setMounted] = useState(false);

    return (
        <QuestionContext.Provider value={{ roomCodeValue, setRoomCode, questionValue, setQuestion, mounted, setMounted }}>
            {children}
        </QuestionContext.Provider>
    );
}