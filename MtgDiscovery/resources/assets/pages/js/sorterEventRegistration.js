let sorterEventRegistration = (function(sorter, display){

    function registerEvent(sortItems, updateSorter) {
        $.each(sortItems, function (index, item) {
            $(`#${item.domId}`).change(function () {
                // this will contain a reference to the checkbox
                if (!this.checked) return
                updateSorter(item);
                display.show()
            });
        })
    }

    function registerSorters(sortItems) {
        registerEvent(sortItems, item =>  sorter.updateSort(item.value));
    }
    function registerOrderers(sortItems) {
        registerEvent(sortItems, item => sorter.updateOrder(item.value));
    }

    function register(typeItems, orderItems){
        registerSorters(typeItems);
        registerOrderers(orderItems);
    }

    return {
        sorters:register
    }
});
let setSorterEventRegistration = (function(display){
    return sorterEventRegistration(setSorterClosure, display)
});
let cardSorterEventRegistration = (function(display){
    return sorterEventRegistration(cardSorterClosure, display)
});