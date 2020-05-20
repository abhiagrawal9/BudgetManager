// Budget Controller
let bugdetController = (function () {
        
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function (type, description, value) {
            let newItem, ID;
            // Create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create new item of inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }
            // Push it into our data strucutre
            data.allItems[type].push(newItem);
            // return the added new item
            return newItem;
        }
    }


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
    };

    let ctrlAddItem = function () {
        let input, newItem;
        // get the fields input data
        input = UICont.getInput();
        // add data to data structure
        newItem = bugdetCont.addItem(input.type, input.description, input.value);
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