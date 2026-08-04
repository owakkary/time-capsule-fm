// Quiz constants shared between the (server-only) batch generation script
// and the (client) EpisodeQuiz component. Kept separate from
// content-generation.ts because that file pulls in firebase-admin and
// can't be imported from client components.

export const QUIZ_QUESTION_COUNT = 5;
export const QUIZ_PASS_THRESHOLD = 4;
