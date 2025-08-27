interface TimerTypes {
    intervalId: NodeJS.Timer | null
    businessAreaTitle: string
    displayingBusinessAreaName: boolean
    updatedPageTitle: string
    updateAndTogglePageTitle: (newPageTitleText: string) => void
    stopTogglingPageTitle: () => void
}

export const timerUtils: TimerTypes = {
    intervalId: null,
    businessAreaTitle: document.title,
    displayingBusinessAreaName: true,
    updatedPageTitle: '',

    updateAndTogglePageTitle(newPageTitleText: string) {
        if (this.updatedPageTitle !== newPageTitleText) {
            this.updatedPageTitle = newPageTitleText
            document.title = newPageTitleText
            this.displayingBusinessAreaName = false
        }

        if (!this.intervalId && this.updatedPageTitle) {
            this.intervalId = setInterval(() => {
                document.title = this.displayingBusinessAreaName ? this.updatedPageTitle : this.businessAreaTitle
                this.displayingBusinessAreaName = !this.displayingBusinessAreaName
            }, 2000)
        }
    },

    stopTogglingPageTitle() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
            document.title = this.businessAreaTitle
            this.displayingBusinessAreaName = true
        }
    }
}