interface TimerTypes {
    intervalId: NodeJS.Timer | null
    businessAreaTitle: string
    displayingBusinessAreaName: boolean
    updatedPageTitle: string
    updateAndTogglePageTitle: (newPageTitleText: string) => void
    stopTogglingPageTitle: () => void
}

export const TimerUtils: TimerTypes = {
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

        if (!TimerUtils.intervalId && this.updatedPageTitle) {
            TimerUtils.intervalId = setInterval(() => {
                document.title = this.displayingBusinessAreaName ? this.updatedPageTitle : TimerUtils.businessAreaTitle
                this.displayingBusinessAreaName = !this.displayingBusinessAreaName
            }, 2000)
        }
    },

    stopTogglingPageTitle() {
        if (TimerUtils.intervalId) {
            clearInterval(TimerUtils.intervalId)
            TimerUtils.intervalId = null
            document.title = TimerUtils.businessAreaTitle
        }
    }
}