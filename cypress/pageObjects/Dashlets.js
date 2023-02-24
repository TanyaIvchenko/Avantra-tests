class Dashlets {

    elements = {
        getDashletTitleAtAdding: () => cy.get('avantra-dashlet-selector-item'),
        getDashletCategory: () => cy.get('.dashlet-selector-categories__wrapper'),
        getDashletCardTitle: () => cy.get('.avantra-dashlet-header .mat-card-title'),
        getDashletSearch:() => cy.get('[formcontrolname="searchTerm"] input'),
        getTitle: () => cy.get('[formcontrolname="title"] input'),
        getSubtitle: () => cy.get('[formcontrolname="subtitle"] input'),
        getSaveButton: () => cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]'),
        getTableRow: () => cy.get('tbody tr'),
        getTableCell: () => cy.get('tbody td'),

        getCheckSelectorDropdown: () => cy.get('.dashlet-settings__param span')
                                        .contains('Check Selector') 
                                        .siblings('div.dashlet-settings__param--content'),

        getDashletHeadline: () => cy.get(".avantra-dashlet__headline"),
        getChartTitle: () => cy.get('.avantra-dashlet__info'),
        getCheckSelectorItem: () => cy.get('avantra-dashlet-settings-check-selector .ng-dropdown-panel-items'),
        getCheckCountByStatus: () => cy.get('.status-card__content .status-card__content-names-status-count'),

        getDashletSettingsButton: () =>cy.get('.avantra-drawer__content .avantra-dashlet__header [mattooltip="Dashlet Settings"]'),
        getRefreshIntervalValue: () => cy.get('[role="listbox"] .ng-star-inserted'),
        getSystemPredefinedDropdown: () => cy.get('avantra-dashlet-settings-system-predefined ng-select'),
        getSystemPredefinedValue: () => cy.get('.ng-dropdown-panel-items .ng-star-inserted'),

        getRadioButton: (butTitle) => cy.get('.radio-button__label').contains(butTitle).siblings('span'),
        getRadioButtonMark: (butTitle) => cy.get('.radio-button__label').contains(butTitle).siblings('.radio-button__input'),
        getSettingInput: (inputTitle) => cy.get('.dashlet-settings__param').contains(inputTitle).siblings('.dashlet-settings__param--content').within(() => {
            cy.get('input')
       }),

        getSettingParamTitle: () => cy.get('.dashlet-settings__param--title'),
        getSettingDropdownByTitle: (titleParam) => cy.get('.dashlet-settings__param--title')
            .contains(titleParam)
            .parent()
            .within(() => { cy.get('avantra-dashlet-settings .ng-dropdown-panel-items')}),
        getSettingDropdownItems: () => cy.get('avantra-dashlet-settings .ng-dropdown-panel-items'),

        getCheckboxByLabel: (checkboxLabel) => cy.get('label').contains(checkboxLabel).siblings('.custom-checkbox__checkmark'),
        getCheckmarkByLabel: (checkboxLabel) => cy.get('label').contains(checkboxLabel).siblings('input'),

        getMultiChoiceRadio: (radioLabel) => cy.get('.ng-placeholder').contains(radioLabel).parents('.ng-select-multiple'),
        getMultiChoiceItem: () => cy.get('.ng-dropdown-panel .ng-option.ng-star-inserted'),
        getDropdownArrow: (multiLabel) => cy.get('.ng-placeholder').contains(multiLabel).parents('.ng-select-container').within(() => {
                 cy.get('.ng-arrow-wrapper')
            }),
            getChartBar: () => cy.get('.highcharts-series rect'),
            getPiePiece: () =>cy.get('.highcharts-pie-series'),
    
            getBarStatusOk: () => cy.get('.highcharts-series-group rect:first-of-type'),
            getBarStatusWarn: () => cy.get('.highcharts-series-group rect:nth-of-type(2)'),
            getBarStatusCrit: () => cy.get('.highcharts-series-group rect:nth-of-type(3)'),
            getPieStatusOk: () => cy.get('.highcharts-series-group path:first-of-type'),
            getPieStatusWarn: () => cy.get('.highcharts-series-group path:nth-of-type(2)'),
            getPieStatusCrit: () => cy.get('.highcharts-series-group path:nth-of-type(3)'),
            getBarTooltip: () => cy.get('.highcharts-tooltip-container g'),
            getBarTooltipCount: () => cy.get('div.highcharts-label.highcharts-tooltip b'),

        getSysSelectorInfo: () => cy.get('.server-info__server-name .server-info__server-title'),
        getResourceInfo: () => cy.get('.server-info__server-name .server-info__server-subtitle'),
        getChartLabels:() => cy.get('.highcharts-xaxis-labels span'),
        getChartLabelsY: () => cy.get('.highcharts-yaxis-labels span'),
        getPaginatorRangeLabel: () => cy.get('.mat-paginator-range-actions .mat-paginator-range-label'),
            getFirstPageButton: () => cy.get('[aria-label="First page"]'),
            getPreviousPageButton: () => cy.get('[aria-label="Previous page"]'),
            getNextPageButton: () => cy.get('[aria-label="Next page"]'),
            getLastPageButton: () => cy.get('[aria-label="Last page"]'),
        getPageNumberDropdown: () => cy.get('mat-form-field.mat-paginator-page-size-select'),
            getPaginatorValue: (pageNum) => cy.get('.mat-option-text').contains(pageNum).parent('mat-option'),    

            getTableHeaders: () => cy.get('.mat-header-row th.mat-header-cell'),
            getTableRows: () => cy.get('[aria-label="avantra-table"]'),
            getItemsPerPage: () => cy.get('.item-in-page'),
            
            getLogbookDate: () => cy.get('.logbook__days-name'),

            getRtmCheckType: () => cy.get('.rtm-check-info-block__check-type'),
            getRtmCheckSystem: () => cy.get('.rtm-check-info-block__check-name'),
            
            getChangesMonth: () => cy.get('.changes__months-name'),
            getSlaMonth: () => cy.get('.sla-violations__months-name'),
        getTimezone: () => cy.get('.timezone__row span'),
        getTimezoneTime: (timezone) => cy.get('.timezone__row').contains(timezone).siblings('.timezone__col--bold'),
        getTimezoneName: () => cy.get('.timezone__row .timezone__col--bold'),
        getErrormessage: () => cy.get('.error-message .mat-simple-snackbar')
    }
    saveDashlet() {
        this.elements.getSaveButton().click()
    }
    selectDashletCategory(category) {
        this.elements.getDashletCategory().contains(category).click()
    }
    addDashlet(dashlet) {
        this.elements.getDashletTitleAtAdding().contains(dashlet).parents('avantra-dashlet').siblings('.dashlet-selector-item__button').click()
    }

    // openCheckSelectorDropdown() {
    //     this.elements.getCheckSelectorDropdown().click()
    // }

    openDashletSettings() {
        this.elements.getDashletSettingsButton().click()
    }
    openSystemPredefinedDropdown() {
        this.elements.getSystemPredefinedDropdown().click()
    }
    // getRadioButtonByTitle(butTitle) {
    //     this.elements.getRadioButton().contains(butTitle).siblings('.radio-button__input')

    openSettingDropdownByTitle(paramTitle) {
        this.elements.getSettingParamTitle().contains(paramTitle).siblings('.dashlet-settings__param--content').click()
    }
    focusSettingByTitle(paramTitle) {
        this.elements.getSettingParamTitle().contains(paramTitle).siblings('.dashlet-settings__param--content')

    }
    checkRadio() {
        this.elements.getMultiChoiceRadio().click()
    }
    checkCheckboxByLabel() {
        this.elements.getCheckboxByLabel().click()
    }
    selectMultiChoiceItem(multiItem) {
        this.elements.getMultiChoiceItem().contains(multiItem).click()
    }
    selectDropdownItem(itemName) {
        this.elements.getSettingDropdownItems().contains(itemName).click()
    }
    findTimeByTimezone(timezone){
        this.elements.getTimezone().contains(timezone).siblings('.timezone__col--bold')
    }
}
export default Dashlets