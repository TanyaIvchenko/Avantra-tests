class Dashlets {

    elements = {
        getDashletTitleAtAdding: () => cy.get('avantra-dashlet-selector-item'),
        getDashletCategory: () => cy.get('.dashlet-selector-categories__wrapper'),
        getDashletCardTitle: () => cy.get('.avantra-dashlet-header .mat-card-title'),
        getTitle: () => cy.get('[formcontrolname="title"] input'),
        getSubtitle: () => cy.get('[formcontrolname="subtitle"] input'),
        getSaveButton: () => cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]'),
        getTableRow: () => cy.get('.mat-table tr.mat-row'),

        getCheckSelectorDropdown: () => cy.get('.dashlet-settings__param span')
                                        .contains('Check Selector') 
                                        .siblings('div.dashlet-settings__param--content'),

        getCheckSelectorHeadline: () => cy.get(".avantra-dashlet__headline"),
        getChartTitle: () => cy.get('.avantra-dashlet__info'),
        getCheckSelectorItem: () => cy.get('avantra-dashlet-settings-check-selector .ng-dropdown-panel-items'),
        getCheckCountByStatus: () => cy.get('.status-card__content .status-card__content-names-status-count'),

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
        getDashletSettingsButton: () =>cy.get('.avantra-drawer__content .avantra-dashlet__header [mattooltip="Dashlet Settings"]'),
        getRefreshIntervalValue: () => cy.get('[role="listbox"] .ng-star-inserted'),
        getSystemPredefinedDropdown: () => cy.get('avantra-dashlet-settings-system-predefined'),
        getSystemPredefinedValue: () => cy.get('avantra-dashlet-settings-system-predefined .ng-star-inserted'),

        getRadioButton: (butTitle) => cy.get('.radio-button__label').contains(butTitle).siblings('span'),
        getRadioButtonMark: (butTitle) => cy.get('.radio-button__label').contains(butTitle).siblings('.radio-button__input'),

        getSettingParamTitle: () => cy.get('.dashlet-settings__param--title'),
        getSettingDropdownByTitle: (titleParam) => cy.get('.dashlet-settings__param--title')
            .contains(titleParam)
            .parent()
            .within(() => { cy.get('avantra-dashlet-settings-combo .ng-dropdown-panel-items')}),
        getSettingDropdownItems: () => cy.get('avantra-dashlet-settings-combo .ng-dropdown-panel-items'),

        getCheckboxByLabel: (checkboxLabel) => cy.get('label').contains(checkboxLabel).siblings('.custom-checkbox__checkmark'),
        getCheckmarkByLabel: (checkboxLabel) => cy.get('label').contains(checkboxLabel).siblings('input'),

        getMultiChoiceRadio: (radioLabel) => cy.get('.ng-placeholder').contains(radioLabel).parents('.ng-select-multiple'),
        getMultiChoiceItem: () => cy.get('.ng-dropdown-panel .ng-option.ng-star-inserted'),
        getDropdownArrow: (multiLabel) => cy.get('.ng-placeholder').contains(multiLabel).parents('.ng-select-container').within(() => {
                 cy.get('.ng-arrow-wrapper')
            })
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
}
export default Dashlets