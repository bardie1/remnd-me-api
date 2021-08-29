export class GenerateUtil {
    public static generateVerificationCode(): string {
        let s = '';

        for (let i = 0; i < 6; i++) {
            let num = Math.floor(Math.random() * 9);
            s += num.toString();
        }

        return s;
    }
}