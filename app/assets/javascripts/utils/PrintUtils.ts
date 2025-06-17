export default class PrintUtils {

    static getPrintDate(): string {

        const monthNames: string[] = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const d: Date = new Date();
        return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getUTCFullYear();
    }
}


