// export interface IQuestion extends Timestamp {
//     questions: {
//         id: string
//         text: string
//         examId: string
//         immutable: true,
//         answers: IAnswer[]
//     }[]
// }

interface IAnswer {
    id: string
    text: string
    isCorrect: boolean
}


export interface IQueItem {
    id: string
    text: string
    examId: string
    immutable: boolean,
    answers: IAnswer[];
    isNew?: boolean;
}


export interface IPayloadSubmissions {
    examId: string;
    answers: {
        questionId: string;
        answerId?: string;
    }[]
    startedAt: string

}




interface ExamBrief {
    id: string;
    title: string;
    duration: number;
}

export interface ISubmission {
    id: string;
    userId: string;
    examId: string;
    examTitle: string;
    exam: ExamBrief;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    startedAt: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface IQuestionAnalytics {
    questionId: string;
    questionText: string;
    selectedAnswer: {
        id: string;
        text: string;
    };
    isCorrect: boolean;
    correctAnswer: {
        id: string;
        text: string;
    };
}
export interface IResponseSubmissions {
    message: string;
    submission: ISubmission;
    analytics: IQuestionAnalytics[];
}


export interface IQuestionInfo {
    question: {
        id: string
        text: string
        examId: string
        immutable: boolean
        createdAt: string
        updatedAt: string
        answers: {
            id?: string
            text: string    
            isCorrect: boolean
        }[];
        exam: {
            id: string
            title: string
        }
    }

}



export interface Answer {
    id: string
    text: string
    isCorrect: boolean
}

interface ExamQuestion {
    id: string
    text: string
    examId: string
    immutable: boolean,
    answers: Answer[]
    isNew?: boolean
}


interface IQuestionBulk {
    questions: {
        text: string
        answers: {
            text: string
            isCorrect: boolean
        }[]
    }[]
}

export interface ICreateQuestion {
    text: string
    answers: {
        text: string
        isCorrect: boolean
    }[]
}

export interface IQuestionUpdate {
    text: string
    answers: {
        text: string
        isCorrect: boolean
    }[]
}