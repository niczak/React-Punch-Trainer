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

// Define Muay Thai strikes
const muayThaiStrikes = [
    "Left Elbow",
    "Right Elbow",
    "Left Knee",
    "Right Knee",
    "Left Kick",
    "Right Kick",
];

const timeOut = 20; // Seconds

// Function to generate a random punch combination
const getRandomCombination = (includeMuayThai: boolean): (number | string)[] => {
    // Decide if we'll include a duck (50% chance)
    const includeDuck = Math.random() < 0.5;

    // If including duck, generate 2-4 punches, otherwise 3-5 punches
    // This ensures total elements (punches + duck) never exceeds 5
    const punchCount = includeDuck
        ? Math.floor(Math.random() * 3) + 2 // 2 to 4 punches if including duck
        : Math.floor(Math.random() * 3) + 3; // 3 to 5 punches if no duck

    const combination: (number | string)[] = [];
    let muayThaiCount = 0;
    const maxMuayThaiStrikes = 2;

    for (let i = 0; i < punchCount; i++) {
        let availableMoves: (number | string)[];

        if (includeMuayThai && muayThaiCount < maxMuayThaiStrikes) {
            // Can choose from both punches and Muay Thai strikes
            availableMoves = [...punches, ...muayThaiStrikes];
        } else {
            // Can only choose from punches (either mode is off or we've hit the limit)
            availableMoves = punches;
        }

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const selectedMove = availableMoves[randomIndex];
        combination.push(selectedMove);

        // Track if we selected a Muay Thai strike
        if (includeMuayThai && muayThaiStrikes.includes(selectedMove as string)) {
            muayThaiCount++;
        }
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
    const [timeLeft, setTimeLeft] = useState(timeOut);
    const [muayThaiMode, setMuayThaiMode] = useState(false);

    useEffect(() => {
        // Generate first combination on load
        setCombination(getRandomCombination(muayThaiMode));
        setTimeLeft(timeOut);

        // Update combination
        const interval = setInterval(() => {
            setCombination(getRandomCombination(muayThaiMode));
            setTimeLeft(timeOut);
        }, timeOut * 1000);

        return () => clearInterval(interval);
    }, [muayThaiMode]);

    useEffect(() => {
        // Countdown timer
        const countdownInterval = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);

    const getMoveDisplay = (move: number | string): string => {
        if (move === "Duck") return move;
        if (typeof move === "number") {
            return `${move} - ${punchDescriptions[move]}`;
        }
        // Muay Thai strikes
        return move;
    };

    const getMoveClassName = (move: number | string): string => {
        if (move === "Duck") return "duck";
        if (typeof move === "number") return "punch";
        // Muay Thai strikes
        return "muay-thai-strike";
    };

    return (
        <div className="container">
            <img
                src="p-c-t.png"
                alt="Punch Combination Trainer"
                className="logo"
            />
            <div className="toggle-container">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={muayThaiMode}
                        onChange={(e) => setMuayThaiMode(e.target.checked)}
                        className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">Muay Thai Mode</span>
                </label>
            </div>
            <div className="combination">
                {combination.map((move, index) => (
                    <span key={index} className={getMoveClassName(move)}>
                        {getMoveDisplay(move)}
                    </span>
                ))}
            </div>
            <p>New combo in {timeLeft} seconds!</p>
            <div className="footer">
                <p>Created by @niczak</p>
                <div className="social-links">
                    <a
                        href="https://github.com/niczak"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a
                        href="https://linkedin.com/in/niczak"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a
                        href="https://twitter.com/niczak"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default App;
