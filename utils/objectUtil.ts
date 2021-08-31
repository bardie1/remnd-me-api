export class ObjectUtil {
    public static convertObjectsInArray<T>(arr: any[], type: {new(v:any): T} ): T[] {
       return arr.map(a => new type(a));
    }
}