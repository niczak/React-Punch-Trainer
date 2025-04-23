import { useState, useEffect } from "react";
import "./App.css";

// Define punch numbers (1-6)
const punches = [1, 2, 3, 4, 5, 6];
const punchDescriptions: Record<number, string> = {
    1: "Jab",
    2: "Cross",
    3: "Lead Hook",
    4: "Rear Hook",
    5: "Lead Uppercut",
    6: "Rear Uppercut",
};
const timeOut = 30; // Seconds

// Function to generate a random punch combination
const getRandomCombination = (): (number | string)[] => {
    // Decide if we'll include a duck (50% chance)
    const includeDuck = Math.random() < 0.5;

    // If including duck, generate 2-4 punches, otherwise 3-5 punches
    // This ensures total elements (punches + duck) never exceeds 5
    const punchCount = includeDuck
        ? Math.floor(Math.random() * 3) + 2 // 2 to 4 punches if including duck
        : Math.floor(Math.random() * 3) + 3; // 3 to 5 punches if no duck

    const combination: (number | string)[] = [];

    for (let i = 0; i < punchCount; i++) {
        combination.push(punches[Math.floor(Math.random() * punches.length)]);
    }

    // Add duck in a position other than first or last if decided
    if (includeDuck) {
        const duckIndex =
            Math.floor(Math.random() * (combination.length - 1)) + 1;
        combination.splice(duckIndex, 0, "Duck");
    }

    return combination;
};

const App = () => {
    const [combination, setCombination] = useState<(number | string)[]>([]);

    useEffect(() => {
        // Generate first combination on load
        setCombination(getRandomCombination());

        // Update combination
        const interval = setInterval(() => {
            setCombination(getRandomCombination());
        }, timeOut * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <h1>Punch Combination Trainer</h1>
            <div className="combination">
                {combination.map((move, index) => (
                    <span
                        key={index}
                        className={move === "Duck" ? "duck" : "punch"}
                    >
                        {move === "Duck"
                            ? move
                            : `${move} - ${punchDescriptions[move as number]}`}
                    </span>
                ))}
            </div>
            <p>New combo every {timeOut} seconds!</p>
        </div>
    );
};

export default App;
