type TimerCircleProps = {
    total: number;
    remaining: number;
};

export function TimerCircle({ total, remaining }: TimerCircleProps) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    const progress = (total - remaining) / total;
    const dashOffset = circumference * (1 - progress);

    const isDanger = remaining <= 10;

    const mm = Math.floor(remaining / 60);
    const ss = remaining % 60;

    const display = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

    return (
        <div className="relative flex size-16 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">

                <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                />

                <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    className={isDanger ? "stroke-destructive" : "stroke-primary"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                />
            </svg>

            <span
                className={isDanger ? "text-xs font-bold text-destructive" : "text-xs font-bold text-foreground"}
            >
                {display}
            </span>
        </div>
    );
}