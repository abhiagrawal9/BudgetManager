// Budget Controller
let bugdetController = (function () {
    // Expense function constructor
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    // Income function constructor
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // Calculate the total of all incomes or expenses
    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    // data structure to store the data
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        deleteItem: function (type, id) {
            let idsArray, index;
            // returns an array of same length with value of ids as implemented below
            idsArray = data.allItems[type].map(function (currentObject, index, entireArray) {
                return currentObject.id;
            });
            index = idsArray.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1); // splice(Postion at we want to delete, how many elements)
            }
        },
        calculateBudget: function () {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate total budget (total income - total expenses)
            data.budget = Math.round(data.totals.inc - data.totals.exp);
            // calculate the percentage of income we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            let percentages;
            percentages = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
            return percentages;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function () {
            console.log(data);
        }
    }
})();

// UI Controller
let UIController = (function () {
    // Object to store all dom locators
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel:'.item__percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: Number.parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            let html, newHtml, element;
            // Create HTMl strings with placeholders text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id = "exp-%id%" ><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placehoder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (selectorID) {
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields: function () {
            let fields, fieldsArray;
            // using querySelectorAll method which returns a list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            // converting list to an Array
            fieldsArray = Array.prototype.slice.call(fields);
            // Looping through an array using for-each method
            fieldsArray.forEach(function (currentValue, index, entireArray) {
                currentValue.value = '';
            });
            fieldsArray[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLable).textContent = '---';
            }
        },
        displayPercentage: function (percentages) {
            let fields;
            fields = document.querySelectorAll(DOMstrings.expensePercentageLabel); // returns a node list

            // for loop over node list , we need a for each function as created below
            let nodeListForEach = function (nodeList, callback) {
                for (let i = 0; i < nodeList.length; i++) {
                    callback(nodeList[i], i);
                }
            };
            nodeListForEach(fields, function (current, indez) {
                if (percentages[indez] > 0) {
                    current.textContent = percentages[indez] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

// Global App Controller
let controller = (function (bugdetCont, UICont) {
    // function to set up all the event listeners
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    // function to add the item and update the budget
    let ctrlAddItem = function () {
        let input, newItem;
        // get the fields input data
        input = UICont.getInput();
        // add data to data structure only if description & number are valid
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            newItem = bugdetCont.addItem(input.type, input.description, input.value);
            // Add the item to the UI
            UICont.addListItem(newItem, input.type);
            // Clear the fields
            UICont.clearFields();
            // Calculate and update budget
            updateBudget();
            // Update the expense percentages
            updatePercentages();
        }
    };
    // function to delete an item and update the budget
    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        // Delete the data from data structure
        bugdetCont.deleteItem(type, ID);
        // Delete the item from UI
        UICont.deleteListItem(itemID);
        // Recalculate & Update the budget UI
        updateBudget();
        // Update the expense percentages
        updatePercentages();
    };
    // function to calculate and update the budget
    let updateBudget = function () {
        // calculate budget
        bugdetCont.calculateBudget();
        // return the budget
        let budget = bugdetCont.getBudget();
        // update the budget UI
        UICont.displayBudget(budget);
    };
    let updatePercentages = function () {
        // calculate percentages
        bugdetCont.calculatePercentages();
        // get the percentages
        let percentages = bugdetCont.getPercentages();
        // update the percentages in UI
        UICont.displayPercentage(percentages);
    };
    return {
        init: function () {
            UICont.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setUpEventListeners();
        }

    }
})(bugdetController, UIController);

//Initialize the app controller
controller.init();


