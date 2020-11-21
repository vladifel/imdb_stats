export const getVotesString = (votesNumber: number): string => {
    let votesString = '';
    const votes = votesNumber.toString();
    for (let i = 0; i < votes.length; i++) {
        (votes.length - i) % 3 === 0 && i !== 0
            ? votesString += `,${votes[i]}`
            : votesString += votes[i];
    }
    return votesString;
};