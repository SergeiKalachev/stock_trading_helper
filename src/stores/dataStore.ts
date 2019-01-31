class DataStore {
    selectionChangedEvent: OfficeExtension.EventHandlerResult<
        Excel.WorksheetSelectionChangedEventArgs
    > = null;
    sheetActivatedEvent: OfficeExtension.EventHandlerResult<
        Excel.WorksheetActivatedEventArgs
    > = null;
    addressForCountIndicators: string = null;
    SMARangeAddress: string = null;
    EMARangeAddress: string = null;
    ROCRangeAddress: string = null;

    SMAValues: any[];
    EMAValues: any[];
    ROCValues: any[];
    prices: any[];
}

const dataStore = new DataStore();

export default dataStore;
