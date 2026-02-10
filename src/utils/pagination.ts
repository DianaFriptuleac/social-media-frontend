export function getPaginationRange(
    currentPage: number,
    totalPage: number,
    maxButtons = 5
): number[] {

    if (totalPage <= 1) return [];

    const half = Math.floor(maxButtons / 2);

    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPage - 1, start + maxButtons - 1);

    // se siamo vicini alla fine, spostiamo indietro lo start
    start = Math.max(0, end - (maxButtons - 1));

    const pages: number[] = [];
    for (let p = start; p <= end; p++) {
        pages.push(p);
    }
    return pages;
}