export default class PrintUtils {

     static getPrintDate() {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    
        const d = new Date();
        return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getUTCFullYear();
    }
    
     static removeElementsForPrint(listOfElements) {
        listOfElements.forEach(function(item) {
            if (document.getElementsByClassName(item)[0]) {
                document.getElementsByClassName(item)[0].classList.add("govuk-!-display-none-print")
            }
        });
    }

}


