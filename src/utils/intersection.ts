export const intersection = <T>(...sets: Set<T>[]) => {
    if (sets.length === 0) throw new Error('Function intersection must be called with at least one argument.');
    if (sets.length === 1) return sets[0];

    const [thisSet, ...otherSets] = sets;
    const result = new Set<T>(thisSet);

    result.forEach((value) => {
        if (otherSets.some((otherSet) => !otherSet.has(value))) {
            result.delete(value);
        }
    });

    return result;
};
