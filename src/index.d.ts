export interface Array<T> {
    sortBy(callback: (x: T) => any): Array<T>;
    sortByDesc(callback: (x: T) => any): Array<T>;
    sortByIdList(idList: string[], balanceList: number[]): Array<T>;
    groupBy<T>(xs: T[], key: string): { [key: string]: T[] }

}