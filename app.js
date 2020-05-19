// Budget Controller
let bugdetController = (function () {
    
})();

// UI Controller
let UIController = (function () {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

// Global App Controller
let controller = (function (bugdetCont, UICont) {
    
    let setUpEventListeners = function () {
        // to get the dom strings object from ui controller
        let DOM = UICont.getDOMstrings();
        // for pressing the add + button in page
        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);
        // for pressing the enter key anywhere in page
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) { // some browsers doesn't support keycode.
                ctrlAddItem();
            }
        });
    }

    let ctrlAddItem = function () {
        // get the fields input data
        let input = UICont.getInput();
        // add data to data structure
        // update the list UI
        // calculate budget
        // update the budget UI
    };

    return {
        init: function () {
            setUpEventListeners();
        }

    }

})(bugdetController, UIController);

controller.init();