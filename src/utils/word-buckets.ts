import { intersection } from './intersection';

export const splitIntoWords = (str: string): string[] => {
    return Array.from(str.match(/\b(\w+)\b/g) || []);
};

export const normalizeWord = (str: string): string => {
    return str.toLocaleLowerCase();
};

export const uniqueWordsInText = (str: string): Set<string> => {
    return new Set(splitIntoWords(str).map(normalizeWord));
};

const removelist = (list: Set<string>) => (word: string) => !list.has(word);

const nonKeyWords = new Set<string>(
    JSON.parse(
        `["i","m","s","me","my","myself","we","us","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","whose","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","will","would","should","can","could","ought","i'm","you're","he's","she's","it's","we're","they're","i've","you've","we've","they've","i'd","you'd","he'd","she'd","we'd","they'd","i'll","you'll","he'll","she'll","we'll","they'll","isn't","aren't","wasn't","weren't","hasn't","haven't","hadn't","doesn't","don't","didn't","won't","wouldn't","shan't","shouldn't","can't","cannot","couldn't","mustn't","let's","that's","who's","what's","here's","there's","when's","where's","why's","how's","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","upon","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","also","very","say","says","said","shall","like","want","enjoy","different","spending","interested","new","time","hobbies","include","lot","1","24","interests","made","mostly","n","j","t"]`
    )
);

export const commonKeyWords = (strs: string[]): Set<string> => {
    const wordSets = strs.map((str) => new Set(splitIntoWords(str).map(normalizeWord).filter(removelist(nonKeyWords))));
    return intersection(...wordSets);
};

export const getKeywords = (str: string) => {
    return new Set(splitIntoWords(str).map(normalizeWord).filter(removelist(nonKeyWords)));
};

export const keywordCounts = (strs: string[]): Record<string, number> => {
    const wordSets = strs.map((str) => new Set(splitIntoWords(str).map(normalizeWord).filter(removelist(nonKeyWords))));
    const bucket: Record<string, number> = {};

    wordSets.forEach((set) => {
        set.forEach((word) => {
            bucket[word] ??= 0;
            bucket[word] ??= 0;
            bucket[word] += 1;
        });
    });

    return bucket;
};
